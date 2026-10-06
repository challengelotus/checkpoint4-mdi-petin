import { useState } from 'react';

import {
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { router } from 'expo-router';

import { colors } from '@/theme';

import { Header } from '@/components/Header/Header';
import { FormInput } from '@/components/FormInput/FormInput';
import { Button } from '@/components/Button/Button';

import { useAuth } from '@/contexts/AuthContext';
import { contatoService } from '@/services/supabase/contatoService';
import { mensagemErro } from '@/utils/date';

export default function NovoContatoScreen() {
  const { usuario } = useAuth();

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [observacao, setObservacao] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!usuario?.id) {
      Alert.alert('Sessão expirada', 'Faça login novamente.');
      router.replace('/(auth)/login');
      return;
    }

    if (!nome.trim()) {
      Alert.alert('Atenção', 'Digite o nome do contato.');
      return;
    }

    if (!telefone.trim()) {
      Alert.alert('Atenção', 'Digite o telefone do contato.');
      return;
    }

    try {
      setLoading(true);

      await contatoService.cadastrar({
        usuarioId: usuario.id,
        nome: nome.trim(),
        telefone: telefone.trim(),
        especialidade: especialidade.trim() || undefined,
        observacao: observacao.trim() || undefined,
      });

      router.back();
    } catch (error) {
      console.error('Erro ao cadastrar contato:', error);
      Alert.alert(
        'Erro',
        mensagemErro(error, 'Não foi possível salvar o contato.')
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Header
          title="Novo contato"
          onBack={() => router.back()}
        />

        <View style={styles.form}>
          <FormInput
            label="Nome"
            value={nome}
            onChangeText={setNome}
            placeholder="Ex: Dra. Ana - Clínica Amigo Fiel"
          />

          <FormInput
            label="Telefone"
            value={telefone}
            onChangeText={setTelefone}
            keyboardType="phone-pad"
          />

          <FormInput
            label="Especialidade / descrição"
            value={especialidade}
            onChangeText={setEspecialidade}
            placeholder="Ex: Emergência 24 horas"
          />

          <FormInput
            label="Observações"
            value={observacao}
            onChangeText={setObservacao}
            multiline
          />

          <Button
            title="Salvar"
            onPress={handleSave}
            loading={loading}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: colors.background,
  },

  content: {
    paddingHorizontal: 32,
    paddingTop: 56,
    paddingBottom: 32,
  },

  form: {
    marginTop: 26,

    gap: 18,
  },
});
