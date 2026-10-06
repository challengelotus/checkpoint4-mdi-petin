export interface DadosProntuario {
  pet: {
    nome: string;
    especie: string;
    raca?: string;
    peso?: number;
    dataNascimento?: string;
  };
  vacinas: Array<{
    nome: string;
    dataPrevista: string;
    status: string;
  }>;
  medicamentos: Array<{
    nome: string;
    dosagem?: string;
    frequencia?: string;
  }>;
}

export interface ProntuarioService {
  obterDadosProntuario(petId: string): Promise<DadosProntuario>;
  gerarHtmlProntuario(dados: DadosProntuario): string;
}