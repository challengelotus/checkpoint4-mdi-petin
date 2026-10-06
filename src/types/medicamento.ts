export type StatusDoseMedicamento = 'PENDENTE' | 'CONCLUIDO' | 'ATRASADO';

export interface DoseMedicamento {
  id: string;
  medId: string;
  numeroDose: string;
  dataPrevista: string;
  dataAplicacao?: string;
  status: StatusDoseMedicamento;
}

export interface Medicamento {
  id: string;
  petId: string;
  nome: string;
  dosagem?: string;
  observacoes?: string;
  doses?: DoseMedicamento[];
}

export interface DoseInputDTO {
  numeroDose: string;
  dataPrevista: string;
}

export interface CriarMedicamentoDTO {
  petId: string;
  nome: string;
  dosagem?: string;
  observacoes?: string;
  doses: DoseInputDTO[];
}

export interface AtualizarMedicamentoDTO {
  nome?: string;
  dosagem?: string;
  observacoes?: string;
}

export interface MedicamentoService {
  listarPorPet(petId: string): Promise<Medicamento[]>;
  buscarPorId(id: string): Promise<Medicamento | null>;
  cadastrar(dto: CriarMedicamentoDTO): Promise<Medicamento>;
  atualizar(id: string, dto: AtualizarMedicamentoDTO): Promise<Medicamento>;
  remover(id: string): Promise<void>;
  atualizarStatusDose(
    doseId: string,
    status: StatusDoseMedicamento,
    dataAplicacao?: string
  ): Promise<DoseMedicamento>;
}