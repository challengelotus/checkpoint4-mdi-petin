export interface Usuario {
  id: string;
  nome: string;
  email: string;
  plano: 'FREE' | 'PREMIUM';
  telefone?: string;
  cidade?: string;
  ativo: boolean;
  createdAt?: string;
}

export interface CriarUsuarioDTO {
  nome: string;
  email: string;
  senha: string;
}

export interface LoginDTO {
  email: string;
  senha: string;
}

export interface AtualizarPerfilDTO {
  nome?: string;
  email?: string;
  telefone?: string;
  cidade?: string;
}

export interface AuthResponse {
  usuario: Usuario;
  token: string;
}

export interface AuthService {
  cadastrar(dados: CriarUsuarioDTO): Promise<AuthResponse>;
  login(dados: LoginDTO): Promise<AuthResponse>;
  logout(): Promise<void>;
  obterUsuarioAtual(): Promise<Usuario | null>;
  obterSessaoAtiva(): Promise<string | null>;
  atualizarPerfil(id: string, dados: AtualizarPerfilDTO): Promise<Usuario>;
  alterarSenha(novaSenha: string): Promise<void>;
  desativarConta(id: string): Promise<void>;
}