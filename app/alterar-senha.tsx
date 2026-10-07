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
import { Typography } from '@/components/Typography/Typography';

import { authService } from '@/services/supabase/authService';
import { mensagemErro } from '@/utils/date';

export default function AlterarSenhaScreen() {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [saving, setSaving] = useState(false);
  const [erros, setErros] = useState({});

  const validarCampos = () => {
        const e = {};
        if (!novaSenha.trim()) {
            e.novaSenha = 'Nova senha é obrigatória.';
        } else if (novaSenha.length < 6) {
            e.novaSenha = 'A senha deve ter pelo menos 6 caracteres.';
        }
        if (!confirmacao) {
            e.confirmacao = 'Confirmação de senha é obrigatória.';
        } else if (novaSenha !== confirmacao) {
            e.confirmacao = 'As senhas não conferem.';
        }
        setErros(e);
        return Object.keys(e).length === 0;
    };

  async function handleSave() {
    if (!validarCampos()) {
      return;
    }

    try {
      setSaving(true);

      await authService.alterarSenha(novaSenha);

      Alert.alert('Senha alterada', 'Sua senha foi atualizada.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      Alert.alert(
        'Erro',
        mensagemErro(error, 'Não foi possível alterar a senha.')
      );
    } finally {
      setSaving(false);
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
          title="Alterar senha"
          onBack={() => router.back()}
        />

        <View style={styles.form}>
          <FormInput
            label="Nova senha"
            value={novaSenha}
            onChangeText={setNovaSenha}
            secureTextEntry
            autoCapitalize="none"
          />
          {erros.novaSenha && (
            <Typography variant="caption" color={colors.error}>
              {erros.novaSenha}
            </Typography>
          )}

          <FormInput
            label="Confirmar nova senha"
            value={confirmacao}
            onChangeText={setConfirmacao}
            secureTextEntry
            autoCapitalize="none"
          />
          {erros.confirmacao && (
            <Typography variant="caption" color={colors.error}>
              {erros.confirmacao}
            </Typography>
          )}

          <Button
            title="Salvar senha"
            onPress={handleSave}
            loading={saving}
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

    gap: 20,
  },
});
