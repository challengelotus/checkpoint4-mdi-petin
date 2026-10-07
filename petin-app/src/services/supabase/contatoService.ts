import { supabase } from './client';
import { Contato, CriarContatoDTO, AtualizarContatoDTO, ContatoService } from '../../types/contato';

export const contatoService: ContatoService = {
  async listarPorUsuario(usuarioId: string): Promise<Contato[]> {
    const { data, error } = await supabase
      .from('contatos')
      .select('id, usuario_id, nome, telefone, especialidade, observacao')
      .eq('usuario_id', usuarioId)
      .order('nome', { ascending: true });

    if (error) {
      console.error('Erro ao listar contatos:', error.message);
      throw error;
    }

    return data.map((item) => ({
      id: item.id,
      usuarioId: item.usuario_id,
      nome: item.nome,
      telefone: item.telefone,
      especialidade: item.especialidade,
      observacao: item.observacao,
    }));
  },

  async cadastrar(dadosContato: CriarContatoDTO): Promise<Contato> {
    const { data, error } = await supabase
      .from('contatos')
      .insert([
        {
          usuario_id: dadosContato.usuarioId,
          nome: dadosContato.nome,
          telefone: dadosContato.telefone,
          especialidade: dadosContato.especialidade,
          observacao: dadosContato.observacao,
        },
      ])
      .select('id, usuario_id, nome, telefone, especialidade, observacao')
      .single();

    if (error) {
      console.error('Erro ao cadastrar contato:', error.message);
      throw error;
    }

    return {
      id: data.id,
      usuarioId: data.usuario_id,
      nome: data.nome,
      telefone: data.telefone,
      especialidade: data.especialidade,
      observacao: data.observacao,
    };
  },

  async atualizar(id: string, dadosContato: AtualizarContatoDTO): Promise<Contato> {
    const payloadAtualizacao: Record<string, unknown> = {};

    if (dadosContato.nome !== undefined) payloadAtualizacao.nome = dadosContato.nome;
    if (dadosContato.telefone !== undefined) payloadAtualizacao.telefone = dadosContato.telefone;
    if (dadosContato.especialidade !== undefined) payloadAtualizacao.especialidade = dadosContato.especialidade;
    if (dadosContato.observacao !== undefined) payloadAtualizacao.observacao = dadosContato.observacao;

    const { data, error } = await supabase
      .from('contatos')
      .update(payloadAtualizacao)
      .eq('id', id)
      .select('id, usuario_id, nome, telefone, especialidade, observacao')
      .single();

    if (error) {
      console.error('Erro ao atualizar contato:', error.message);
      throw error;
    }

    return {
      id: data.id,
      usuarioId: data.usuario_id,
      nome: data.nome,
      telefone: data.telefone,
      especialidade: data.especialidade,
      observacao: data.observacao,
    };
  },

  async remover(id: string): Promise<void> {
    const { error } = await supabase
      .from('contatos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao remover contato:', error.message);
      throw error;
    }
  },
};