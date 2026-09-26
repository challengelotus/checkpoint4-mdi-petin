export interface EventoCalendario {
  id: string;
  hora: string; 
  titulo: string;
  tipo: 'CONSULTA' | 'VACINA' | 'MEDICAMENTO';
  petNome?: string;
}

export interface CriarConsultaDTO {
  petId: string;
  local?: string;
  observacao?: string;
  dataHora: string; 
}

export interface CalendarioService {
  obterDiasComEventosNoMes(petId: string, ano: number, mes: number): Promise<string[]>;
  obterEventosDoDia(petId: string, dataIso: string): Promise<EventoCalendario[]>;
  agendarConsulta(dados: CriarConsultaDTO): Promise<void>;
}