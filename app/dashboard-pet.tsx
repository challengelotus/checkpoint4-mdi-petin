import { useCallback, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import {
  router,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';

import { colors } from '@/theme';

import { useAuth } from '@/contexts/AuthContext';

import { DashboardButton } from '@/components/DashboardButton/DashboardButton';
import { ActivityCard } from '@/components/ActivityCard/ActivityCard';
import { Typography } from '@/components/Typography/Typography';
import { Header } from '@/components/Header/Header';

import { petService } from '@/services/supabase/petService';
import { atividadeService } from '@/services/supabase/atividadeService';

import { Pet } from '@/types/pet';
import { CardProximaAcaoDTO } from '@/types/atividade';
import { PetSelector } from '@/components/PetSelector/PetSelector';

export default function DashboardPetScreen() {
  const { usuario } = useAuth();

  const { petId } = useLocalSearchParams<{
    petId: string;
  }>();

  const [selectedPetId, setSelectedPetId] = useState<string | null>(petId ?? null);

  const [pets, setPets] = useState<Pet[]>([]);

  const [pet, setPet] = useState<Pet | null>(null);

  const [proximaAcao, setProximaAcao] = useState<CardProximaAcaoDTO | null>(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const carregarDashboard = useCallback(
    async (refresh = false) => {
      if (!usuario?.id) {
        return;
      }

      try {
        if (refresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const petsUsuario =
          await petService.listarPorUsuario(
            usuario.id
          );

        setPets(petsUsuario);

        const petSelecionado =
          selectedPetId ??
          petId ??
          petsUsuario[0]?.id;

        if (!petSelecionado) {
          Alert.alert(
            'Nenhum pet encontrado',
            'Você ainda não possui pets cadastrados.'
          );

          router.back();

          return;
        }

        setSelectedPetId(petSelecionado);

        const petData =
          await petService.buscarPorId(
            petSelecionado
          );

        if (!petData) {
          Alert.alert(
            'Pet não encontrado',
            'Não foi possível encontrar esse pet.'
          );

          router.back();

          return;
        }

        setPet(petData);

        const acao =
          await atividadeService.obterProximaAcao(
            petSelecionado
          );

        setProximaAcao(acao);
      } catch (error) {
        console.error(
          'Erro ao carregar dashboard:',
          error
        );

        Alert.alert(
          'Erro',
          'Não foi possível carregar os dados do pet.'
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [
      usuario?.id,
      petId,
      selectedPetId,
    ]
  );

  async function selecionarPet(novoPetId: string) {
    if (novoPetId === selectedPetId) {
      return;
    }

    setSelectedPetId(novoPetId);

    try {
      setLoading(true);

      const petData =
        await petService.buscarPorId(
          novoPetId
        );

      if (!petData) {
        Alert.alert(
          'Erro',
          'Não foi possível carregar esse pet.'
        );

        return;
      }

      setPet(petData);

      const acao =
        await atividadeService.obterProximaAcao(
          novoPetId
        );

      setProximaAcao(acao);
    } catch (error) {
      console.error(
        'Erro ao trocar pet:',
        error
      );

      Alert.alert(
        'Erro',
        'Não foi possível carregar os dados do pet.'
      );
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      carregarDashboard();
    }, [carregarDashboard])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header
          title={pet?.nome ?? 'Pet'}
          onBack={() => router.back()}
          titleColor={colors.backgroundLight}
          fontSize="h2"
        />
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() =>
              carregarDashboard(true)
            }
          />
        }
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.petSelector}>
          <PetSelector
            pets={pets}
            selectedPet={selectedPetId ?? ''}
            onSelect={selecionarPet}
          />
        </View>
        {/* Próxima ação */}
        <View style={styles.vaccineCard}>
          {proximaAcao ? (
            <>
              <View style={styles.days}>
                <Typography
                  variant="h2"
                  color={colors.brown}
                >
                  {proximaAcao.numeroTempo}
                </Typography>

                <Typography
                  variant="bodySemiBold"
                  color={colors.textSecondary}
                >
                  {' '}
                  {proximaAcao.unidadeTempo}
                </Typography>
              </View>

              <Typography
                variant="caption"
                color={colors.textSecondary}
              >
                {proximaAcao.descricaoAcao}
              </Typography>
            </>
          ) : (
            <Typography
              variant="bodySemiBold"
              color={colors.brown}
            >
              Nenhuma atividade próxima
            </Typography>
          )}
        </View>

        {/* Status do pet */}
        <View style={styles.statusCard}>
          <Typography
            variant="caption"
            color={colors.textSecondary}
          >
            Status da saúde
          </Typography>

          <Typography
            variant="h4"
            color={
              pet?.status === 'Atrasado'
                ? colors.error
                : pet?.status === 'Atenção'
                ? colors.warning
                : colors.success
            }
          >
            {pet?.status ?? 'Em Dia'}
          </Typography>
        </View>

        {/* Ações */}
        <View style={styles.buttons}>
          <View style={styles.row}>
            <DashboardButton
              title="+ Nova vacina"
              primary
              onPress={() =>
                router.push({
                  pathname: '/nova-vacina',
                  params: { petId: pet.id },
                })
              }
            />

            <DashboardButton
              title="Medicamentos"
              onPress={() =>
                router.push({
                  pathname: '/medicamentos',
                  params: { petId: pet.id },
                })
              }
            />
          </View>

          <View style={styles.row}>
            <DashboardButton
              title="Perfil"
              onPress={() => {
                router.push({
                  pathname: '/perfl-pet',
                  params: {
                    petId: pet.id,
                  },
                });
              }}
            />

            <DashboardButton
              title="Localizar"
              onPress={() => {
                router.push({
                  pathname: '/localizar-pet',
                  params: { petId: pet.id },
                });
              }}
            />
          </View>
        </View>

        {/* Atividade */}
        <Typography
          variant="h4"
          color={colors.backgroundLight}
          style={styles.activityTitle}
        >
          Atividade recente
        </Typography>

        <View style={styles.activities}>
          <ActivityCard
            title="Consulta de rotina"
            date="12/03"
          />

          <ActivityCard
            title="Vacina antirrábica"
            date="28/02"
          />

          <ActivityCard
            title="Vermífugo aplicado"
            date="15/02"
          />
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

  header: {
    paddingTop: 54,
    paddingHorizontal: 30,

    flexDirection: 'row',
    alignItems: 'center',

    gap: 8,
  },

  content: {
    paddingHorizontal: 30,
    paddingTop: 26,
    paddingBottom: 32,
  },

  petSelector: {
    marginBottom: 20,
  },

  vaccineCard: {
    marginTop: 28,

    minHeight: 100,

    paddingHorizontal: 28,
    paddingVertical: 20,

    borderRadius: 18,

    backgroundColor: colors.backgroundLight,

    justifyContent: 'center',
  },

  days: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },

  statusCard: {
    marginTop: 12,

    minHeight: 80,

    paddingHorizontal: 20,
    paddingVertical: 14,

    borderRadius: 18,

    backgroundColor: colors.backgroundLight,

    justifyContent: 'center',
  },

  buttons: {
    marginTop: 20,

    gap: 12,
  },

  row: {
    flexDirection: 'row',
    gap: 12,
  },

  activityTitle: {
    marginTop: 26,
    marginBottom: 10,
  },

  activities: {
    gap: 10,
  },

  loadingContainer: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: colors.background,
  },
});