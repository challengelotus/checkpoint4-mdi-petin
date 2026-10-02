import { useState } from 'react';

import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { router, Tabs } from 'expo-router';

import { colors } from '@/theme';

import {
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import {
  Pet,
  PetSelector,
} from '@/components/PetSelector/PetSelector';

import { DashboardButton } from '@/components/DashboardButton/DashboardButton';
import { ActivityCard } from '@/components/ActivityCard/ActivityCard';
import { Typography } from '@/components/Typography/Typography';
import { Header } from '@/components/Header/Header';

const pets: Pet[] = [
  {
    id: 'chico',
    name: 'Chico',
  },
  {
    id: 'violeta',
    name: 'Violeta',
  },
  {
    id: 'lisa',
    name: 'Lisa',
  },
  {
    id: 'jorge',
    name: 'Jorge',
  },
];

export default function DashboardPetScreen() {
  const [selectedPet, setSelectedPet] =
    useState('chico');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header
          title="Chico"
          onBack={() => router.back()}
          titleColor={colors.backgroundLight}
          fontSize="h2"
        />
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <PetSelector
          pets={pets}
          selectedPet={selectedPet}
          onSelect={setSelectedPet}
        />

        <View style={styles.vaccineCard}>
          <View style={styles.days}>
            <Typography
              variant="h2"
              color={colors.brown}
            >
              12
            </Typography>

            <Typography
              variant="bodySemiBold"
              color={colors.textSecondary}
            >
              {' '}
              dias
            </Typography>
          </View>

          <Typography
            variant="caption"
            color={colors.textSecondary}
          >
            até a Vacina Antirrábica
          </Typography>
        </View>

        <View style={styles.buttons}>
          <View style={styles.row}>
            <DashboardButton
              title="+ Nova vacina"
              primary
              onPress={() =>
                router.push('/nova-vacina')
              }
            />

            <DashboardButton
              title="Medicamentos"
              onPress={() =>
                router.push('/medicamentos')
              }
            />
          </View>

          <View style={styles.row}>
            <DashboardButton
              title="Perfil"
              onPress={() => {
                router.push('/perfl-pet');
              }}
            />

            <DashboardButton
              title="Localizar"
              onPress={() => {
                router.push('/localizar-pet');
              }}
            />
          </View>
        </View>

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
});