import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { router } from 'expo-router';

import { colors } from '@/theme';

import { Typography } from '@/components/Typography/Typography';

import {
  LocationOptionCard,
} from '@/components/LocationOptionCard/LocationOptionCard';

export default function LocalizarScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Typography
            variant="h2"
            color={colors.backgroundLight}
          >
            Localizar
          </Typography>
        </View>

        <View style={styles.options}>
          <LocationOptionCard
            title="Localizar veterinário"
            description="Encontre clínicas e serviços de emergência perto de você"
            onPress={() =>
              router.push(
                '/localizar-veterinario',
              )
            }
          />

          <LocationOptionCard
            title="Localizar Pet"
            description="Veja a posição do pet via chip/rastreador"
            onPress={() =>
              router.push('/localizar-pet')
            }
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

  content: {
    paddingHorizontal: 30,
    paddingTop: 54,
    paddingBottom: 30,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  options: {
    marginTop: 26,
    gap: 16,
  },
});