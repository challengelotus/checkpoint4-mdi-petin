import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { colors } from '@/theme';
import { Typography } from '@/components/Typography/Typography';

interface VetCardProps {
  name: string;
  description: string;
  onRoute: () => void;
}

export function VetCard({
  name,
  description,
  onRoute,
}: VetCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Typography
          variant="bodyMedium"
          color={colors.brown}
        >
          {name}
        </Typography>

        <Typography
          variant="caption"
          color={colors.textSecondary}
        >
          {description}
        </Typography>
      </View>

      <Pressable
        onPress={onRoute}
        style={styles.button}
      >
        <Typography
          variant="captionMedium"
          color={colors.backgroundLight}
        >
          Ver rota
        </Typography>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 80,

    paddingHorizontal: 16,
    paddingVertical: 14,

    borderRadius: 16,

    backgroundColor: colors.backgroundLight,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  info: {
    flex: 1,
  },

  button: {
    paddingHorizontal: 13,
    paddingVertical: 7,

    borderRadius: 18,

    backgroundColor: colors.primary,
  },
});