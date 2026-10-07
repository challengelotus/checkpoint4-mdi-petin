export interface Contato {
  id: string;
  usuarioId: string;
  nome: string;
  telefone?: string;
  especialidade?: string;
  observacao?: string;
}

export interface CriarContatoDTO {
  usuarioId: string;
  nome: string;
  telefone?: string;
  especialidade?: string;
  observacao?: string;
}

export interface AtualizarContatoDTO extends Partial<CriarContatoDTO> {}

export interface ContatoService {
  listarPorUsuario(usuarioId: string): Promise<Contato[]>;
  cadastrar(dadosContato: CriarContatoDTO): Promise<Contato>;
  atualizar(id: string, dadosContato: AtualizarContatoDTO): Promise<Contato>;
  remover(id: string): Promise<void>;
}