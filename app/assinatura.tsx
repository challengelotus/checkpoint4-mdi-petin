import { useCallback, useEffect, useState } from 'react';

import {
  Alert,
  AppState,
  Linking,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import {
  router,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';

import {
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import { colors } from '@/theme';

import { Header } from '@/components/Header/Header';
import { Button } from '@/components/Button/Button';
import { Typography } from '@/components/Typography/Typography';

import { useAuth } from '@/contexts/AuthContext';
import {
  LIMITE_PETS_FREE,
  LIMITE_MEDICAMENTOS_FREE,
  LIMITE_VACINAS_FREE,
  FREE_PRECO,
  PREMIUM_PRECO,
  montarUrlCheckout,
  nomeDoPlano,
} from '@/utils/planos';

const BENEFICIOS_PREMIUM = [
  'Cadastro ilimitados de pets',
  'Vacinas ilimitadas por pet',
  'Medicamentos ilimitados por pet',
];

const LIMITES_FREE = [
  `Até ${LIMITE_PETS_FREE} cadastro de pet`,
  `Até ${LIMITE_VACINAS_FREE} vacinas por pet`,
  `Até ${LIMITE_MEDICAMENTOS_FREE} medicamentos por pet`,
];

function ItemLista({
  texto,
  cor,
  icone,
}: {
  texto: string;
  cor: string;
  icone: keyof typeof MaterialCommunityIcons.glyphMap;
}) {
  return (
    <View style={styles.item}>
      <MaterialCommunityIcons name={icone} size={18} color={cor} />
      <Typography variant="caption" color={colors.brown}>
        {texto}
      </Typography>
    </View>
  );
}

export default function AssinaturaScreen() {
  const { usuario, recarregarUsuario } = useAuth();
  const { motivo } = useLocalSearchParams<{ motivo?: string }>();
  const [abrindo, setAbrindo] = useState(false);

  const premium = usuario?.plano === 'PREMIUM';

  // Depois do pagamento o webhook atualiza o plano no servidor;
  // relemos o usuário ao focar a tela e ao voltar do navegador.
  useFocusEffect(
    useCallback(() => {
      recarregarUsuario().catch(() => {});
    }, [])
  );

  useEffect(() => {
    const sub = AppState.addEventListener('change', (estado) => {
      if (estado === 'active') recarregarUsuario().catch(() => {});
    });
    return () => sub.remove();
  }, []);

  async function assinar() {
    if (!usuario) return;

    const url = montarUrlCheckout(usuario);

    if (!url) {
      Alert.alert(
        'Checkout indisponível',
        'feature não implementada.'
      );
      return;
    }

    try {
      setAbrindo(true);
      await Linking.openURL(url);
    } catch {
      Alert.alert('Erro', 'Não foi possível abrir a página de pagamento.');
    } finally {
      setAbrindo(false);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Header
          title="Assinatura"
          onBack={() => router.back()}
        />

        {!!motivo && !premium && (
          <View style={styles.reason}>
            <MaterialCommunityIcons
              name="lock-outline"
              size={18}
              color={colors.brown}
            />

            <Typography
              variant="caption"
              color={colors.brown}
              style={styles.reasonText}
            >
              {motivo}
            </Typography>
          </View>
        )}

        <View style={styles.current}>
          <Typography variant="caption" color={colors.textSecondary}>
            Seu plano atual
          </Typography>

          <Typography variant="h3" color={colors.brown}>
            {nomeDoPlano(usuario?.plano)}
          </Typography>
        </View>

        <View style={[styles.card, premium && styles.cardDimmed]}>
          <View style={styles.freeHeader}>
            <Typography variant="bodySemiBold" color={colors.brown}>
              Gratuito
            </Typography>

            {!!FREE_PRECO && (
              <Typography variant="bodySemiBold" color={colors.primary}>
                {FREE_PRECO}
              </Typography>
            )}
          </View>

          <View style={styles.list}>
            {LIMITES_FREE.map((t) => (
              <ItemLista
                key={t}
                texto={t}
                icone="check"
                cor={colors.brownLight}
              />
            ))}
          </View>
        </View>

        <View style={[styles.card, styles.cardPremium]}>
          <View style={styles.premiumHeader}>
            <Typography variant="bodySemiBold" color={colors.brown}>
              Premium
            </Typography>

            {!!PREMIUM_PRECO && (
              <Typography variant="bodySemiBold" color={colors.primary}>
                {PREMIUM_PRECO}
              </Typography>
            )}
          </View>

          <View style={styles.list}>
            {BENEFICIOS_PREMIUM.map((t) => (
              <ItemLista
                key={t}
                texto={t}
                icone="check-circle"
                cor={colors.success}
              />
            ))}
          </View>
        </View>

        {premium ? (
          <Typography
            variant="caption"
            color={colors.success}
            style={styles.note}
          >
            Você já é Premium. Obrigado por apoiar o Petin!
          </Typography>
        ) : (
          <>
            <Button
              title="Assinar Premium"
              onPress={assinar}
              loading={abrindo}
            />

            <Typography
              variant="caption"
              color={colors.textSecondary}
              style={styles.note}
            >
              O pagamento é feito em uma página segura. Ao concluir,
              volte ao app: seu plano será atualizado automaticamente.
            </Typography>
          </>
        )}
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

    gap: 16,
  },

  reason: {
    padding: 14,

    borderRadius: 14,

    backgroundColor: colors.warningLight,

    flexDirection: 'row',
    alignItems: 'center',

    gap: 10,
  },

  reasonText: {
    flex: 1,
  },

  current: {
    marginTop: 10,
  },

  card: {
    padding: 18,

    borderRadius: 16,

    backgroundColor: colors.backgroundLight,
  },

  cardDimmed: {
    opacity: 0.7,
  },

  freeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  cardPremium: {
    borderWidth: 1.5,
    borderColor: colors.orange,
  },

  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  list: {
    marginTop: 12,

    gap: 8,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 8,
  },

  note: {
    textAlign: 'center',
  },
});
