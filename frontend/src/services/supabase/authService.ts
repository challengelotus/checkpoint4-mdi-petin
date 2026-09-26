import { supabase } from './client';
import {
  AuthService,
  CriarUsuarioDTO,
  LoginDTO,
  AuthResponse,
  Usuario,
} from '../../types/auth';

export const authService: AuthService = {
  async cadastrar(dados: CriarUsuarioDTO): Promise<AuthResponse> {
    
    // 1. Cria a conta de autenticação no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: dados.email,
      password: dados.senha,
    });

    if (authError) throw new Error(`Erro na autenticação: ${authError.message}`);
    if (!authData.user) throw new Error('Não foi possível criar o usuário.');

    const userId = authData.user.id;

    // 2. Insere as informações adicionais na tabela 'usuario'
    const { data: perfilData, error: perfilError } = await supabase
      .from('usuario')
      .insert({
        id: userId,
        nome: dados.nome,
        email: dados.email,
        senha: 'HASH_PROTEGIDO',
        plano: 'FREE',
        ativo: true,
      })
      .select()
      .single();

    if (perfilError) {
      throw new Error(`Erro ao salvar perfil do usuário: ${perfilError.message}`);
    }

    const token = authData.session?.access_token ?? '';

    const usuario: Usuario = {
      id: perfilData.id,
      nome: perfilData.nome,
      email: perfilData.email,
      plano: perfilData.plano,
      ativo: perfilData.ativo,
      createdAt: perfilData.created_at,
    };

    return { usuario, token };
  },

  async login(dados: LoginDTO): Promise<AuthResponse> {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: dados.email,
      password: dados.senha,
    });

    if (authError) throw new Error(`Falha no login: ${authError.message}`);
    if (!authData.user || !authData.session) {
      throw new Error('Sessão não encontrada.');
    }

    // Busca os dados do perfil na tabela 'usuario'
    const { data: perfilData, error: perfilError } = await supabase
      .from('usuario')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (perfilError || !perfilData) {
      throw new Error('Dados do perfil do usuário não encontrados.');
    }

    const usuario: Usuario = {
      id: perfilData.id,
      nome: perfilData.nome,
      email: perfilData.email,
      plano: perfilData.plano,
      ativo: perfilData.ativo,
      createdAt: perfilData.created_at,
    };

    return {
      usuario,
      token: authData.session.access_token,
    };
  },

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(`Erro ao realizar logout: ${error.message}`);
  },

  async obterUsuarioAtual(): Promise<Usuario | null> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: perfilData, error } = await supabase
      .from('usuario')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error || !perfilData) return null;

    return {
      id: perfilData.id,
      nome: perfilData.nome,
      email: perfilData.email,
      plano: perfilData.plano,
      ativo: perfilData.ativo,
      createdAt: perfilData.created_at,
    };
  },

  async obterSessaoAtiva(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? null;
  },
};