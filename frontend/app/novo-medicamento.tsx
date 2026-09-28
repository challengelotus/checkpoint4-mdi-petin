import { useState } from 'react';

import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { router } from 'expo-router';

import { colors } from '@/theme';

import { Header } from '@/components/Header/Header';
import { FormInput } from '@/components/FormInput/FormInput';
import { Button } from '@/components/Button/Button';

export default function NovoMedicamentoScreen() {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');

  function handleSave() {
    router.back();
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Header
          title="Novo medicamento"
          onBack={() => router.back()}
        />

        <View style={styles.form}>
          <FormInput
            label="Nome do medicamento"
            value={name}
            onChangeText={setName}
          />

          <FormInput
            label="Dosagem"
            value={dosage}
            onChangeText={setDosage}
          />

          <FormInput
            label="Frequência"
            value={frequency}
            onChangeText={setFrequency}
          />

          <Button
            title="Salvar"
            onPress={handleSave}
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

  form: {
    marginTop: 26,

    gap: 24,
  },
});