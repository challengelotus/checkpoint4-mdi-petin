import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import {
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import { colors } from '@/theme';
import { Typography } from '@/components/Typography/Typography';

interface DateFieldProps {
  label: string;
  value: string;
  onPress?: () => void;
}

export function DateField({
  label,
  value,
  onPress,
}: DateFieldProps) {
  return (
    <View style={styles.container}>
      <Typography
        variant="caption"
        color={colors.textSecondary}
      >
        {label}
      </Typography>

      <Pressable
        onPress={onPress}
        style={styles.field}
      >
        <Typography
          variant="body"
          color={colors.brown}
        >
          {value}
        </Typography>

        <MaterialCommunityIcons
          name="calendar-plus"
          size={20}
          color={colors.brown}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  field: {
    minHeight: 42,

    marginTop: 4,

    borderBottomWidth: 1.5,
    borderBottomColor: colors.orange,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});