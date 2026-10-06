import {
  Image,
  StyleSheet,
  View,
} from 'react-native';

import { colors } from '@/theme';
import { Typography } from '@/components/Typography/Typography';
import { iniciais } from '@/utils/date';

interface AvatarProps {
  /** URL remota ou uri local (pré-visualização). */
  uri?: string | null;
  /** Usado para gerar as iniciais quando não há foto. */
  nome?: string;
  size?: number;
}

export function Avatar({
  uri,
  nome,
  size = 60,
}: AvatarProps) {
  const circulo = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.image, circulo]}
      />
    );
  }

  return (
    <View style={[styles.fallback, circulo]}>
      <Typography
        variant={size >= 80 ? 'h2' : 'h3'}
        color={colors.brown}
      >
        {iniciais(nome)}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.orange,
  },

  fallback: {
    backgroundColor: colors.orange,

    alignItems: 'center',
    justifyContent: 'center',
  },
});
