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
  useLocalSearchParams,
} from 'expo-router';

import { colors } from '@/theme';

import {
  ProfileHeader,
} from '@/components/ProfileHeader/ProfileHeader';

import {
  ProfileTabs,
  ProfileTab,
} from '@/components/ProfileTabs/ProfileTabs';

import {
  ProfileInfoCard,
} from '@/components/ProfileInfoCard/ProfileInfoCard';

import {
  WeightChart,
} from '@/components/WeightChart/WeightChart';

import {
  VaccineHistoryCard,
} from '@/components/VaccineHistoryCard/VaccineHistoryCard';

import {
  DocumentCard,
} from '@/components/DocumentCard/DocumentCard';

import { Button } from '@/components/Button/Button';

import {
  Typography,
} from '@/components/Typography/Typography';

import { petService } from '@/services/supabase/petService';

import {
  vacinaService,
} from '@/services/supabase/vacinaService';

import { Pet } from '@/types/pet';

import {
  DoseVacina,
} from '@/types/vacina';

export default function PerfilPetScreen() {
  const { petId } =
    useLocalSearchParams<{
      petId?: string;
    }>();

  const [activeTab, setActiveTab] =
    useState<ProfileTab>('dados');

  const [pet, setPet] =
    useState<Pet | null>(null);

  const [historico, setHistorico] =
    useState<
      Awaited<
        ReturnType<
          typeof petService.obterHistorico
        >
      >
    >([]);

  const [vacinas, setVacinas] =
    useState<
      Awaited<
        ReturnType<
          typeof vacinaService.listarPorPet
        >
      >
    >([]);

  const [loading, setLoading] =
    useState(true);

  const carregarPerfil = useCallback(
    async () => {
      if (!petId) {
        Alert.alert(
          'Erro',
          'Não foi possível identificar o pet.'
        );

        router.back();

        return;
      }

      try {
        setLoading(true);

        const [
          petData,
          historicoData,
          vacinasData,
        ] = await Promise.all([
          petService.buscarPorId(petId),
          petService.obterHistorico(petId),
          vacinaService.listarPorPet(petId),
        ]);

        if (!petData) {
          Alert.alert(
            'Pet não encontrado',
            'Não foi possível encontrar esse pet.'
          );

          router.back();

          return;
        }

        setPet(petData);
        setHistorico(historicoData);
        setVacinas(vacinasData);
      } catch (error) {
        console.error(
          'Erro ao carregar perfil do pet:',
          error
        );

        Alert.alert(
          'Erro',
          'Não foi possível carregar o perfil do pet.'
        );
      } finally {
        setLoading(false);
      }
    },
    [petId]
  );

  useFocusEffect(
    useCallback(() => {
      carregarPerfil();
    }, [carregarPerfil])
  );

  function calcularIdade(
    dataNascimento?: string
  ) {
    if (!dataNascimento) {
      return 'Não informado';
    }

    const nascimento =
      new Date(dataNascimento);

    const hoje = new Date();

    let idade =
      hoje.getFullYear() -
      nascimento.getFullYear();

    const mes =
      hoje.getMonth() -
      nascimento.getMonth();

    if (
      mes < 0 ||
      (
        mes === 0 &&
        hoje.getDate() <
          nascimento.getDate()
      )
    ) {
      idade--;
    }

    if (idade < 1) {
      const meses =
        (hoje.getFullYear() -
          nascimento.getFullYear()) *
          12 +
        (hoje.getMonth() -
          nascimento.getMonth());

      return `${Math.max(0, meses)} ${
        meses === 1 ? 'mês' : 'meses'
      }`;
    }

    return `${idade} ${
      idade === 1 ? 'ano' : 'anos'
    }`;
  }

  function formatarData(
    data?: string
  ) {
    if (!data) {
      return 'Não informado';
    }

    const date = new Date(data);

    return date.toLocaleDateString(
      'pt-BR'
    );
  }

  function formatarPeso(
    peso?: number
  ) {
    if (
      peso === undefined ||
      peso === null
    ) {
      return 'Não informado';
    }

    return `${peso} kg`;
  }

  function obterHistoricoPesos() {
    const pesos = historico
      .filter(
        (item) =>
          item.peso !== undefined &&
          item.peso !== null
      )
      .map(
        (item) => Number(item.peso)
      );

    if (
      pet?.peso !== undefined &&
      pet.peso !== null &&
      pesos.length === 0
    ) {
      return [pet.peso];
    }

    return pesos.length > 0
      ? pesos
      : [0];
  }

  function obterVacinaComDoseAplicada() {
    for (const vacina of vacinas) {
      // listarPorPet retorna apenas o resumo,
      // então buscamos uma vacina detalhada
      // quando necessário.
    }

    return null;
  }

  async function excluirPet() {
    if (!pet) {
      return;
    }

    Alert.alert(
      'Excluir pet',
      `Deseja realmente excluir ${pet.nome}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);

              await petService.remover(
                pet.id
              );

              Alert.alert(
                'Pet excluído',
                'O pet foi removido com sucesso.'
              );

              router.replace('/(tabs)/home');
            } catch (error) {
              console.error(
                'Erro ao excluir pet:',
                error
              );

              Alert.alert(
                'Erro',
                'Não foi possível excluir o pet.'
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  }

  function renderContent() {
    if (!pet) {
      return null;
    }

    if (activeTab === 'dados') {
      return (
        <ProfileInfoCard
          data={[
            {
              label: 'Nome',
              value: pet.nome,
            },
            {
              label: 'Espécie',
              value: pet.especie,
            },
            {
              label: 'Raça',
              value:
                pet.raca ||
                'Não informado',
            },
            {
              label: 'Idade',
              value:
                calcularIdade(
                  pet.dataNascimento
                ),
            },
            {
              label: 'Peso',
              value:
                formatarPeso(
                  pet.peso
                ),
            },
            {
              label: 'Microchip',
              value:
                pet.microchip ||
                'Não informado',
            },
          ]}
        />
      );
    }

    if (activeTab === 'historico') {
      const pesos =
        obterHistoricoPesos();

      return (
        <>
          <WeightChart
            values={pesos}
          />

          <Typography
            variant="bodyMedium"
            color={colors.brown}
            style={styles.sectionTitle}
          >
            Vacinas aplicadas
          </Typography>

          {vacinas.length === 0 ? (
            <Typography
              variant="caption"
              color={colors.textSecondary}
              style={styles.emptyText}
            >
              Nenhuma vacina cadastrada.
            </Typography>
          ) : (
            vacinas.map((vacina) => (
              <VaccineHistoryCard
                key={vacina.id}
                name={vacina.nome}
                date={
                  vacina.proximaDose
                    ? formatarData(
                        vacina.proximaDose
                          .dataPrevista
                      )
                    : 'Sem dose registrada'
                }
                nextDate={
                  vacina.proximaDose
                    ? formatarData(
                        vacina.proximaDose
                          .dataPrevista
                      )
                    : 'Não informado'
                }
              />
            ))
          )}
        </>
      );
    }

    return (
      <>
        <View
          style={styles.documentsHeader}
        >
          <Typography
            variant="bodyMedium"
            color={colors.brown}
          >
            Vacinas e documentos
          </Typography>

          <Pressable
            style={styles.addButton}
            onPress={() =>
              router.push(
                '/nova-vacina'
              )
            }
          >
            <Typography
              variant="h3"
              color={colors.backgroundLight}
            >
              +
            </Typography>
          </Pressable>
        </View>

        <View
          style={styles.documentContainer}
        >
          {vacinas.length === 0 ? (
            <Typography
              variant="caption"
              color={colors.textSecondary}
            >
              Nenhum documento cadastrado.
            </Typography>
          ) : (
            vacinas.map((vacina) => (
              <DocumentCard
                key={vacina.id}
                title={vacina.nome}
                description={
                  vacina.proximaDose
                    ? `Próxima dose: ${formatarData(
                        vacina.proximaDose
                          .dataPrevista
                      )}`
                    : 'Sem próxima dose cadastrada'
                }
              />
            ))
          )}
        </View>
      </>
    );
  }

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

  if (!pet) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
      >
        <ProfileHeader
          name={pet.nome}
          species={pet.especie}
          breed={
            pet.raca ||
            'Raça não informada'
          }
          image={pet.fotoLink}
          onBack={() =>
            router.back()
          }
          onEdit={() =>
            router.push({
              pathname: '/editar-pet',
              params: {
                petId: pet.id,
              },
            })
          }
        />

        <ProfileTabs
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {renderContent()}

        <View
          style={styles.shareButton}
        >
          <Button
            title="Compartilhar prontuário"
            onPress={() => {}}
          />
        </View>

        <Pressable
          onPress={excluirPet}
          style={styles.deleteButton}
        >
          <Typography
            variant="caption"
            color={colors.error}
          >
            Excluir pet
          </Typography>
        </Pressable>
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
    paddingBottom: 30,
  },

  sectionTitle: {
    marginHorizontal: 28,
    marginTop: 14,
    marginBottom: 10,
  },

  emptyText: {
    marginHorizontal: 28,
    marginBottom: 10,
  },

  documentsHeader: {
    marginHorizontal: 28,

    marginBottom: 14,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  documentContainer: {
    marginHorizontal: 28,
    gap: 10,
  },

  addButton: {
    width: 32,
    height: 32,

    borderRadius: 8,

    backgroundColor: colors.brown,

    alignItems: 'center',
    justifyContent: 'center',
  },

  shareButton: {
    marginHorizontal: 28,
    marginTop: 26,
  },

  deleteButton: {
    alignItems: 'center',

    marginTop: 16,
  },

  loadingContainer: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor:
      colors.background,
  },
});