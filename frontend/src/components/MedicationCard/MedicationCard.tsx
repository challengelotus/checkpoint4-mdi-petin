import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { colors } from '@/theme';
import { Typography } from '@/components/Typography/Typography';

interface MedicationCardProps {
  name: string;
  dosage: string;
  frequency: string;
  onDelete?: () => void;
}

export function MedicationCard({
  name,
  dosage,
  frequency,
  onDelete,
}: MedicationCardProps) {
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
          style={styles.description}
        >
          {dosage} - {frequency}
        </Typography>
      </View>

      <Pressable
        onPress={onDelete}
        style={styles.deleteButton}
      >
        <Typography
          variant="h4"
          color={colors.brown}
        >
          ×
        </Typography>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 74,

    paddingHorizontal: 20,
    paddingVertical: 14,

    borderRadius: 14,

    backgroundColor: colors.backgroundLight,

    flexDirection: 'row',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,

    elevation: 1,
  },

  info: {
    flex: 1,
  },

  description: {
    marginTop: 4,
  },

  deleteButton: {
    width: 28,
    height: 28,

    alignItems: 'center',
    justifyContent: 'center',
  },
});