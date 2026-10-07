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

import { vacinaService } from '@/services/supabase/vacinaService';
import { CriarDoseVacinaDTO } from '@/types/vacina';
import { ehLimitePlano } from '@/utils/planoLimite';
import {
  dataBRparaISO,
  mascaraData,
  mensagemErro,
} from '@/utils/date';

export default function NovaVacinaScreen() {
  const { petId } = useLocalSearchParams<{
    petId?: string;
  }>();

  const [name, setName] = useState('');
  const [applicationDate, setApplicationDate] =
    useState('');
  const [nextDose, setNextDose] = useState('');
  const [clinic, setClinic] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!petId) {
      Alert.alert('Erro', 'Pet não identificado.');
      return;
    }

    if (!name.trim()) {
      Alert.alert('Atenção', 'Digite o nome da vacina.');
      return;
    }

    const aplicacaoISO = applicationDate.trim()
      ? dataBRparaISO(applicationDate)
      : null;
    const proximaISO = nextDose.trim()
      ? dataBRparaISO(nextDose)
      : null;

    if (applicationDate.trim() && !aplicacaoISO) {
      Alert.alert('Atenção', 'Data de aplicação inválida. Use dd/mm/aaaa.');
      return;
    }

    if (nextDose.trim() && !proximaISO) {
      Alert.alert('Atenção', 'Data da próxima dose inválida. Use dd/mm/aaaa.');
      return;
    }

    if (!aplicacaoISO && !proximaISO) {
      Alert.alert(
        'Atenção',
        'Informe a data de aplicação ou a data da próxima dose.'
      );
      return;
    }

    const doses: CriarDoseVacinaDTO[] = [];

    if (aplicacaoISO) {
      doses.push({
        numeroDose: '1',
        dataPrevista: aplicacaoISO,
        dataAplicacao: aplicacaoISO,
        status: 'CONCLUIDO',
      });
    }

    if (proximaISO) {
      doses.push({
        numeroDose: String(doses.length + 1),
        dataPrevista: proximaISO,
        status: 'PENDENTE',
      });
    }

    const observacoes = [
      clinic.trim() ? `Clínica/Veterinário: ${clinic.trim()}` : '',
      notes.trim(),
    ]
      .filter(Boolean)
      .join('\n');

    try {
      setLoading(true);

      await vacinaService.cadastrar({
        petId,
        nome: name.trim(),
        observacoes: observacoes || undefined,
        doses,
      });

      router.back();
    } catch (error) {
      // Limite do plano: o service já levou o usuário à tela de assinatura
      if (ehLimitePlano(error)) return;

      console.error('Erro ao cadastrar vacina:', error);
      Alert.alert(
        'Erro',
        mensagemErro(error, 'Não foi possível salvar a vacina.')
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
          title="Nova vacina"
          onBack={() => router.back()}
        />

        <View style={styles.form}>
          <FormInput
            label="Nome da vacina"
            value={name}
            onChangeText={setName}
          />

          <FormInput
            label="Data de aplicação"
            value={applicationDate}
            onChangeText={(t) =>
              setApplicationDate(mascaraData(t))
            }
            placeholder="dd/mm/aaaa"
            keyboardType="number-pad"
            maxLength={10}
          />

          <FormInput
            label="Próxima dose"
            value={nextDose}
            onChangeText={(t) =>
              setNextDose(mascaraData(t))
            }
            placeholder="dd/mm/aaaa"
            keyboardType="number-pad"
            maxLength={10}
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

    gap: 18,
  },
});
