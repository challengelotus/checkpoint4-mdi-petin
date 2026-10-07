import {
  StyleSheet,
  View,
} from 'react-native';

import { colors } from '@/theme';
import { Typography } from '@/components/Typography/Typography';

interface CalendarProps {
  selectedDay: number;
  onSelectDay?: (day: number) => void;
  /** Ano (ex.: 2026). Se omitido, usa o mês/ano atuais. */
  year?: number;
  /** Mês de 1 a 12. Se omitido, usa o mês/ano atuais. */
  month?: number;
  /** Dias do mês que possuem eventos (mostram um marcador). */
  markedDays?: number[];
}

function montarSemanas(year: number, month: number): (number | null)[][] {
  const primeiroDiaSemana = new Date(year, month - 1, 1).getDay();
  const totalDias = new Date(year, month, 0).getDate();

  const celulas: (number | null)[] = [
    ...Array(primeiroDiaSemana).fill(null),
    ...Array.from({ length: totalDias }, (_, i) => i + 1),
  ];
  while (celulas.length % 7 !== 0) celulas.push(null);

  const semanas: (number | null)[][] = [];
  for (let i = 0; i < celulas.length; i += 7) {
    semanas.push(celulas.slice(i, i + 7));
  }
  return semanas;
}

const weekDays = [
  'D',
  'S',
  'T',
  'Q',
  'Q',
  'S',
  'S',
];

export function Calendar({
  selectedDay,
  onSelectDay,
  year,
  month,
  markedDays = [],
}: CalendarProps) {
  const hoje = new Date();
  const weeks = montarSemanas(
    year ?? hoje.getFullYear(),
    month ?? hoje.getMonth() + 1
  );

  return (
    <View style={styles.container}>
      <View style={styles.weekHeader}>
        {weekDays.map((day, index) => (
          <View
            key={`${day}-${index}`}
            style={styles.day}
          >
            <Typography
              variant="caption"
              color={colors.brownLight}
            >
              {day}
            </Typography>
          </View>
        ))}
      </View>

      {weeks.map((week, weekIndex) => (
        <View
          key={weekIndex}
          style={styles.week}
        >
          {week.map((day, dayIndex) => {
            if (!day) {
              return (
                <View
                  key={`vazio-${dayIndex}`}
                  style={styles.day}
                />
              );
            }

            const selected = day === selectedDay;

            return (
              <View
                key={`dia-${dayIndex}`}
                style={styles.day}
              >
                <View
                  style={[
                    styles.dayButton,
                    selected && styles.selectedDay,
                  ]}
                >
                  <Typography
                    variant="caption"
                    color={
                      selected
                        ? colors.backgroundLight
                        : colors.brown
                    }
                    onPress={() =>
                      onSelectDay?.(day)
                    }
                  >
                    {day}
                  </Typography>
                </View>

                {markedDays.includes(day) && (
                  <View
                    style={[
                      styles.dot,
                      selected && styles.dotSelected,
                    ]}
                  />
                )}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingVertical: 16,

    borderRadius: 20,

    backgroundColor: colors.backgroundLight,
  },

  weekHeader: {
    flexDirection: 'row',
  },

  week: {
    flexDirection: 'row',
  },

  day: {
    flex: 1,

    height: 34,

    alignItems: 'center',
    justifyContent: 'center',
  },

  dayButton: {
    width: 34,
    height: 34,

    borderRadius: 8,

    alignItems: 'center',
    justifyContent: 'center',
  },

  selectedDay: {
    borderRadius: 8,
    backgroundColor: colors.primary,
  },

  dot: {
    position: 'absolute',
    bottom: 0,

    width: 5,
    height: 5,

    borderRadius: 3,

    backgroundColor: colors.orange,
  },

  dotSelected: {
    backgroundColor: colors.brown,
  },
});