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

import {
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import { colors } from '@/theme';

import { Typography } from '@/components/Typography/Typography';
import { MedicationCard } from '@/components/MedicationCard/MedicationCard';
import { Header } from '@/components/Header/Header';

import { medicamentoService } from '@/services/supabase/medicamentoService';
import { Medicamento } from '@/types/medicamento';
import { mensagemErro } from '@/utils/date';

export default function MedicamentosScreen() {
  const { petId } = useLocalSearchParams<{
    petId?: string;
  }>();

  const [medicamentos, setMedicamentos] =
    useState<Medicamento[]>([]);
  const [loading, setLoading] = useState(true);

  const carregar = useCallback(async () => {
    if (!petId) {
      setLoading(false);
      return;
    }

    try {
      const lista =
        await medicamentoService.listarPorPet(petId);
      setMedicamentos(lista);
    } catch (error) {
      console.error('Erro ao listar medicamentos:', error);
      Alert.alert(
        'Erro',
        mensagemErro(error, 'Não foi possível carregar os medicamentos.')
      );
    } finally {
      setLoading(false);
    }
  }, [petId]);

  // Recarrega ao voltar da tela "Novo medicamento"
  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  function confirmarRemocao(med: Medicamento) {
    Alert.alert(
      'Remover medicamento',
      `Deseja remover ${med.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await medicamentoService.remover(med.id);
              setMedicamentos((atual) =>
                atual.filter((m) => m.id !== med.id)
              );
            } catch (error) {
              Alert.alert(
                'Erro',
                mensagemErro(error, 'Não foi possível remover.')
              );
            }
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Header
            title="Medicamentos"
            onBack={() => router.back()}
            fontSize="h2"
          />

          <Pressable
            style={styles.addButton}
            onPress={() =>
              router.push({
                pathname: '/novo-medicamento',
                params: { petId },
              })
            }
          >
            <MaterialCommunityIcons
              name="plus"
              size={24}
              color={colors.backgroundLight}
            />
          </Pressable>
        </View>

        <View style={styles.medications}>
          {loading ? (
            <ActivityIndicator color={colors.brown} />
          ) : medicamentos.length === 0 ? (
            <Typography
              variant="caption"
              color={colors.textSecondary}
            >
              Nenhum medicamento cadastrado.
            </Typography>
          ) : (
            medicamentos.map((med) => (
              <MedicationCard
                key={med.id}
                name={med.nome}
                dosage={med.dosagem || 'Dosagem não informada'}
                frequency={med.observacoes || 'Sem frequência'}
                onDelete={() => confirmarRemocao(med)}
              />
            ))
          )}
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
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  addButton: {
    width: 44,
    height: 44,

    borderRadius: 12,

    backgroundColor: colors.brown,

    alignItems: 'center',
    justifyContent: 'center',
  },

  medications: {
    marginTop: 30,

    gap: 12,
  },
});
