import { useEffect, useState } from 'react';

import {
  Alert,
  Pressable,
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
import { Avatar } from '@/components/Avatar/Avatar';

import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/supabase/authService';
import { mensagemErro } from '@/utils/date';
import {
  ImagemEscolhida,
  escolherOrigemEImagem,
} from '@/utils/imagem';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function mascaraTelefone(texto: string): string {
  const d = texto.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10)
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export default function EditarPerfilScreen() {
  const { usuario, recarregarUsuario } = useAuth();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cidade, setCidade] = useState('');
  const [foto, setFoto] = useState<ImagemEscolhida | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!usuario) return;

    setNome(usuario.nome);
    setEmail(usuario.email);
    setTelefone(usuario.telefone ?? '');
    setCidade(usuario.cidade ?? '');
  }, [usuario?.id]);

  async function alterarFoto() {
    const imagem = await escolherOrigemEImagem();
    if (imagem) setFoto(imagem);
  }

  async function handleSave() {
    if (!usuario) return;

    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim().toLowerCase();

    if (!nomeLimpo) {
      Alert.alert('Atenção', 'Digite seu nome completo.');
      return;
    }

    if (!EMAIL_REGEX.test(emailLimpo)) {
      Alert.alert('Atenção', 'Digite um e-mail válido.');
      return;
    }

    const emailMudou = emailLimpo !== usuario.email.toLowerCase();

    try {
      setSaving(true);

      // Foto só é enviada ao salvar; cancelar a edição descarta a escolha
      if (foto) {
        await authService.uploadFotoPerfil(usuario.id, foto.buffer, foto.extensao);
      }

      await authService.atualizarPerfil(usuario.id, {
        nome: nomeLimpo,
        email: emailLimpo,
        telefone: telefone.trim(),
        cidade: cidade.trim(),
      });

      await recarregarUsuario();

      Alert.alert(
        'Perfil atualizado',
        emailMudou
          ? 'Dados salvos. Se o seu projeto exigir confirmação, verifique o novo e-mail para concluir a troca.'
          : 'Suas alterações foram salvas.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      Alert.alert(
        'Erro',
        mensagemErro(error, 'Não foi possível salvar as alterações.')
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
          title="Editar perfil"
          onBack={() => router.back()}
          fontSize="h3"
        />

        <View style={styles.avatarWrapper}>
          <Avatar
            uri={foto?.uri ?? usuario?.fotoLink}
            nome={nome}
            size={90}
          />

          <Pressable onPress={alterarFoto} hitSlop={10}>
            <Typography
              variant="captionMedium"
              color={colors.primary}
              style={styles.changePhoto}
            >
              Alterar foto
            </Typography>
          </Pressable>
        </View>

        <View style={styles.form}>
          <FormInput
            label="Nome completo"
            value={nome}
            onChangeText={setNome}
            autoCapitalize="words"
          />

          <FormInput
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <FormInput
            label="Telefone"
            value={telefone}
            onChangeText={(t) =>
              setTelefone(mascaraTelefone(t))
            }
            placeholder="(11) 90000-0000"
            keyboardType="phone-pad"
          />

          <FormInput
            label="Cidade"
            value={cidade}
            onChangeText={setCidade}
            placeholder="São Paulo - SP"
          />

          <Button
            title="Salvar alterações"
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
    paddingBottom: 40,
  },

  avatarWrapper: {
    marginTop: 24,

    alignItems: 'center',
  },

  changePhoto: {
    marginTop: 10,
  },

  form: {
    marginTop: 28,

    gap: 18,
  },
});
