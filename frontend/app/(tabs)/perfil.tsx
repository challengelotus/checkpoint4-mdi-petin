import { useCallback, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import {
  router,
  useFocusEffect,
} from 'expo-router';

import {
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import { colors } from '@/theme';

import { Typography } from '@/components/Typography/Typography';
import { Toggle } from '@/components/Toggle/Toggle';
import { Button } from '@/components/Button/Button';
import { ProfileInfoCard } from '@/components/ProfileInfoCard/ProfileInfoCard';

import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/supabase/authService';
import { petService } from '@/services/supabase/petService';
import { consultaService } from '@/services/supabase/consultaService';
import {
  PreferenciasUsuario,
  carregarPreferencias,
  salvarPreferencias,
} from '@/utils/preferencias';
import { iniciais, mensagemErro } from '@/utils/date';
import {
  LIMITE_MEDICAMENTOS_FREE,
  LIMITE_VACINAS_FREE,
  nomeDoPlano,
} from '@/utils/planos';

interface Resumo {
  pets: number;
  consultas: number;
  emDia: number;
}

export default function PerfilScreen() {
  const { usuario, logout } = useAuth();

  const [resumo, setResumo] = useState<Resumo>({
    pets: 0,
    consultas: 0,
    emDia: 0,
  });
  const [prefs, setPrefs] = useState<PreferenciasUsuario>({
    lembretesVacinas: true,
    lembretesConsultas: true,
  });
  const [loading, setLoading] = useState(true);
  const [saindo, setSaindo] = useState(false);

  const carregar = useCallback(async () => {
    if (!usuario?.id) {
      setLoading(false);
      return;
    }

    try {
      const [pets, preferencias] = await Promise.all([
        petService.listarPorUsuario(usuario.id),
        carregarPreferencias(usuario.id),
      ]);

      setPrefs(preferencias);

      // Consultas futuras de todos os pets
      const agora = Date.now();
      const consultas = await Promise.all(
        pets.map((p) => consultaService.listarPorPet(p.id))
      );
      const futuras = consultas
        .flat()
        .filter((c) => new Date(c.dataHora).getTime() >= agora).length;

      setResumo({
        pets: pets.length,
        consultas: futuras,
        emDia: pets.filter((p) => p.status === 'Em Dia').length,
      });
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  }, [usuario?.id]);

  // Recarrega ao focar a aba (ex.: depois de editar o perfil ou cadastrar pets)
  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  async function alterarPreferencia(
    chave: keyof PreferenciasUsuario,
    valor: boolean
  ) {
    if (!usuario?.id) return;

    const novas = { ...prefs, [chave]: valor };
    setPrefs(novas);

    try {
      await salvarPreferencias(usuario.id, novas);
    } catch {
      setPrefs(prefs);
      Alert.alert('Erro', 'Não foi possível salvar a preferência.');
    }
  }

  async function sair() {
    try {
      setSaindo(true);
      await logout();
      router.replace('/(auth)/login');
    } catch (error) {
      Alert.alert(
        'Erro',
        mensagemErro(error, 'Não foi possível sair da conta.')
      );
    } finally {
      setSaindo(false);
    }
  }

  function confirmarExclusao() {
    if (!usuario?.id) return;

    Alert.alert(
      'Excluir conta',
      'Sua conta será desativada e você será desconectado. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.desativarConta(usuario.id);
              router.replace('/(auth)/login');
            } catch (error) {
              Alert.alert(
                'Erro',
                mensagemErro(error, 'Não foi possível excluir a conta.')
              );
            }
          },
        },
      ]
    );
  }

  if (!usuario) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Typography
          variant="h2"
          color={colors.backgroundLight}
        >
          Meu perfil
        </Typography>
      </View>

      <ScrollView
        style={styles.sheet}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho do usuário */}
        <View style={styles.userRow}>
          <View style={styles.avatar}>
            <Typography
              variant="h2"
              color={colors.brown}
            >
              {iniciais(usuario.nome)}
            </Typography>
          </View>

          <View style={styles.userInfo}>
            <Typography
              variant="h4"
              color={colors.brown}
            >
              {usuario.nome}
            </Typography>

            <Typography
              variant="caption"
              color={colors.textSecondary}
            >
              {usuario.email}
            </Typography>
          </View>

          <Pressable
            onPress={() => router.push('/editar-perfil')}
            hitSlop={10}
          >
            <Typography
              variant="captionMedium"
              color={colors.primary}
            >
              Editar
            </Typography>
          </Pressable>
        </View>

        {/* Resumo */}
        <View style={styles.stats}>
          {[
            { valor: resumo.pets, rotulo: 'pets' },
            { valor: resumo.consultas, rotulo: 'consultas' },
            { valor: resumo.emDia, rotulo: 'em dia' },
          ].map((item) => (
            <View key={item.rotulo} style={styles.stat}>
              {loading ? (
                <ActivityIndicator color={colors.brown} />
              ) : (
                <Typography
                  variant="h3"
                  color={colors.brown}
                >
                  {item.valor}
                </Typography>
              )}

              <Typography
                variant="caption"
                color={colors.textSecondary}
              >
                {item.rotulo}
              </Typography>
            </View>
          ))}
        </View>

        {/* Dados pessoais */}
        <Typography
          variant="bodySemiBold"
          color={colors.brown}
          style={styles.sectionTitle}
        >
          Dados pessoais
        </Typography>

        <ProfileInfoCard
          data={[
            { label: 'Nome', value: usuario.nome },
            { label: 'E-mail', value: usuario.email },
            { label: 'Telefone', value: usuario.telefone || '—' },
            { label: 'Cidade', value: usuario.cidade || '—' },
          ]}
        />

        {/* Preferências */}
        <Typography
          variant="bodySemiBold"
          color={colors.brown}
          style={styles.sectionTitle}
        >
          Preferências
        </Typography>

        <View style={styles.card}>
          <View style={[styles.row, styles.rowBorder]}>
            <Typography
              variant="caption"
              color={colors.brown}
            >
              Lembretes de vacinas
            </Typography>

            <Toggle
              value={prefs.lembretesVacinas}
              onChange={(v) =>
                alterarPreferencia('lembretesVacinas', v)
              }
            />
          </View>

          <View style={styles.row}>
            <Typography
              variant="caption"
              color={colors.brown}
            >
              Lembretes de consultas
            </Typography>

            <Toggle
              value={prefs.lembretesConsultas}
              onChange={(v) =>
                alterarPreferencia('lembretesConsultas', v)
              }
            />
          </View>
        </View>

        {/* Assinatura */}
        <Typography
          variant="bodySemiBold"
          color={colors.brown}
          style={styles.sectionTitle}
        >
          Assinatura
        </Typography>

        <View style={[styles.card, styles.subscription]}>
          <View style={styles.subscriptionInfo}>
            <Typography
              variant="caption"
              color={colors.textSecondary}
            >
              Plano atual
            </Typography>

            <Typography
              variant="bodySemiBold"
              color={colors.brown}
            >
              {nomeDoPlano(usuario.plano)}
            </Typography>

            <Typography
              variant="caption"
              color={colors.textSecondary}
              style={styles.subscriptionHint}
            >
              {usuario.plano === 'PREMIUM'
                ? 'Vacinas e medicamentos ilimitados'
                : `Até ${LIMITE_VACINAS_FREE} vacinas e ${LIMITE_MEDICAMENTOS_FREE} medicamentos por pet`}
            </Typography>
          </View>

          <Pressable
            style={styles.upgradeButton}
            onPress={() => router.push('/assinatura')}
          >
            <Typography
              variant="captionMedium"
              color={colors.backgroundLight}
            >
              {usuario.plano === 'PREMIUM' ? 'Ver plano' : 'Atualizar'}
            </Typography>
          </Pressable>
        </View>

        {/* Segurança */}
        <Typography
          variant="bodySemiBold"
          color={colors.brown}
          style={styles.sectionTitle}
        >
          Segurança
        </Typography>

        <Pressable
          style={[styles.card, styles.row]}
          onPress={() => router.push('/alterar-senha')}
        >
          <Typography
            variant="caption"
            color={colors.brown}
          >
            Alterar senha
          </Typography>

          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={colors.brown}
          />
        </Pressable>

        <View style={styles.actions}>
          <Button
            title="Sair da conta"
            onPress={sair}
            loading={saindo}
          />

          <Typography
            variant="caption"
            color={colors.error}
            style={styles.delete}
            onPress={confirmarExclusao}
          >
            Excluir conta
          </Typography>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: colors.primary,
  },

  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  hero: {
    height: 150,

    paddingHorizontal: 30,
    paddingTop: 70,
  },

  sheet: {
    flex: 1,

    borderTopLeftRadius: 38,
    borderTopRightRadius: 38,

    backgroundColor: colors.background,
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },

  userRow: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 14,
  },

  avatar: {
    width: 60,
    height: 60,

    borderRadius: 30,

    backgroundColor: colors.orange,

    alignItems: 'center',
    justifyContent: 'center',
  },

  userInfo: {
    flex: 1,
  },

  stats: {
    marginTop: 18,

    flexDirection: 'row',

    gap: 10,
  },

  stat: {
    flex: 1,

    minHeight: 60,

    borderRadius: 14,

    backgroundColor: colors.backgroundLight,

    alignItems: 'center',
    justifyContent: 'center',
  },

  sectionTitle: {
    marginTop: 22,
    marginBottom: 10,
  },

  card: {
    paddingHorizontal: 18,

    borderRadius: 16,

    backgroundColor: colors.backgroundLight,
  },

  row: {
    minHeight: 48,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  subscription: {
    paddingVertical: 14,

    flexDirection: 'row',
    alignItems: 'center',

    gap: 12,
  },

  subscriptionInfo: {
    flex: 1,
  },

  subscriptionHint: {
    marginTop: 2,
  },

  upgradeButton: {
    height: 36,

    paddingHorizontal: 18,

    borderRadius: 18,

    backgroundColor: colors.brown,

    alignItems: 'center',
    justifyContent: 'center',
  },

  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },

  actions: {
    marginTop: 26,

    alignItems: 'center',

    gap: 16,
  },

  delete: {
    paddingVertical: 4,
  },
});
