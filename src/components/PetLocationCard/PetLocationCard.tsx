import {
  StyleSheet,
  View,
} from 'react-native';

import { colors } from '@/theme';
import { Typography } from '@/components/Typography/Typography';

interface PetLocationCardProps {
  title: string;
  description: string;
  safe?: boolean;
}

export function PetLocationCard({
  title,
  description,
  safe = true,
}: PetLocationCardProps) {
  return (
    <View
      style={[
        styles.container,
        safe && styles.safe,
      ]}
    >
      <Typography
        variant="bodyMedium"
        color={colors.brown}
      >
        {title}
      </Typography>

      <Typography
        variant="caption"
        color={colors.textSecondary}
        style={styles.description}
      >
        {description}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 17,

    borderRadius: 16,

    backgroundColor: colors.backgroundLight,
  },

  safe: {
    borderLeftWidth: 8,
    borderLeftColor: colors.success,
  },

  description: {
    marginTop: 4,
  },
});