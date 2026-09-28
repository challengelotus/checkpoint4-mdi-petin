import {
  StyleSheet,
  View,
} from 'react-native';

import { colors } from '@/theme';
import { Typography } from '@/components/Typography/Typography';

interface CalendarEventCardProps {
  time: string;
  title: string;
  highlighted?: boolean;
}

export function CalendarEventCard({
  time,
  title,
  highlighted = false,
}: CalendarEventCardProps) {
  return (
    <View
      style={[
        styles.container,
        highlighted && styles.highlighted,
      ]}
    >
      <Typography
        variant="captionMedium"
        color={
          highlighted
            ? colors.success
            : colors.brown
        }
      >
        {time}
      </Typography>

      <Typography
        variant="caption"
        color={colors.brown}
        style={styles.title}
      >
        {title}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 64,

    paddingHorizontal: 20,
    paddingVertical: 12,

    borderRadius: 14,

    backgroundColor: colors.background,

    justifyContent: 'center',
  },

  highlighted: {
    backgroundColor: colors.successLight,
  },

  title: {
    marginTop: 4,
  },
});