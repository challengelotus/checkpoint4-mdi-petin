import { supabase } from './client';
import { CalendarioService, EventoCalendario, CriarConsultaDTO } from '../../types/calendario';

export const calendarioService: CalendarioService = {
  // 1. Retorna uma lista de strings YYYY-MM-DD com os dias que têm eventos no mês
  async obterDiasComEventosNoMes(petId: string, ano: number, mes: number): Promise<string[]> {
    const mesFormatado = String(mes).padStart(2, '0');
    const inicioMes = `${ano}-${mesFormatado}-01T00:00:00.000Z`;
    // Pega o último dia do mês
    const ultimoDia = new Date(ano, mes, 0).getDate();
    const fimMes = `${ano}-${mesFormatado}-${String(ultimoDia).padStart(2, '0')}T23:59:59.999Z`;

    const [vacinasRes, medsRes, consultasRes] = await Promise.all([
      supabase
        .from('vacinas')
        .select('doses_vacinas!inner(data_prevista)')
        .eq('pet_id', petId)
        .gte('doses_vacinas.data_prevista', inicioMes.split('T')[0])
        .lte('doses_vacinas.data_prevista', fimMes.split('T')[0]),

      supabase
        .from('medicamentos')
        .select('doses_medicamentos!inner(data_prevista)')
        .eq('pet_id', petId)
        .gte('doses_medicamentos.data_prevista', inicioMes)
        .lte('doses_medicamentos.data_prevista', fimMes),

      supabase
        .from('consultas')
        .select('data_hora')
        .eq('pet_id', petId)
        .gte('data_hora', inicioMes)
        .lte('data_hora', fimMes),
    ]);

    const diasSet = new Set<string>();

    vacinasRes.data?.forEach((v: any) => {
      v.doses_vacinas?.forEach((d: any) => {
        if (d.data_prevista) diasSet.add(d.data_prevista.split('T')[0]);
      });
    });

    medsRes.data?.forEach((m: any) => {
      m.doses_medicamentos?.forEach((d: any) => {
        if (d.data_prevista) diasSet.add(d.data_prevista.split('T')[0]);
      });
    });

    consultasRes.data?.forEach((c: any) => {
      if (c.data_hora) diasSet.add(c.data_hora.split('T')[0]);
    });

    return Array.from(diasSet);
  },

  // 2. Busca o detalhamento dos eventos de um dia específico (YYYY-MM-DD)
  async obterEventosDoDia(petId: string, dataIso: string): Promise<EventoCalendario[]> {
    const inicioDia = `${dataIso}T00:00:00.000Z`;
    const fimDia = `${dataIso}T23:59:59.999Z`;

    const [vacinasRes, medsRes, consultasRes] = await Promise.all([
      supabase
        .from('vacinas')
        .select('nome, doses_vacinas!inner(id, data_prevista)')
        .eq('pet_id', petId)
        .eq('doses_vacinas.data_prevista', dataIso),

      supabase
        .from('medicamentos')
        .select('nome, doses_medicamentos!inner(id, data_prevista)')
        .eq('pet_id', petId)
        .gte('doses_medicamentos.data_prevista', inicioDia)
        .lte('doses_medicamentos.data_prevista', fimDia),

      supabase
        .from('consultas')
        .select('id, local, observacao, data_hora')
        .eq('pet_id', petId)
        .gte('data_hora', inicioDia)
        .lte('data_hora', fimDia),
    ]);

    const eventos: EventoCalendario[] = [];

    // Processa Consultas
    consultasRes.data?.forEach((c: any) => {
      const hora = new Date(c.data_hora).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
      eventos.push({
        id: c.id,
        hora,
        titulo: c.observacao || c.local || 'Consulta Médica',
        tipo: 'CONSULTA',
      });
    });

    // Processa Medicamentos
    medsRes.data?.forEach((m: any) => {
      m.doses_medicamentos?.forEach((d: any) => {
        const hora = new Date(d.data_prevista).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        });
        eventos.push({
          id: d.id,
          hora,
          titulo: `${m.nome}`,
          tipo: 'MEDICAMENTO',
        });
      });
    });

    // Processa Vacinas
    vacinasRes.data?.forEach((v: any) => {
      v.doses_vacinas?.forEach((d: any) => {
        eventos.push({
          id: d.id,
          hora: 'Dia Todo',
          titulo: `Vacina ${v.nome}`,
          tipo: 'VACINA',
        });
      });
    });

    // Ordena os eventos do dia pelo horário
    return eventos.sort((a, b) => a.hora.localeCompare(b.hora));
  },

  // 3. Cadastrar novos compromissos e consultas
  async agendarConsulta(dados: CriarConsultaDTO): Promise<void> {
    const { error } = await supabase.from('consultas').insert({
      pet_id: dados.petId,
      local: dados.local,
      observacao: dados.observacao,
      data_hora: dados.dataHora,
    });

    if (error) throw new Error(`Erro ao agendar consulta: ${error.message}`);
  },
};