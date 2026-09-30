import {
  StyleSheet,
  View,
} from 'react-native';

import { colors } from '@/theme';
import { Typography } from '@/components/Typography/Typography';

interface DocumentCardProps {
  title: string;
  description: string;
}

export function DocumentCard({
  title,
  description,
}: DocumentCardProps) {
  return (
    <View style={styles.container}>
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

    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 1,
  },

  description: {
    marginTop: 5,
  },
});