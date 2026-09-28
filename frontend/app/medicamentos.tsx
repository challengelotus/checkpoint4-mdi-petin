import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { router } from 'expo-router';

import {
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import { colors } from '@/theme';

import { Typography } from '@/components/Typography/Typography';
import { MedicationCard } from '@/components/MedicationCard/MedicationCard';

export default function MedicamentosScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Pressable
              onPress={() => router.back()}
            >
              <Typography
                variant="h2"
                color={colors.brown}
              >
                ‹
              </Typography>
            </Pressable>

            <Typography variant="h2">
              Medicamentos
            </Typography>
          </View>

          <Pressable
            style={styles.addButton}
            onPress={() =>
              router.push('/novo-medicamento')
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
          <MedicationCard
            name="Vermífugo"
            dosage="1 comprimido"
            frequency="A cada 3 meses"
            onDelete={() => {}}
          />

          <MedicationCard
            name="Vermífugo"
            dosage="1 comprimido"
            frequency="A cada 3 meses"
            onDelete={() => {}}
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
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 6,
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