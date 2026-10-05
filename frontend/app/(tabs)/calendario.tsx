import { useCallback, useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import {
  router,
  useFocusEffect,
} from 'expo-router';

import {
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import { colors } from '@/theme';

import { Typography } from '@/components/Typography/Typography';
import { Calendar } from '@/components/Calendar/Calendar';
import { CalendarEventCard } from '@/components/CalendarEventCard/CalendarEventCard';
import { PetSelector } from '@/components/PetSelector/PetSelector';

import { useAtivoPet } from '@/hooks/useAtivoPet';
import { calendarioService } from '@/services/supabase/calendarioService';
import { EventoCalendario } from '@/types/calendario';
import { nomeDoMes } from '@/utils/date';

export default function CalendarioScreen() {
  const { pets, petId, setPetId } = useAtivoPet();

  const hoje = new Date();
  const [ano, setAno] = useState(hoje.getFullYear());
  const [mes, setMes] = useState(hoje.getMonth() + 1);
  const [selectedDay, setSelectedDay] =
    useState(hoje.getDate());

  const [diasMarcados, setDiasMarcados] =
    useState<number[]>([]);
  const [eventos, setEventos] =
    useState<EventoCalendario[]>([]);
  const [loading, setLoading] = useState(false);

  const mm = String(mes).padStart(2, '0');
  const dd = String(selectedDay).padStart(2, '0');
  const dataIso = `${ano}-${mm}-${dd}`;

  const carregar = useCallback(async () => {
    if (!petId) return;

    try {
      setLoading(true);

      const [dias, eventosDia] = await Promise.all([
        calendarioService.obterDiasComEventosNoMes(petId, ano, mes),
        calendarioService.obterEventosDoDia(petId, dataIso),
      ]);

      setDiasMarcados(
        dias.map((d) => Number(d.split('-')[2]))
      );
      setEventos(eventosDia);
    } catch (error) {
      console.error('Erro ao carregar calendário:', error);
      setDiasMarcados([]);
      setEventos([]);
    } finally {
      setLoading(false);
    }
  }, [petId, ano, mes, dataIso]);

  // Recarrega ao focar a aba (ex.: depois de salvar uma nota)
  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  // Ao trocar de mês, mantém o dia selecionado dentro do limite do mês
  useEffect(() => {
    const ultimo = new Date(ano, mes, 0).getDate();
    if (selectedDay > ultimo) setSelectedDay(ultimo);
  }, [ano, mes, selectedDay]);

  function mudarMes(delta: number) {
    const d = new Date(ano, mes - 1 + delta, 1);
    setAno(d.getFullYear());
    setMes(d.getMonth() + 1);
  }

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
            Calendário
          </Typography>

          <Pressable
            style={styles.addButton}
            disabled={!petId}
            onPress={() =>
              router.push({
                pathname: '/nova-nota',
                params: { petId, data: dataIso },
              })
            }
          >
            <MaterialCommunityIcons
              name="plus"
              size={25}
              color={colors.backgroundLight}
            />
          </Pressable>
        </View>

        {pets.length > 1 && petId && (
          <View style={styles.selector}>
            <PetSelector
              pets={pets}
              selectedPet={petId}
              onSelect={setPetId}
            />
          </View>
        )}

        <View style={styles.monthRow}>
          <Pressable onPress={() => mudarMes(-1)} hitSlop={12}>
            <MaterialCommunityIcons
              name="chevron-left"
              size={26}
              color={colors.backgroundLight}
            />
          </Pressable>

          <Typography
            variant="bodySemiBold"
            color={colors.backgroundLight}
          >
            {nomeDoMes(mes)} {ano}
          </Typography>

          <Pressable onPress={() => mudarMes(1)} hitSlop={12}>
            <MaterialCommunityIcons
              name="chevron-right"
              size={26}
              color={colors.backgroundLight}
            />
          </Pressable>
        </View>

        <Calendar
          year={ano}
          month={mes}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
          markedDays={diasMarcados}
        />

        <Typography
          variant="h4"
          color={colors.backgroundLight}
          style={styles.eventsTitle}
        >
          Eventos do dia {selectedDay}
        </Typography>

        <View style={styles.events}>
          {loading ? (
            <ActivityIndicator color={colors.backgroundLight} />
          ) : eventos.length === 0 ? (
            <Typography
              variant="caption"
              color={colors.backgroundLight}
            >
              Nenhum evento neste dia.
            </Typography>
          ) : (
            eventos.map((evento) => (
              <CalendarEventCard
                key={`${evento.tipo}-${evento.id}`}
                time={evento.hora}
                title={evento.titulo}
                highlighted={evento.tipo === 'MEDICAMENTO'}
              />
            ))
          )}
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
    justifyContent: 'space-between',
  },

  addButton: {
    width: 44,
    height: 44,

    borderRadius: 12,

    backgroundColor: colors.orange,

    alignItems: 'center',
    justifyContent: 'center',
  },

  selector: {
    marginTop: 16,
  },

  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginTop: 12,
    marginBottom: 10,
  },

  eventsTitle: {
    marginTop: 24,
    marginBottom: 14,
  },

  events: {
    gap: 12,
  },
});
