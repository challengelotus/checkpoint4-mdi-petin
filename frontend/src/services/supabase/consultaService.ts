import { supabase } from './client';
import {
  Consulta,
  ConsultaService,
  CriarConsultaDTO,
  AtualizarConsultaDTO,
} from '../../types/consulta';

export const consultaService: ConsultaService = {
  async listarPorPet(petId: string): Promise<Consulta[]> {
    const { data, error } = await supabase
      .from('consultas')
      .select('*')
      .eq('pet_id', petId)
      .order('data_hora', { ascending: true });

    if (error) throw new Error(`Erro ao buscar consultas: ${error.message}`);

    return (data ?? []).map((row) => ({
      id: row.id,
      petId: row.pet_id,
      local: row.local,
      dataHora: row.data_hora,
      observacao: row.observacao,
    }));
  },

  async buscarPorId(id: string): Promise<Consulta | null> {
    const { data, error } = await supabase
      .from('consultas')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      petId: data.pet_id,
      local: data.local,
      dataHora: data.data_hora,
      observacao: data.observacao,
    };
  },

  async cadastrar(consultaData: CriarConsultaDTO): Promise<Consulta> {
    // 1. Descobrir o usuário dono do pet
    const { data: pet, error: petError } = await supabase
      .from('pets')
      .select('usuario_id')
      .eq('id', consultaData.petId)
      .single();

    if (petError || !pet) throw new Error('Pet não encontrado.');

    // 2. Verificar o plano do usuário
    const { data: usuario, error: userError } = await supabase
      .from('usuarios')
      .select('plano')
      .eq('id', pet.usuario_id)
      .single();

    if (userError || !usuario) throw new Error('Usuário não encontrado.');

    // 3. Trava de plano (FREE = máximo 3 consultas cadastradas por pet)
    if (usuario.plano === 'FREE') {
      const { count } = await supabase
        .from('consultas')
        .select('id', { count: 'exact', head: true })
        .eq('pet_id', consultaData.petId);

      if ((count ?? 0) >= 3) {
        throw new Error(
          'LIMITE_PLANO_FREE: O plano Gratuito permite apenas até 3 consultas cadastradas por pet.'
        );
      }
    }

    // 4. Inserção da consulta
    const { data, error } = await supabase
      .from('consultas')
      .insert({
        pet_id: consultaData.petId,
        local: consultaData.local,
        data_hora: consultaData.dataHora,
        observacao: consultaData.observacao,
      })
      .select()
      .single();

    if (error) throw new Error(`Erro ao cadastrar consulta: ${error.message}`);

    return {
      id: data.id,
      petId: data.pet_id,
      local: data.local,
      dataHora: data.data_hora,
      observacao: data.observacao,
    };
  },

  async atualizar(id: string, consultaData: AtualizarConsultaDTO): Promise<Consulta> {
    const payloadUpdate: Record<string, unknown> = {};
    if (consultaData.local !== undefined) payloadUpdate.local = consultaData.local;
    if (consultaData.dataHora !== undefined) payloadUpdate.data_hora = consultaData.dataHora;
    if (consultaData.observacao !== undefined) payloadUpdate.observacao = consultaData.observacao;

    const { data, error } = await supabase
      .from('consultas')
      .update(payloadUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Erro ao atualizar consulta: ${error.message}`);

    return {
      id: data.id,
      petId: data.pet_id,
      local: data.local,
      dataHora: data.data_hora,
      observacao: data.observacao,
    };
  },

  async remover(id: string): Promise<void> {
    const { error } = await supabase.from('consultas').delete().eq('id', id);

    if (error) throw new Error(`Erro ao remover consulta: ${error.message}`);
  },
};