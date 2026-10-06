import React from 'react';

import {
  Pressable,
  StyleSheet,
} from 'react-native';

import { colors } from '@/theme';
import { Typography } from '@/components/Typography/Typography';

interface DashboardButtonProps {
  title: string;
  primary?: boolean;
  onPress?: () => void;
}

export function DashboardButton({
  title,
  primary = false,
  onPress,
}: DashboardButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        primary && styles.primary,
      ]}
    >
      <Typography
        variant="bodySemiBold"
        color={
          primary
            ? colors.backgroundLight
            : colors.brown
        }
      >
        {title}
      </Typography>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    height: 50,

    borderRadius: 14,

    backgroundColor: colors.backgroundLight,

    alignItems: 'center',
    justifyContent: 'center',
  },

  primary: {
    backgroundColor: colors.brown,
  },
});