import {
  StyleSheet,
  View,
} from 'react-native';

import { colors } from '@/theme';
import { Typography } from '@/components/Typography/Typography';

interface WeightChartProps {
  values: number[];
}

export function WeightChart({
  values,
}: WeightChartProps) {
  const max = Math.max(...values);

  return (
    <View style={styles.container}>
      <Typography
        variant="captionMedium"
        color={colors.brown}
      >
        Evolução de peso
      </Typography>

      <View style={styles.chart}>
        {values.map((value, index) => {
          const height = Math.max(
            30,
            (value / max) * 100,
          );

          return (
            <View
              key={index}
              style={[
                styles.bar,
                {
                  height,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 28,

    padding: 18,

    borderRadius: 16,

    backgroundColor: colors.backgroundLight,
  },

  chart: {
    height: 120,

    marginTop: 18,

    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },

  bar: {
    width: 55,

    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,

    backgroundColor: colors.primary,
  },
});