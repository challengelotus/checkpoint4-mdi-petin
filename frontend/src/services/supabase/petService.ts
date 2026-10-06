import { supabase } from './client';
import { redirecionarParaAssinatura } from '../../utils/planoLimite';
import {
  Pet,
  PetService,
  CriarPetDTO,
  AtualizarPetDTO,
  StatusPet,
  HistoricoPet,
} from '../../types/pet';

async function calcularStatusPet(petId: string): Promise<StatusPet> {
  const agora = new Date().toISOString();
  const hojeData = agora.split('T')[0];
  const emTresDiasDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const emTresDiasISO = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();

  // 1. Doses de Vacinas atrasadas e em atenção
  const { data: vacinas } = await supabase.from('vacinas').select('id').eq('pet_id', petId);
  const vacinaIds = (vacinas ?? []).map((v) => v.id);

  let totalVacinasAtrasadas = 0;
  let totalVacinasAtencao = 0;

  if (vacinaIds.length > 0) {
    const [vAtraso, vAtencao] = await Promise.all([
      supabase.from('doses_vacinas').select('id', { count: 'exact', head: true }).in('vacina_id', vacinaIds).eq('status', 'PENDENTE').lt('data_prevista', hojeData),
      supabase.from('doses_vacinas').select('id', { count: 'exact', head: true }).in('vacina_id', vacinaIds).eq('status', 'PENDENTE').gte('data_prevista', hojeData).lte('data_prevista', emTresDiasDate),
    ]);
    totalVacinasAtrasadas = vAtraso.count ?? 0;
    totalVacinasAtencao = vAtencao.count ?? 0;
  }

  // 2. Doses de Medicamentos atrasadas e em atenção
  const { data: medicamentos } = await supabase.from('medicamentos').select('id').eq('pet_id', petId);
  const medIds = (medicamentos ?? []).map((m) => m.id);

  let totalMedAtrasados = 0;
  let totalMedAtencao = 0;

  if (medIds.length > 0) {
    const [mAtraso, mAtencao] = await Promise.all([
      supabase.from('doses_medicamentos').select('id', { count: 'exact', head: true }).in('med_id', medIds).eq('status', 'PENDENTE').lt('data_prevista', agora),
      supabase.from('doses_medicamentos').select('id', { count: 'exact', head: true }).in('med_id', medIds).eq('status', 'PENDENTE').gte('data_prevista', agora).lte('data_prevista', emTresDiasISO),
    ]);
    totalMedAtrasados = mAtraso.count ?? 0;
    totalMedAtencao = mAtencao.count ?? 0;
  }

  // 3. Consultas atrasadas (data_hora menor que agora)
  const [cAtraso, cAtencao] = await Promise.all([
    supabase.from('consultas').select('id', { count: 'exact', head: true }).eq('pet_id', petId).lt('data_hora', agora),
    supabase.from('consultas').select('id', { count: 'exact', head: true }).eq('pet_id', petId).gte('data_hora', agora).lte('data_hora', emTresDiasISO),
  ]);

  if (totalVacinasAtrasadas + totalMedAtrasados + (cAtraso.count ?? 0) > 0) {
    return 'Atrasado';
  }

  if (totalVacinasAtencao + totalMedAtencao + (cAtencao.count ?? 0) > 0) {
    return 'Atenção';
  }

  return 'Em Dia';
}

