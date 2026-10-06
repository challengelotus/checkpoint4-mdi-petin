import {
  StyleSheet,
  View,
} from 'react-native';

import { colors } from '@/theme';
import { Typography } from '@/components/Typography/Typography';

interface VaccineHistoryCardProps {
  name: string;
  date: string;
  nextDate: string;
}

export function VaccineHistoryCard({
  name,
  date,
  nextDate,
}: VaccineHistoryCardProps) {
  return (
    <View style={styles.container}>
      <Typography
        variant="bodyMedium"
        color={colors.brown}
      >
        {name}
      </Typography>

      <Typography
        variant="caption"
        color={colors.textSecondary}
        style={styles.description}
      >
        Aplicada em {date} - próxima {nextDate}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 28,

    paddingHorizontal: 18,
    paddingVertical: 16,

    borderRadius: 16,

    backgroundColor: colors.backgroundLight,
  },

  description: {
    marginTop: 5,
  },
});