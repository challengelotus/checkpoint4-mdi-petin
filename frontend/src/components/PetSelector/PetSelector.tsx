import {
  Image,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { colors } from '@/theme';

import { Typography } from '@/components/Typography/Typography';

import { Pet } from '@/types/pet';

interface PetSelectorProps {
  pets: Pet[];
  selectedPet: string;
  onSelect: (petId: string) => void;
}

export function PetSelector({
  pets,
  selectedPet,
  onSelect,
}: PetSelectorProps) {
  return (
    <View style={styles.container}>
      {pets.map((pet) => {
        const selected = pet.id === selectedPet;

        return (
          <Pressable
            key={pet.id}
            onPress={() => onSelect(pet.id)}
            style={styles.item}
          >
            <View
              style={[
                styles.imageContainer,
                selected && styles.selected,
              ]}
            >
              {pet.fotoLink ? (
                <Image
                  source={{
                    uri: pet.fotoLink,
                  }}
                  style={styles.image}
                />
              ) : (
                <Typography
                  variant="caption"
                  color={colors.brown}
                >
                  🐾
                </Typography>
              )}
            </View>

            <Typography
              variant="caption"
              color={colors.backgroundLight}
              style={styles.name}
            >
              {pet.nome}
            </Typography>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
  },

  item: {
    width: 58,
    alignItems: 'center',
  },

  imageContainer: {
    width: 56,
    height: 56,

    borderRadius: 16,

    borderWidth: 1,
    borderColor: colors.backgroundLight,

    alignItems: 'center',
    justifyContent: 'center',

    overflow: 'hidden',
  },

  selected: {
    borderWidth: 3,
    borderColor: colors.backgroundLight,
  },

  image: {
    width: '100%',
    height: '100%',
  },

  name: {
    marginTop: 3,
    textAlign: 'center',
  },
});