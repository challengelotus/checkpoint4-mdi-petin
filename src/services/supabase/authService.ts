import { supabase } from './client';
import {
  AuthService,
  CriarUsuarioDTO,
  LoginDTO,
  AuthResponse,
  Usuario,
  AtualizarPerfilDTO,
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

    // 2. Insere as informações adicionais na tabela 'usuarios'
    const { data: perfilData, error: perfilError } = await supabase
      .from('usuarios')
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

    // Busca os dados do perfil na tabela 'usuarios'
    const { data: perfilData, error: perfilError } = await supabase
      .from('usuarios')
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
      telefone: perfilData.telefone ?? undefined,
      cidade: perfilData.cidade ?? undefined,
      fotoLink: perfilData.foto_link ?? undefined,
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
      .from('usuarios')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error || !perfilData) return null;

    return {
      id: perfilData.id,
      nome: perfilData.nome,
      email: perfilData.email,
      plano: perfilData.plano,
      telefone: perfilData.telefone ?? undefined,
      cidade: perfilData.cidade ?? undefined,
      fotoLink: perfilData.foto_link ?? undefined,
      ativo: perfilData.ativo,
      createdAt: perfilData.created_at,
    };
  },

  async obterSessaoAtiva(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? null;
  },

  async atualizarPerfil(id: string, dados: AtualizarPerfilDTO): Promise<Usuario> {
    // Troca de e-mail passa primeiro pelo Supabase Auth (pode exigir confirmação por e-mail)
    if (dados.email !== undefined) {
      const { data: { user } } = await supabase.auth.getUser();

      if (user && user.email !== dados.email) {
        const { error: emailError } = await supabase.auth.updateUser({ email: dados.email });
        if (emailError) throw new Error(`Erro ao atualizar e-mail: ${emailError.message}`);
      }
    }

    const payload: Record<string, unknown> = {};
    if (dados.nome !== undefined) payload.nome = dados.nome;
    if (dados.email !== undefined) payload.email = dados.email;
    if (dados.telefone !== undefined) payload.telefone = dados.telefone || null;
    if (dados.cidade !== undefined) payload.cidade = dados.cidade || null;

    const { data, error } = await supabase
      .from('usuarios')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Erro ao atualizar perfil: ${error?.message ?? 'perfil não encontrado'}`);
    }

    return {
      id: data.id,
      nome: data.nome,
      email: data.email,
      plano: data.plano,
      telefone: data.telefone ?? undefined,
      cidade: data.cidade ?? undefined,
      fotoLink: data.foto_link ?? undefined,
      ativo: data.ativo,
      createdAt: data.created_at,
    };
  },

  async alterarSenha(novaSenha: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({ password: novaSenha });
    if (error) throw new Error(`Erro ao alterar senha: ${error.message}`);
  },

  async desativarConta(id: string): Promise<void> {
    const { error } = await supabase.from('usuarios').update({ ativo: false }).eq('id', id);
    if (error) throw new Error(`Erro ao desativar conta: ${error.message}`);

    await supabase.auth.signOut();
  },

  async uploadFotoPerfil(
    id: string,
    fileBuffer: ArrayBuffer | Blob,
    fileExtension: string
  ): Promise<string> {
    const fileName = `usuarios/${id}_${Date.now()}.${fileExtension}`;

    const { error: uploadError } = await supabase.storage
      .from('petin-midias')
      .upload(fileName, fileBuffer, {
        contentType: `image/${fileExtension}`,
        upsert: true,
      });

    if (uploadError) throw new Error(`Erro no upload da foto: ${uploadError.message}`);

    const { data } = supabase.storage.from('petin-midias').getPublicUrl(fileName);

    const { error } = await supabase
      .from('usuarios')
      .update({ foto_link: data.publicUrl })
      .eq('id', id);

    if (error) throw new Error(`Erro ao salvar foto no perfil: ${error.message}`);

    return data.publicUrl;
  },
};
