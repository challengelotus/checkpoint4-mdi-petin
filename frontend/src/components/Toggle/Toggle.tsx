import { useEffect, useRef } from 'react';

import {
  Animated,
  Pressable,
  StyleSheet,
} from 'react-native';

import { colors } from '@/theme';

interface ToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

const LARGURA = 42;
const ALTURA = 22;
const PADDING = 3;
const THUMB = 16;
// Distância percorrida pela bolinha da esquerda para a direita
const DESLOCAMENTO = LARGURA - PADDING * 2 - THUMB;

export function Toggle({
  value,
  onChange,
}: ToggleProps) {
  // 0 = desligado, 1 = ligado (o valor inicial não anima)
  const progresso = useRef(
    new Animated.Value(value ? 1 : 0)
  ).current;

  useEffect(() => {
    Animated.spring(progresso, {
      toValue: value ? 1 : 0,
      friction: 7,
      tension: 140,
      // A cor do fundo é interpolada, o que exige o driver JS
      useNativeDriver: false,
    }).start();
  }, [value, progresso]);

  const backgroundColor = progresso.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.brownLight, colors.brown],
  });

  const translateX = progresso.interpolate({
    inputRange: [0, 1],
    outputRange: [0, DESLOCAMENTO],
  });

  return (
    <Pressable
      onPress={() => onChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      hitSlop={8}
    >
      <Animated.View
        style={[
          styles.container,
          { backgroundColor },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            { transform: [{ translateX }] },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: LARGURA,
    height: ALTURA,

    borderRadius: 12,

    padding: PADDING,

    justifyContent: 'center',
  },

  thumb: {
    width: THUMB,
    height: THUMB,

    borderRadius: THUMB / 2,

    backgroundColor: colors.backgroundLight,
  },
});