import { supabase } from './client';
import { redirecionarParaAssinatura } from '../../utils/planoLimite';
import {
  Documento,
  CriarDocumentoDTO,
  AtualizarDocumentoDTO,
  DocumentoService,
} from '../../types/documento';

async function validarPlanoUsuarioPorPet(petId: string): Promise<string> {
  // Busca o usuario_id através do pet
  const { data: pet, error: petError } = await supabase
    .from('pets')
    .select('usuario_id')
    .eq('id', petId)
    .single();

  if (petError || !pet) throw new Error('Pet não encontrado para validação de plano.');

  // Busca o plano do usuário
  const { data: usuario, error: userError } = await supabase
    .from('usuarios')
    .select('plano')
    .eq('id', pet.usuario_id)
    .single();

  if (userError || !usuario) throw new Error('Usuário não encontrado.');

  return usuario.plano;
}

export const documentoService: DocumentoService = {
  async listarPorPet(petId: string): Promise<Documento[]> {
    const { data, error } = await supabase
      .from('documentos')
      .select('*')
      .eq('pet_id', petId)
      .order('data', { ascending: false });

    if (error) throw new Error(`Erro ao buscar documentos: ${error.message}`);

    return (data ?? []).map((row) => ({
      id: row.id,
      petId: row.pet_id,
      nome: row.nome,
      fotoLink: row.foto_link,
      data: row.data,
    }));
  },

  async buscarPorId(id: string): Promise<Documento | null> {
    const { data, error } = await supabase
      .from('documentos')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      petId: data.pet_id,
      nome: data.nome,
      fotoLink: data.foto_link,
      data: data.data,
    };
  },

  async cadastrar(dados: CriarDocumentoDTO): Promise<Documento> {
    const plano = await validarPlanoUsuarioPorPet(dados.petId);

    // Validação de Plano Premium para documentos/anexos
    if (plano === 'FREE') {
      throw redirecionarParaAssinatura(
        'O envio e anexo de documentos é exclusivo para usuários Premium.'
      );
    }

    const { data, error } = await supabase
      .from('documentos')
      .insert({
        pet_id: dados.petId,
        nome: dados.nome,
        foto_link: dados.fotoLink,
        data: dados.data ?? new Date().toISOString().split('T')[0],
      })
      .select()
      .single();

    if (error) throw new Error(`Erro ao cadastrar documento: ${error.message}`);

    return {
      id: data.id,
      petId: data.pet_id,
      nome: data.nome,
      fotoLink: data.foto_link,
      data: data.data,
    };
  },

  async atualizar(id: string, dados: AtualizarDocumentoDTO): Promise<Documento> {
    const payloadUpdate: any = {};
    if (dados.nome !== undefined) payloadUpdate.nome = dados.nome;
    if (dados.fotoLink !== undefined) payloadUpdate.foto_link = dados.fotoLink;
    if (dados.data !== undefined) payloadUpdate.data = dados.data;

    const { data, error } = await supabase
      .from('documentos')
      .update(payloadUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Erro ao atualizar documento: ${error.message}`);

    return {
      id: data.id,
      petId: data.pet_id,
      nome: data.nome,
      fotoLink: data.foto_link,
      data: data.data,
    };
  },

  async remover(id: string): Promise<void> {
    const { error } = await supabase.from('documentos').delete().eq('id', id);
    if (error) throw new Error(`Erro ao remover documento: ${error.message}`);
  },

  async uploadAnexo(
    petId: string,
    fileBuffer: ArrayBuffer | Blob,
    fileExtension: string
  ): Promise<string> {
    const plano = await validarPlanoUsuarioPorPet(petId);

    if (plano === 'FREE') {
      throw redirecionarParaAssinatura(
        'O upload de anexos de documentos é restrito ao plano Premium.'
      );
    }

    const fileName = `documentos/${petId}_${Date.now()}.${fileExtension}`;

    const { error: uploadError } = await supabase.storage
      .from('petin-midias')
      .upload(fileName, fileBuffer, {
        contentType: `image/${fileExtension}`,
        upsert: true,
      });

    if (uploadError) throw new Error(`Erro no upload do anexo: ${uploadError.message}`);

    const { data } = supabase.storage
      .from('petin-midias')
      .getPublicUrl(fileName);

    return data.publicUrl;
  },
};