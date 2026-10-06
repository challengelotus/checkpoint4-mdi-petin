import {
  StyleSheet,
  View,
} from 'react-native';

import { colors } from '@/theme';
import { Typography } from '@/components/Typography/Typography';

interface ProfileInfo {
  label: string;
  value: string;
}

interface ProfileInfoCardProps {
  data: ProfileInfo[];
}

export function ProfileInfoCard({
  data,
}: ProfileInfoCardProps) {
  return (
    <View style={styles.container}>
      {data.map((item, index) => (
        <View
          key={item.label}
          style={[
            styles.row,
            index !== data.length - 1 &&
              styles.border,
          ]}
        >
          <Typography
            variant="caption"
            color={colors.textSecondary}
          >
            {item.label}
          </Typography>

          <Typography
            variant="caption"
            color={colors.brown}
          >
            {item.value}
          </Typography>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,

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

  row: {
    minHeight: 46,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  border: {
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
});