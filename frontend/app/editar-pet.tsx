import { useState } from 'react';

import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { router } from 'expo-router';

import { colors } from '@/theme';

import { Typography } from '@/components/Typography/Typography';
import { FormInput } from '@/components/FormInput/FormInput';
import { Button } from '@/components/Button/Button';

export default function EditarPetScreen() {
  const [name, setName] = useState('Chico');
  const [breed, setBreed] =
    useState('Spitz alemão');
  const [age, setAge] = useState('3 anos');
  const [weight, setWeight] = useState('4 kg');
  const [microchip, setMicrochip] =
    useState('500284262004445');

  const [species, setSpecies] =
    useState<'Cachorro' | 'Gato'>('Cachorro');

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
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
            Editar pet
          </Typography>
        </View>

        <View style={styles.form}>
          <FormInput
            label="Nome"
            value={name}
            onChangeText={setName}
          />

          <Typography
            variant="caption"
            color={colors.textSecondary}
          >
            Espécie
          </Typography>

          <View style={styles.speciesContainer}>
            <Pressable
              onPress={() =>
                setSpecies('Cachorro')
              }
              style={[
                styles.speciesButton,
                species === 'Cachorro' &&
                  styles.selectedSpecies,
              ]}
            >
              <Typography
                variant="bodySemiBold"
                color={
                  species === 'Cachorro'
                    ? colors.backgroundLight
                    : colors.brown
                }
              >
                Cachorro
              </Typography>
            </Pressable>

            <Pressable
              onPress={() => setSpecies('Gato')}
              style={[
                styles.speciesButton,
                species === 'Gato' &&
                  styles.selectedSpecies,
              ]}
            >
              <Typography
                variant="bodySemiBold"
                color={
                  species === 'Gato'
                    ? colors.backgroundLight
                    : colors.brown
                }
              >
                Gato
              </Typography>
            </Pressable>
          </View>

          <FormInput
            label="Outro"
            value=""
            onChangeText={() => {}}
          />

          <FormInput
            label="Raça"
            value={breed}
            onChangeText={setBreed}
          />

          <FormInput
            label="Idade"
            value={age}
            onChangeText={setAge}
          />

          <FormInput
            label="Peso"
            value={weight}
            onChangeText={setWeight}
          />

          <FormInput
            label="Microchip"
            value={microchip}
            onChangeText={setMicrochip}
          />

          <Button
            title="Salvar alterações"
            onPress={() => router.back()}
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
    paddingHorizontal: 42,
    paddingTop: 70,
    paddingBottom: 40,
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  form: {
    marginTop: 24,
    gap: 20,
  },

  speciesContainer: {
    flexDirection: 'row',
    gap: 12,

    marginTop: -12,
  },

  speciesButton: {
    flex: 1,

    height: 40,

    borderRadius: 22,

    backgroundColor: colors.backgroundLight,

    alignItems: 'center',
    justifyContent: 'center',
  },

  selectedSpecies: {
    backgroundColor: colors.brown,
  },
});