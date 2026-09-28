import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { colors } from '@/theme';

interface ToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export function Toggle({
  value,
  onChange,
}: ToggleProps) {
  return (
    <Pressable
      onPress={() => onChange(!value)}
      style={[
        styles.container,
        value && styles.active,
      ]}
    >
      <View
        style={[
          styles.thumb,
          value && styles.thumbActive,
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 42,
    height: 22,

    borderRadius: 12,

    padding: 3,

    backgroundColor: colors.brownLight,

    justifyContent: 'center',
  },

  active: {
    backgroundColor: colors.brown,
  },

  thumb: {
    width: 16,
    height: 16,

    borderRadius: 8,

    backgroundColor: colors.backgroundLight,
  },

  thumbActive: {
    alignSelf: 'flex-end',
  },
});