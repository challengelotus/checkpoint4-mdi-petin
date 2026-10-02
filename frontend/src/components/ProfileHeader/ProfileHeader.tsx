import {
  Image,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { router } from 'expo-router';

import { colors } from '@/theme';
import { Typography } from '@/components/Typography/Typography';
import { Header } from '@/components/Header/Header';

interface ProfileHeaderProps {
  name: string;
  species: string;
  breed: string;
  image?: string;
  onBack: () => void;
  onEdit: () => void;
}

export function ProfileHeader({
  name,
  species,
  breed,
  image,
  onBack,
  onEdit,
}: ProfileHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header
          title="Perfil Completo"
          onBack={() => router.back()}
          titleColor={colors.backgroundLight}
          fontSize="h2"
        />
      </View>

      <View style={styles.petContainer}>
        <View style={styles.petInfo}>
          <View style={styles.imageContainer}>
            {image ? (
              <Image
                source={{ uri: image }}
                style={styles.image}
              />
            ) : (
              <Typography variant="h3">
                🐶
              </Typography>
            )}
          </View>

          <View>
            <Typography
              variant="h3"
              color={colors.brown}
            >
              {name}
            </Typography>

            <Typography
              variant="caption"
              color={colors.textSecondary}
            >
              {species} - {breed}
            </Typography>
          </View>
        </View>

        <Pressable onPress={onEdit}>
          <Typography
            variant="captionMedium"
            color={colors.primary}
          >
            Editar
          </Typography>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    paddingHorizontal: 26,
    paddingTop: 54,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 8,
  },

  backButton: {
    position: 'absolute',
    left: 26,
    top: 50,
    zIndex: 2,
  },

  petContainer: {
    marginTop: 18,

    marginHorizontal: -26,

    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 20,

    borderTopLeftRadius: 38,
    borderTopRightRadius: 38,

    backgroundColor: colors.background,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  petInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  imageContainer: {
    width: 72,
    height: 72,

    borderRadius: 36,

    backgroundColor: colors.backgroundLight,

    alignItems: 'center',
    justifyContent: 'center',

    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: '100%',
  },
});