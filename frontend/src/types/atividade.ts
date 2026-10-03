export interface CardProximaAcaoDTO {
  numeroTempo: number;
  unidadeTempo: string;
  descricaoAcao: string;
}

export interface AtividadeService {
  obterProximaAcao(petId: string): Promise<CardProximaAcaoDTO | null>;
}