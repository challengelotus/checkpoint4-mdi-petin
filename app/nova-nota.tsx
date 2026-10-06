import { useState } from 'react';

import {
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import {
  router,
  useLocalSearchParams,
} from 'expo-router';

import { colors } from '@/theme';

import { Header } from '@/components/Header/Header';
import { FormInput } from '@/components/FormInput/FormInput';
import { Toggle } from '@/components/Toggle/Toggle';
import { Button } from '@/components/Button/Button';
import { Typography } from '@/components/Typography/Typography';

import { calendarioService } from '@/services/supabase/calendarioService';
import {
  combinarDataHoraISO,
  dataLocalISO,
  horaValida,
  mascaraHora,
  mensagemErro,
  nomeDoMes,
} from '@/utils/date';

export default function NovaNotaScreen() {
  const { petId, data } = useLocalSearchParams<{
    petId?: string;
    data?: string;
  }>();

  // Data escolhida no calendário (YYYY-MM-DD); padrão: hoje
  const dataISO = data ?? dataLocalISO(new Date());
  const [aaaa, mm, dd] = dataISO.split('-');

  const [note, setNote] = useState('');
  const [time, setTime] = useState('09:00');
  const [reminder, setReminder] =
    useState(true);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!petId) {
      Alert.alert('Erro', 'Pet não identificado.');
      return;
    }

    if (!note.trim()) {
      Alert.alert('Atenção', 'Digite o texto da nota.');
      return;
    }

    if (!horaValida(time)) {
      Alert.alert('Atenção', 'Horário inválido. Use hh:mm.');
      return;
    }

    try {
      setLoading(true);

      await calendarioService.agendarConsulta({
        petId,
        observacao: note.trim(),
        dataHora: combinarDataHoraISO(dataISO, time),
      });

      router.back();
    } catch (error) {
      console.error('Erro ao salvar nota:', error);
      Alert.alert(
        'Erro',
        mensagemErro(error, 'Não foi possível salvar a nota.')
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
          Dia {Number(dd)} de {nomeDoMes(Number(mm))} {aaaa}
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
            onChangeText={(t) =>
              setTime(mascaraHora(t))
            }
            placeholder="hh:mm"
            keyboardType="number-pad"
            maxLength={5}
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
            loading={loading}
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
