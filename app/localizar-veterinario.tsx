import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { colors } from '@/theme';

import { router } from 'expo-router';

import { Header } from '@/components/Header/Header';

import { MapPlaceholder } from '@/components/MapPlaceholder/MapPlaceholder';

import { VetCard } from '@/components/VetCard/VetCard';

export default function LocalizarVeterinarioScreen() {
  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <Header
                title="Localizar veterinário"
                onBack={() => router.back()}
                titleColor={colors.backgroundLight}
            />
        </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.body}>
          <MapPlaceholder />

          <View style={styles.vets}>
            <VetCard
              name="Clínica Amigo Fiel"
              description="0.8 km - Aberta agora"
              onRoute={() => {}}
            />

            <VetCard
              name="PetSaúde 24h"
              description="1.4 km - Emergência"
              onRoute={() => {}}
            />
          </View>
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

  content: {
    flexGrow: 1,
    paddingTop: 10,
  },

  header: {
    paddingTop: 54,
    paddingHorizontal: 30,

    flexDirection: 'row',
    alignItems: 'center',

    gap: 8,
  },

  body: {
    flex: 1,
    marginTop: 20,

    padding: 28,

    borderTopLeftRadius: 38,
    borderTopRightRadius: 38,

    backgroundColor: colors.background,
  },

  vets: {
    marginTop: 26,

    gap: 14,
  },
});