import { useState } from 'react';

import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { router } from 'expo-router';

import {
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import { colors } from '@/theme';

import { Typography } from '@/components/Typography/Typography';
import { Calendar } from '@/components/Calendar/Calendar';
import { CalendarEventCard } from '@/components/CalendarEventCard/CalendarEventCard';

export default function CalendarioScreen() {
  const [selectedDay, setSelectedDay] =
    useState(15);

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
            onPress={() =>
              router.push('/nova-nota')
            }
          >
            <MaterialCommunityIcons
              name="plus"
              size={25}
              color={colors.backgroundLight}
            />
          </Pressable>
        </View>

        <Typography
          variant="bodySemiBold"
          color={colors.backgroundLight}
          style={styles.month}
        >
          Março 2026
        </Typography>

        <Calendar
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
        />

        <Typography
          variant="h4"
          color={colors.backgroundLight}
          style={styles.eventsTitle}
        >
          Eventos do dia {selectedDay}
        </Typography>

        <View style={styles.events}>
          <CalendarEventCard
            time="09:00"
            title="Consulta com Dra. Ana"
          />

          <CalendarEventCard
            time="18:00"
            title="Vermífugo - Chico"
            highlighted
          />
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

  month: {
    textAlign: 'center',

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