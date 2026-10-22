import { useEffect } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import type { Unit } from '@/store/useAppStore';
import { fontFamily } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { cmToFtIn } from '@/logic/height';

import { Caption, H2 } from './Text';

type Props = {
  lowCm: number;
  highCm: number;
  predictedCm: number;
  unit: Unit;
  /** Milliseconds before the band wipes in. */
  delay?: number;
  style?: StyleProp<ViewStyle>;
};

function edge(cm: number, unit: Unit): string {
  if (unit === 'metric') return String(Math.round(cm));
  const { ft, inches } = cmToFtIn(cm);
  return `${ft}'${inches}"`;
}

/** Accent band showing the low to high range, with a marker where the prediction sits inside it. */
export function RangeBand({ lowCm, highCm, predictedCm, unit, delay = 0, style }: Props) {
  const { colors, radii } = useTheme();
  const reduced = useReducedMotion();
  const reveal = useSharedValue(reduced ? 1 : 0);

  useEffect(() => {
    if (reduced) return;
    reveal.set(withDelay(delay, withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) })));
  }, [delay, reduced, reveal]);

  const wipe = useAnimatedStyle(() => ({
    opacity: reveal.get(),
    transform: [{ scaleX: 0.2 + 0.8 * reveal.get() }],
  }));

  const span = Math.max(highCm - lowCm, 1);
  const fraction = Math.min(Math.max((predictedCm - lowCm) / span, 0), 1);
  const text = `${edge(lowCm, unit)} – ${edge(highCm, unit)}${unit === 'metric' ? ' cm' : ''}`;

  return (
    <View
      style={[styles.wrap, style]}
      accessible
      accessibilityLabel={`Likely range ${text}`}>
      <Animated.View
        style={[styles.band, { backgroundColor: colors.accent, borderRadius: radii.pill }, wipe]}>
        <H2 color={colors.onAccent} style={styles.text}>
          {text}
        </H2>
      </Animated.View>
      <View style={styles.markerTrack}>
        <View style={[styles.marker, { left: `${fraction * 100}%`, backgroundColor: colors.brand }]} />
        <Caption align="center" style={[styles.markerLabel, { left: `${fraction * 100}%` }]}>
          Most likely
        </Caption>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'stretch' },
  band: { height: 56, alignItems: 'center', justifyContent: 'center' },
  text: { fontFamily: fontFamily.displaySemibold, fontVariant: ['tabular-nums'] },
  markerTrack: { height: 40, marginHorizontal: 40 },
  marker: {
    position: 'absolute',
    top: 4,
    width: 10,
    height: 10,
    marginLeft: -5,
    borderRadius: 5,
  },
  markerLabel: { position: 'absolute', top: 18, width: 96, marginLeft: -48 },
});
