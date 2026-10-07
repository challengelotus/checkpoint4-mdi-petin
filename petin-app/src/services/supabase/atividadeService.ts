import { supabase } from './client';
import { AtividadeService, CardProximaAcaoDTO } from '../../types/atividade';
import { formatarContadorProximaAcao } from '../../utils/date';

export const atividadeService: AtividadeService = {
  async obterProximaAcao(petId: string): Promise<CardProximaAcaoDTO | null> {
    const agoraISO = new Date().toISOString();
    const hojeData = agoraISO.split('T')[0];

    const [vacinasRes, medsRes, consultasRes] = await Promise.all([
      supabase
        .from('vacinas')
        .select('nome, doses_vacinas!inner(data_prevista)')
        .eq('pet_id', petId)
        .eq('doses_vacinas.status', 'PENDENTE')
        .gte('doses_vacinas.data_prevista', hojeData)
        .order('data_prevista', { foreignTable: 'doses_vacinas', ascending: true })
        .limit(1),

      supabase
        .from('medicamentos')
        .select('nome, doses_medicamentos!inner(data_prevista)')
        .eq('pet_id', petId)
        .eq('doses_medicamentos.status', 'PENDENTE')
        .gte('doses_medicamentos.data_prevista', agoraISO)
        .order('data_prevista', { foreignTable: 'doses_medicamentos', ascending: true })
        .limit(1),

      supabase
        .from('consultas')
        .select('local, observacao, data_hora')
        .eq('pet_id', petId)
        .gte('data_hora', agoraISO)
        .order('data_hora', { ascending: true })
        .limit(1),
    ]);

    const candidatos: { data: string; nome: string; tipo: 'VACINA' | 'MEDICAMENTO' | 'CONSULTA' }[] = [];

    if (vacinasRes.data?.[0]?.doses_vacinas?.[0]) {
      candidatos.push({
        data: vacinasRes.data[0].doses_vacinas[0].data_prevista,
        nome: vacinasRes.data[0].nome,
        tipo: 'VACINA',
      });
    }

    if (medsRes.data?.[0]?.doses_medicamentos?.[0]) {
      candidatos.push({
        data: medsRes.data[0].doses_medicamentos[0].data_prevista,
        nome: medsRes.data[0].nome,
        tipo: 'MEDICAMENTO',
      });
    }

    if (consultasRes.data?.[0]) {
      const c = consultasRes.data[0];
      candidatos.push({
        data: c.data_hora,
        nome: c.local ?? c.observacao ?? 'Médica',
        tipo: 'CONSULTA',
      });
    }

    if (candidatos.length === 0) return null;

    candidatos.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
    const eventoMaisProximo = candidatos[0];

    return formatarContadorProximaAcao(
      eventoMaisProximo.data,
      eventoMaisProximo.nome,
      eventoMaisProximo.tipo
    );
  },
};