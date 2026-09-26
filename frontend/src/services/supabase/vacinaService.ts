import { supabase } from './client';
import {
  VacinaService,
  ResumoVacina,
  DetalhesVacina,
  DoseVacina,
  CriarVacinaDTO,
  AtualizarVacinaDTO,
  CriarDoseVacinaDTO,
  AtualizarDoseVacinaDTO,
} from '../../types/vacina';

export const supabaseVacinaService: VacinaService = {
  async listarPorPet(petId: string): Promise<ResumoVacina[]> {
    const { data, error } = await supabase
      .from('vacinas')
      .select(`
        id,
        pet_id,
        nome,
        observacoes,
        doses_vacinas (
          id,
          numero_dose,
          data_prevista,
          status
        )
      `)
      .eq('pet_id', petId)
      .order('nome', { ascending: true });

    if (error) throw new Error(`Erro ao listar vacinas: ${error.message}`);

    return (data ?? []).map((v: any) => {
      const dosesPendentes = (v.doses_vacinas ?? [])
        .filter((d: any) => d.status === 'PENDENTE')
        .sort((a: any, b: any) => new Date(a.data_prevista).getTime() - new Date(b.data_prevista).getTime());

      const proxima = dosesPendentes[0];

      return {
        id: v.id,
        petId: v.pet_id,
        nome: v.nome,
        observacoes: v.observacoes,
        proximaDose: proxima
          ? {
              id: proxima.id,
              numeroDose: proxima.numero_dose,
              dataPrevista: proxima.data_prevista,
              status: proxima.status,
            }
          : undefined,
      };
    });
  },

  async buscarPorId(id: string): Promise<DetalhesVacina | null> {
    const { data, error } = await supabase
      .from('vacinas')
      .select(`
        id,
        pet_id,
        nome,
        observacoes,
        doses_vacinas (
          id,
          vacina_id,
          numero_dose,
          data_prevista,
          data_aplicacao,
          status
        )
      `)
      .eq('id', id)
      .single();

    if (error || !data) return null;

    const dosesOrdenadas = (data.doses_vacinas ?? [])
      .map((d: any) => ({
        id: d.id,
        vacinaId: d.vacina_id,
        numeroDose: d.numero_dose,
        dataPrevista: d.data_prevista,
        dataAplicacao: d.data_aplicacao,
        status: d.status,
      }))
      .sort((a: DoseVacina, b: DoseVacina) => new Date(a.dataPrevista).getTime() - new Date(b.dataPrevista).getTime());

    return {
      id: data.id,
      petId: data.pet_id,
      nome: data.nome,
      observacoes: data.observacoes,
      doses: dosesOrdenadas,
    };
  },

  async cadastrar(dados: CriarVacinaDTO): Promise<ResumoVacina> {
    const { data: pet, error: petError } = await supabase
      .from('pets')
      .select('usuario_id')
      .eq('id', dados.petId)
      .single();

    if (petError || !pet) throw new Error('Pet não encontrado.');

    // Trava Plano FREE (Máximo 5 vacinas)
    const { data: usuario, error: userError } = await supabase
      .from('usuarios')
      .select('plano')
      .eq('id', pet.usuario_id)
      .single();

    if (userError || !usuario) throw new Error('Usuário proprietário não encontrado.');

    if (usuario.plano === 'FREE') {
      const { count } = await supabase
        .from('vacinas')
        .select('id', { count: 'exact', head: true })
        .eq('pet_id', dados.petId);

      if ((count ?? 0) >= 5) {
        throw new Error('LIMITE_PLANO_FREE: O plano Gratuito permite cadastrar no máximo 5 vacinas por pet.');
      }
    }

    const { data: vacinaData, error: vacinaError } = await supabase
      .from('vacinas')
      .insert({
        pet_id: dados.petId,
        nome: dados.nome,
        observacoes: dados.observacoes,
      })
      .select()
      .single();

    if (vacinaError) throw new Error(`Erro ao cadastrar vacina: ${vacinaError.message}`);

    if (dados.doses && dados.doses.length > 0) {
      const payloadDoses = dados.doses.map((dose) => ({
        vacina_id: vacinaData.id,
        numero_dose: dose.numeroDose,
        data_prevista: dose.dataPrevista,
        data_aplicacao: dose.dataAplicacao,
        status: dose.status ?? 'PENDENTE',
      }));

      const { error: dosesError } = await supabase.from('doses_vacinas').insert(payloadDoses);
      if (dosesError) throw new Error(`Erro ao cadastrar doses: ${dosesError.message}`);
    }

    return {
      id: vacinaData.id,
      petId: vacinaData.pet_id,
      nome: vacinaData.nome,
      observacoes: vacinaData.observacoes,
    };
  },

  async atualizar(id: string, dados: AtualizarVacinaDTO): Promise<ResumoVacina> {
    const payload: Record<string, unknown> = {};
    if (dados.nome !== undefined) payload.nome = dados.nome;
    if (dados.observacoes !== undefined) payload.observacoes = dados.observacoes;

    const { data, error } = await supabase
      .from('vacinas')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Erro ao atualizar vacina: ${error.message}`);

    return {
      id: data.id,
      petId: data.pet_id,
      nome: data.nome,
      observacoes: data.observacoes,
    };
  },

  async remover(id: string): Promise<void> {
    const { error } = await supabase.from('vacinas').delete().eq('id', id);
    if (error) throw new Error(`Erro ao remover vacina: ${error.message}`);
  },

  async adicionarDose(vacinaId: string, doseData: CriarDoseVacinaDTO): Promise<DoseVacina> {
    const { data, error } = await supabase
      .from('doses_vacinas')
      .insert({
        vacina_id: vacinaId,
        numero_dose: doseData.numeroDose,
        data_prevista: doseData.dataPrevista,
        data_aplicacao: doseData.dataAplicacao,
        status: doseData.status ?? 'PENDENTE',
      })
      .select()
      .single();

    if (error) throw new Error(`Erro ao adicionar dose: ${error.message}`);

    return {
      id: data.id,
      vacinaId: data.vacina_id,
      numeroDose: data.numero_dose,
      dataPrevista: data.data_prevista,
      dataAplicacao: data.data_aplicacao,
      status: data.status,
    };
  },

  async atualizarDose(doseId: string, doseData: AtualizarDoseVacinaDTO): Promise<DoseVacina> {
    const payload: Record<string, unknown> = {};
    if (doseData.numeroDose !== undefined) payload.numero_dose = doseData.numeroDose;
    if (doseData.dataPrevista !== undefined) payload.data_prevista = doseData.dataPrevista;
    if (doseData.dataAplicacao !== undefined) payload.data_aplicacao = doseData.dataAplicacao;
    if (doseData.status !== undefined) payload.status = doseData.status;

    const { data, error } = await supabase
      .from('doses_vacinas')
      .update(payload)
      .eq('id', doseId)
      .select()
      .single();

    if (error) throw new Error(`Erro ao atualizar dose: ${error.message}`);

    return {
      id: data.id,
      vacinaId: data.vacina_id,
      numeroDose: data.numero_dose,
      dataPrevista: data.data_prevista,
      dataAplicacao: data.data_aplicacao,
      status: data.status,
    };
  },

  async removerDose(doseId: string): Promise<void> {
    const { error } = await supabase.from('doses_vacinas').delete().eq('id', doseId);
    if (error) throw new Error(`Erro ao remover dose: ${error.message}`);
  },
};