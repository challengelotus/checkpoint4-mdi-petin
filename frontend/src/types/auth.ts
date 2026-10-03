export interface Usuario {
  id: string;
  nome: string;
  email: string;
  plano: 'FREE' | 'PREMIUM';
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
}