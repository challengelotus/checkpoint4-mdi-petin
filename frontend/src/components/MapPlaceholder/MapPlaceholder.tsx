import {
  StyleSheet,
  View,
} from 'react-native';

import { colors } from '@/theme';
import { Typography } from '@/components/Typography/Typography';

interface MapPlaceholderProps {
  pet?: boolean;
}

export function MapPlaceholder({
  pet = false,
}: MapPlaceholderProps) {
  return (
    <View style={styles.container}>
      {!pet && (
        <>
          <View
            style={[
              styles.marker,
              styles.markerOne,
            ]}
          />

          <View
            style={[
              styles.marker,
              styles.markerTwo,
            ]}
          />

          <View
            style={[
              styles.marker,
              styles.markerThree,
            ]}
          />

          <View
            style={[
              styles.marker,
              styles.markerFour,
            ]}
          />

          <View style={styles.currentLocation}>
            <View style={styles.currentDot} />
          </View>
        </>
      )}

      {pet && (
        <View style={styles.petMarker}>
          <Typography
            variant="body"
            color={colors.backgroundLight}
          >
            🐾
          </Typography>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 220,

    borderRadius: 26,

    backgroundColor: '#EDE1CC',

    position: 'relative',
    overflow: 'hidden',
  },

  marker: {
    position: 'absolute',

    width: 11,
    height: 11,

    borderRadius: 6,

    backgroundColor: colors.primary,
  },

  markerOne: {
    top: 36,
    left: 55,
  },

  markerTwo: {
    top: 50,
    right: 80,
  },

  markerThree: {
    top: 128,
    right: 54,
  },

  markerFour: {
    bottom: 40,
    left: 80,
  },

  currentLocation: {
    position: 'absolute',

    top: '45%',
    left: '50%',

    width: 26,
    height: 26,

    borderRadius: 13,

    backgroundColor: '#D4C6AF',

    alignItems: 'center',
    justifyContent: 'center',
  },

  currentDot: {
    width: 13,
    height: 13,

    borderRadius: 7,

    backgroundColor: colors.brown,
  },

  petMarker: {
    position: 'absolute',

    top: '43%',
    left: '44%',

    width: 64,
    height: 64,

    borderRadius: 32,

    backgroundColor: '#E9C9A9',

    alignItems: 'center',
    justifyContent: 'center',
  },
});