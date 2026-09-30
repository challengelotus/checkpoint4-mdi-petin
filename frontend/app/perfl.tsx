import { useState } from 'react';

import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { router } from 'expo-router';

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

export default function PerfilScreen() {
  const [activeTab, setActiveTab] =
    useState<ProfileTab>('dados');

  function renderContent() {
    if (activeTab === 'dados') {
      return (
        <ProfileInfoCard
          data={[
            {
              label: 'Nome',
              value: 'Chico',
            },
            {
              label: 'Espécie',
              value: 'Cachorro',
            },
            {
              label: 'Raça',
              value: 'Spitz alemão',
            },
            {
              label: 'Idade',
              value: '3 anos',
            },
            {
              label: 'Peso',
              value: '4 kg',
            },
            {
              label: 'Microchip',
              value: '500284262004445',
            },
          ]}
        />
      );
    }

    if (activeTab === 'historico') {
      return (
        <>
          <WeightChart
            values={[3.2, 3.3, 3.7, 4]}
          />

          <Typography
            variant="bodyMedium"
            color={colors.brown}
            style={styles.sectionTitle}
          >
            Vacinas aplicadas
          </Typography>

          <VaccineHistoryCard
            name="Antirrábica"
            date="28/02/2026"
            nextDate="28/02/2027"
          />
        </>
      );
    }

    return (
      <>
        <View style={styles.documentsHeader}>
          <Typography
            variant="bodyMedium"
            color={colors.brown}
          >
            Vacinas e documentos
          </Typography>

          <Pressable
            style={styles.addButton}
          >
            <Typography
              variant="h3"
              color={colors.backgroundLight}
            >
              +
            </Typography>
          </Pressable>
        </View>

        <View style={styles.documentContainer}>
          <DocumentCard
            title="Antirrábica"
            description="28/02/2026 - Dra Ana / Clínica Amigo Fiel"
          />
        </View>
      </>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <ProfileHeader
          name="Chico"
          species="Cachorro"
          breed="Spitz alemão"
          onBack={() => router.back()}
          onEdit={() =>
            router.push('/editar-pet')
          }
        />

        <ProfileTabs
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {renderContent()}

        <Button
          title="Compartilhar prontuário"
          onPress={() => {}}
          style={styles.shareButton}
        />

        <Pressable
          onPress={() => {}}
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

  documentsHeader: {
    marginHorizontal: 28,

    marginBottom: 14,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  documentContainer: {
    marginHorizontal: 28,
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
});