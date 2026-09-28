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
import { DateField } from '@/components/DateField/DateField';
import { Button } from '@/components/Button/Button';

export default function NovaVacinaScreen() {
  const [name, setName] = useState('');
  const [applicationDate, setApplicationDate] =
    useState('');
  const [nextDose, setNextDose] = useState('');
  const [clinic, setClinic] = useState('');
  const [notes, setNotes] = useState('');

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
          title="Nova vacina"
          onBack={() => router.back()}
        />

        <View style={styles.form}>
          <FormInput
            label="Nome da vacina"
            value={name}
            onChangeText={setName}
          />

          <DateField
            label="Data de aplicação"
            value={
              applicationDate || 'dd/mm/aaaa'
            }
            onPress={() => {}}
          />

          <DateField
            label="Próxima dose"
            value={nextDose || 'dd/mm/aaaa'}
            onPress={() => {}}
          />

          <FormInput
            label="Veterinário/Clínica"
            value={clinic}
            onChangeText={setClinic}
          />

          <FormInput
            label="Observações"
            value={notes}
            onChangeText={setNotes}
            multiline
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
    paddingBottom: 32,
  },

  form: {
    marginTop: 26,

    gap: 18,
  },
});