export const petService: PetService = {
  async listarPorUsuario(usuarioId: string): Promise<Pet[]> {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('usuario_id', usuarioId)
      .eq('ativo', true)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Erro ao buscar pets: ${error.message}`);

    return Promise.all(
      (data ?? []).map(async (row) => ({
        id: row.id,
        usuarioId: row.usuario_id,
        nome: row.nome,
        especie: row.especie,
        raca: row.raca,
        dataNascimento: row.data_nascimento,
        peso: row.peso ? Number(row.peso) : undefined,
        microchip: row.microchip,
        fotoLink: row.foto_link,
        ativo: row.ativo,
        status: await calcularStatusPet(row.id),
        createdAt: row.created_at,
      }))
    );
  },

  async buscarPorId(id: string): Promise<Pet | null> {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      usuarioId: data.usuario_id,
      nome: data.nome,
      especie: data.especie,
      raca: data.raca,
      dataNascimento: data.data_nascimento,
      peso: data.peso ? Number(data.peso) : undefined,
      microchip: data.microchip,
      fotoLink: data.foto_link,
      ativo: data.ativo,
      status: await calcularStatusPet(data.id),
      createdAt: data.created_at,
    };
  },

  async cadastrar(petData: CriarPetDTO): Promise<Pet> {
    // 1. Trava de plano (FREE = máximo 1 pet ativo)
    const { data: usuario, error: userError } = await supabase
      .from('usuarios')
      .select('plano')
      .eq('id', petData.usuarioId)
      .single();

    if (userError || !usuario) throw new Error('Usuário não encontrado.');

    if (usuario.plano === 'FREE') {
      const { count } = await supabase
        .from('pets')
        .select('id', { count: 'exact', head: true })
        .eq('usuario_id', petData.usuarioId)
        .eq('ativo', true);

      if ((count ?? 0) >= 1) {
        // Em vez de exibir alert, leva o usuário direto para a tela de assinatura
        throw redirecionarParaAssinatura(
          'O plano Gratuito permite apenas 1 pet cadastrado. Assine o Premium para cadastrar mais pets.'
        );
      }
    }

    // 2. Inserção do Pet
    const { data, error } = await supabase
      .from('pets')
      .insert({
        usuario_id: petData.usuarioId,
        nome: petData.nome,
        especie: petData.especie,
        raca: petData.raca,
        data_nascimento: petData.dataNascimento,
        peso: petData.peso,
        microchip: petData.microchip,
        foto_link: petData.fotoLink,
      })
      .select()
      .single();

    if (error) throw new Error(`Erro ao cadastrar pet: ${error.message}`);

    // Registro da carga inicial na tabela historico_pets
    if (petData.peso || petData.fotoLink) {
      await this.registrarHistorico(data.id, petData.peso, petData.fotoLink);
    }

    return {
      id: data.id,
      usuarioId: data.usuario_id,
      nome: data.nome,
      especie: data.especie,
      raca: data.raca,
      dataNascimento: data.data_nascimento,
      peso: data.peso ? Number(data.peso) : undefined,
      microchip: data.microchip,
      fotoLink: data.foto_link,
      ativo: data.ativo,
      status: 'Em Dia',
      createdAt: data.created_at,
    };
  },

  async atualizar(id: string, petData: AtualizarPetDTO): Promise<Pet> {
    const payloadUpdate: any = {};
    if (petData.nome) payloadUpdate.nome = petData.nome;
    if (petData.especie) payloadUpdate.especie = petData.especie;
    if (petData.raca !== undefined) payloadUpdate.raca = petData.raca;
    if (petData.dataNascimento !== undefined) payloadUpdate.data_nascimento = petData.dataNascimento;
    if (petData.peso !== undefined) payloadUpdate.peso = petData.peso;
    if (petData.microchip !== undefined) payloadUpdate.microchip = petData.microchip;
    if (petData.fotoLink !== undefined) payloadUpdate.foto_link = petData.fotoLink;

    const { data, error } = await supabase
      .from('pets')
      .update(payloadUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Erro ao atualizar pet: ${error.message}`);

    if (petData.peso || petData.fotoLink) {
      await this.registrarHistorico(id, petData.peso, petData.fotoLink);
    }

    return {
      id: data.id,
      usuarioId: data.usuario_id,
      nome: data.nome,
      especie: data.especie,
      raca: data.raca,
      dataNascimento: data.data_nascimento,
      peso: data.peso ? Number(data.peso) : undefined,
      microchip: data.microchip,
      fotoLink: data.foto_link,
      ativo: data.ativo,
      status: await calcularStatusPet(id),
      createdAt: data.created_at,
    };
  },

  async remover(id: string): Promise<void> {
    const { error } = await supabase
      .from('pets')
      .update({ ativo: false })
      .eq('id', id);

    if (error) throw new Error(`Erro ao desativar pet: ${error.message}`);
  },

  async uploadFotoPerfil(petId: string, fileBuffer: ArrayBuffer | Blob, fileExtension: string): Promise<string> {
    const fileName = `pets/${petId}_${Date.now()}.${fileExtension}`;

    const { error: uploadError } = await supabase.storage
      .from('petin-midias')
      .upload(fileName, fileBuffer, {
        contentType: `image/${fileExtension}`,
        upsert: true,
      });

    if (uploadError) throw new Error(`Erro no upload da foto: ${uploadError.message}`);

    const { data } = supabase.storage
      .from('petin-midias')
      .getPublicUrl(fileName);

    await this.atualizar(petId, { fotoLink: data.publicUrl });

    return data.publicUrl;
  },

  async obterHistorico(petId: string): Promise<HistoricoPet[]> {
    const { data, error } = await supabase
      .from('historico_pets')
      .select('*')
      .eq('pet_id', petId)
      .order('data_carga', { ascending: true });

    if (error) throw new Error(`Erro ao buscar histórico do pet: ${error.message}`);

    return (data ?? []).map((row) => ({
      id: row.id,
      petId: row.pet_id,
      peso: row.peso ? Number(row.peso) : undefined,
      fotoLink: row.foto_link,
      dataCarga: row.data_carga,
    }));
  },

  async registrarHistorico(petId: string, peso?: number, fotoLink?: string): Promise<HistoricoPet> {
    const { data, error } = await supabase
      .from('historico_pets')
      .insert({
        pet_id: petId,
        peso,
        foto_link: fotoLink,
      })
      .select()
      .single();

    if (error) throw new Error(`Erro ao registrar histórico: ${error.message}`);

    return {
      id: data.id,
      petId: data.pet_id,
      peso: data.peso ? Number(data.peso) : undefined,
      fotoLink: data.foto_link,
      dataCarga: data.data_carga,
    };
  },
};