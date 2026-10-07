import React from 'react';

import {
  StyleSheet,
  View,
} from 'react-native';

import { colors } from '@/theme';
import { Typography } from '@/components/Typography/Typography';

interface ActivityCardProps {
  title: string;
  date: string;
}

export function ActivityCard({
  title,
  date,
}: ActivityCardProps) {
  return (
    <View style={styles.container}>
      <Typography
        variant="caption"
        color={colors.brown}
        style={styles.title}
      >
        • {title}
      </Typography>

      <Typography
        variant="caption"
        color={colors.textSecondary}
      >
        {date}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 46,

    paddingHorizontal: 16,

    borderRadius: 14,

    backgroundColor: colors.backgroundLight,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    flex: 1,
  },
});