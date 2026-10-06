export type StatusDose = 'PENDENTE' | 'CONCLUIDO' | 'ATRASADO';

export interface DoseVacina {
  id: string;
  vacinaId: string;
  numeroDose: string;
  dataPrevista: string;
  dataAplicacao?: string;
  status: StatusDose;
}

export interface ResumoVacina {
  id: string;
  petId: string;
  nome: string;
  observacoes?: string;
  proximaDose?: {
    id: string;
    numeroDose: string;
    dataPrevista: string;
    status: StatusDose;
  };
}

export interface DetalhesVacina {
  id: string;
  petId: string;
  nome: string;
  observacoes?: string;
  doses: DoseVacina[];
}

export interface CriarDoseVacinaDTO {
  numeroDose: string;
  dataPrevista: string;
  dataAplicacao?: string;
  status?: StatusDose;
}

export interface CriarVacinaDTO {
  petId: string;
  nome: string;
  observacoes?: string;
  doses?: CriarDoseVacinaDTO[];
}

export interface AtualizarVacinaDTO {
  nome?: string;
  observacoes?: string;
}

export interface AtualizarDoseVacinaDTO {
  numeroDose?: string;
  dataPrevista?: string;
  dataAplicacao?: string;
  status?: StatusDose;
}

export interface VacinaService {
  listarPorPet(petId: string): Promise<ResumoVacina[]>;
  buscarPorId(id: string): Promise<DetalhesVacina | null>;
  cadastrar(dados: CriarVacinaDTO): Promise<ResumoVacina>;
  atualizar(id: string, dados: AtualizarVacinaDTO): Promise<ResumoVacina>;
  remover(id: string): Promise<void>;
  
  adicionarDose(vacinaId: string, doseData: CriarDoseVacinaDTO): Promise<DoseVacina>;
  atualizarDose(doseId: string, doseData: AtualizarDoseVacinaDTO): Promise<DoseVacina>;
  removerDose(doseId: string): Promise<void>;
}