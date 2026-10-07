export interface Consulta {
  id: string;
  petId: string;
  local?: string;
  dataHora: string;
  observacao?: string;
}

export interface CriarConsultaDTO {
  petId: string;
  local?: string;
  dataHora: string;
  observacao?: string;
}

export interface AtualizarConsultaDTO extends Partial<CriarConsultaDTO> {}

export interface ConsultaService {
  listarPorPet(petId: string): Promise<Consulta[]>;
  buscarPorId(id: string): Promise<Consulta | null>;
  cadastrar(consultaData: CriarConsultaDTO): Promise<Consulta>;
  atualizar(id: string, consultaData: AtualizarConsultaDTO): Promise<Consulta>;
  remover(id: string): Promise<void>;
}