import { useEffect, useState } from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import {
  Easing,
  useAnimatedReaction,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { motion } from '@/theme/tokens';

import { Display } from './Text';

type Props = {
  value: number;
  from?: number;
  /** Milliseconds. Defaults to the countUp motion token. */
  duration?: number;
  delay?: number;
  /** Receives the rounded in-flight value. */
  format?: (n: number) => string;
  color?: string;
  style?: StyleProp<TextStyle>;
  /** Shrink to fit the available width (native; web relies on an explicit font size). */
  fit?: boolean;
};

const defaultFormat = (n: number) => String(n);

/** Counts from `from` to `value` on mount and whenever `value` changes. */
export function CountUpNumber({
  value,
  from = 0,
  duration = motion.countUp,
  delay = 0,
  format = defaultFormat,
  color,
  style,
  fit = false,
}: Props) {
  const reduced = useReducedMotion();
  const progress = useSharedValue(reduced ? value : from);
  const [shown, setShown] = useState(reduced ? value : from);

  useEffect(() => {
    if (reduced) {
      progress.set(value);
      return;
    }
    progress.set(
      withDelay(delay, withTiming(value, { duration, easing: Easing.out(Easing.cubic) })),
    );
  }, [value, delay, duration, reduced, progress]);

  useAnimatedReaction(
    () => Math.round(progress.get()),
    (current, previous) => {
      if (current !== previous) scheduleOnRN(setShown, current);
    },
  );

  return (
    <Display
      color={color}
      numberOfLines={1}
      adjustsFontSizeToFit={fit}
      minimumFontScale={fit ? 0.6 : undefined}
      style={[{ fontVariant: ['tabular-nums'] }, style]}
      accessibilityLabel={format(value)}>
      {format(shown)}
    </Display>
  );
}
