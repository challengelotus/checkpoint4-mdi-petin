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
import { Toggle } from '@/components/Toggle/Toggle';
import { Button } from '@/components/Button/Button';
import { Typography } from '@/components/Typography/Typography';

export default function NovaNotaScreen() {
  const [note, setNote] = useState('');
  const [time, setTime] = useState('09:00');
  const [reminder, setReminder] =
    useState(true);

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
          title="Nova nota"
          onBack={() => router.back()}
        />

        <Typography
          variant="caption"
          color={colors.textSecondary}
          style={styles.date}
        >
          Dia 15 de Março 2026
        </Typography>

        <View style={styles.form}>
          <FormInput
            label="Texto da nota"
            value={note}
            onChangeText={setNote}
            placeholder="Ex: levar brinquedo ovo"
          />

          <FormInput
            label="Horário"
            value={time}
            onChangeText={setTime}
          />

          <View style={styles.reminder}>
            <Typography
              variant="caption"
              color={colors.brown}
            >
              Lembrete
            </Typography>

            <Toggle
              value={reminder}
              onChange={setReminder}
            />
          </View>

          <Button
            title="Salvar nota"
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

  date: {
    marginTop: 24,
  },

  form: {
    marginTop: 16,

    gap: 24,
  },

  reminder: {
    minHeight: 36,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-between',
  },
});