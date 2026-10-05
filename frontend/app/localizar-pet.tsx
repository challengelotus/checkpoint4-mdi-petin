import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { router } from 'expo-router';

import { colors } from '@/theme';

import { Header } from '@/components/Header/Header';
import { useAtivoPet } from '@/hooks/useAtivoPet';

import {
  MapPlaceholder,
} from '@/components/MapPlaceholder/MapPlaceholder';

import {
  PetLocationCard,
} from '@/components/PetLocationCard/PetLocationCard';

export default function LocalizarPetScreen() {
  const { pet } = useAtivoPet();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header
            title={pet ? `Localizar ${pet.nome}` : 'Localizar pet'}
            onBack={() => router.back()}
            titleColor={colors.backgroundLight}
        />
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.body}>
          <MapPlaceholder pet />

          <View style={styles.status}>
            <PetLocationCard
              title="Dentro da área segura"
              description="Última atualização há 5 min - via microchip"
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

  status: {
    marginTop: 24,
  },
});