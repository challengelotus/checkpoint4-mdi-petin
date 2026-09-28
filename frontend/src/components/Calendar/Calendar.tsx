import {
  StyleSheet,
  View,
} from 'react-native';

import { colors } from '@/theme';
import { Typography } from '@/components/Typography/Typography';

interface CalendarProps {
  selectedDay: number;
  onSelectDay?: (day: number) => void;
}

const weeks = [
  [1, 2, 3, 4, 5, 6, 7],
  [8, 9, 10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19, 20, 21],
  [22, 23, 24, 25, 26, 27, 28],
  [29, 30, 31, null, null, null, null],
];

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
}: CalendarProps) {
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
                  key={dayIndex}
                  style={styles.day}
                />
              );
            }

            const selected = day === selectedDay;

            return (
              <View
                key={day}
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
    backgroundColor: colors.primary,
  },
});