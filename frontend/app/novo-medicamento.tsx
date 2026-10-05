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
import { Button } from '@/components/Button/Button';

import { medicamentoService } from '@/services/supabase/medicamentoService';
import {
  combinarDataHoraISO,
  dataBRparaISO,
  dataLocalISO,
  horaValida,
  isoParaDataBR,
  mascaraData,
  mascaraHora,
  mensagemErro,
} from '@/utils/date';

export default function NovoMedicamentoScreen() {
  const { petId } = useLocalSearchParams<{
    petId?: string;
  }>();

  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [firstDate, setFirstDate] = useState(
    isoParaDataBR(dataLocalISO(new Date()))
  );
  const [firstTime, setFirstTime] = useState('08:00');
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!petId) {
      Alert.alert('Erro', 'Pet não identificado.');
      return;
    }

    if (!name.trim()) {
      Alert.alert('Atenção', 'Digite o nome do medicamento.');
      return;
    }

    const dataISO = dataBRparaISO(firstDate);

    if (!dataISO) {
      Alert.alert('Atenção', 'Data da primeira dose inválida. Use dd/mm/aaaa.');
      return;
    }

    if (!horaValida(firstTime)) {
      Alert.alert('Atenção', 'Horário inválido. Use hh:mm.');
      return;
    }

    try {
      setLoading(true);

      await medicamentoService.cadastrar({
        petId,
        nome: name.trim(),
        dosagem: dosage.trim() || undefined,
        // O schema não possui coluna de frequência; ela é guardada em observacoes
        observacoes: frequency.trim() || undefined,
        doses: [
          {
            numeroDose: '1',
            dataPrevista: combinarDataHoraISO(dataISO, firstTime),
          },
        ],
      });

      router.back();
    } catch (error) {
      console.error('Erro ao cadastrar medicamento:', error);
      Alert.alert(
        'Erro',
        mensagemErro(error, 'Não foi possível salvar o medicamento.')
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
            placeholder="Ex: 1 comprimido"
          />

          <FormInput
            label="Frequência"
            value={frequency}
            onChangeText={setFrequency}
            placeholder="Ex: A cada 3 meses"
          />

          <FormInput
            label="Data da primeira dose"
            value={firstDate}
            onChangeText={(t) =>
              setFirstDate(mascaraData(t))
            }
            placeholder="dd/mm/aaaa"
            keyboardType="number-pad"
            maxLength={10}
          />

          <FormInput
            label="Horário"
            value={firstTime}
            onChangeText={(t) =>
              setFirstTime(mascaraHora(t))
            }
            placeholder="hh:mm"
            keyboardType="number-pad"
            maxLength={5}
          />

          <Button
            title="Salvar"
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

  form: {
    marginTop: 26,

    gap: 24,
  },
});
