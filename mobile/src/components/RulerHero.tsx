import { useEffect } from 'react';
import { StyleSheet, Text, useWindowDimensions, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { fontFamily } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { CountUpNumber } from './CountUpNumber';
import { Caption, H2 } from './Text';

// A fixed sample, labelled as such: ticks rise, the number counts, the lemon band lights up.
const SCALE_MIN = 150;
const SCALE_MAX = 200;
const SAMPLE = 178;
const BAND_LOW = 170;
const BAND_HIGH = 187;
const COLUMN_W = 96;

const pct = (cm: number) => ((cm - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100;

function Tick({ cm, index, color }: { cm: number; index: number; color: string }) {
  const reduced = useReducedMotion();
  const p = useSharedValue(reduced ? 1 : 0);
  const major = cm % 10 === 0;
  const mid = cm % 5 === 0;

  useEffect(() => {
    if (reduced) return;
    p.set(withDelay(150 + index * 22, withTiming(1, { duration: 320, easing: Easing.out(Easing.cubic) })));
  }, [index, reduced, p]);

  const style = useAnimatedStyle(() => ({
    opacity: p.get() * (major ? 1 : mid ? 0.7 : 0.45),
    transform: [{ scaleX: p.get() }],
  }));

  return (
    <Animated.View
      style={[
        styles.tick,
        {
          top: `${100 - pct(cm)}%`,
          width: major ? 44 : mid ? 30 : 18,
          backgroundColor: color,
          transformOrigin: 'right',
        },
        style,
      ]}
    />
  );
}

type Props = { style?: StyleProp<ViewStyle> };

export function RulerHero({ style }: Props) {
  const { colors, radii } = useTheme();
  const reduced = useReducedMotion();
  const { width } = useWindowDimensions();
  const big = width < 380 ? 76 : 96;
  const band = useSharedValue(reduced ? 1 : 0);
  const marker = useSharedValue(reduced ? 1 : 0);
  const chip = useSharedValue(reduced ? 1 : 0);

  useEffect(() => {
    if (reduced) return;
    band.set(withDelay(1300, withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) })));
    marker.set(withDelay(1750, withTiming(1, { duration: 350 })));
    chip.set(withDelay(1800, withTiming(1, { duration: 400 })));
  }, [reduced, band, marker, chip]);

  const bandStyle = useAnimatedStyle(() => ({ transform: [{ scaleY: band.get() }] }));
  const markerStyle = useAnimatedStyle(() => ({
    opacity: marker.get(),
    transform: [{ translateX: (1 - marker.get()) * 16 }],
  }));
  const chipStyle = useAnimatedStyle(() => ({
    opacity: chip.get(),
    transform: [{ translateY: (1 - chip.get()) * 8 }],
  }));

  const ticks = [];
  for (let cm = SCALE_MIN; cm <= SCALE_MAX; cm++) {
    ticks.push(<Tick key={cm} cm={cm} index={cm - SCALE_MIN} color={colors.textMuted} />);
  }
  const labels = [];
  for (let cm = SCALE_MIN; cm <= SCALE_MAX; cm += 10) {
    labels.push(
      <Text
        key={cm}
        style={[styles.label, { color: colors.textMuted, top: `${100 - pct(cm)}%` }]}>
        {cm}
      </Text>,
    );
  }

  return (
    <View
      style={[styles.root, style]}
      accessible
      accessibilityLabel="Sample result: 178 centimetres, likely range 170 to 187 centimetres">
      <View style={styles.left}>
        <Caption>Sample result</Caption>
        <View style={styles.numberRow}>
          <CountUpNumber
            from={SCALE_MIN}
            value={SAMPLE}
            delay={450}
            duration={1500}
            fit
            style={[styles.number, { fontSize: big, lineHeight: big + 4 }]}
          />
          <H2 muted>cm</H2>
        </View>
        <Animated.View
          style={[styles.chip, { backgroundColor: colors.accent, borderRadius: radii.pill }, chipStyle]}>
          <Text style={[styles.chipText, { color: colors.onAccent }]}>
            {BAND_LOW} {'–'} {BAND_HIGH} cm
          </Text>
        </Animated.View>
      </View>

      <View style={styles.column}>
        <Animated.View
          style={[
            styles.band,
            {
              backgroundColor: colors.accent,
              top: `${100 - pct(BAND_HIGH)}%`,
              bottom: `${pct(BAND_LOW)}%`,
              transformOrigin: 'bottom',
            },
            bandStyle,
          ]}
        />
        {ticks}
        {labels}
        <Animated.View
          style={[
            styles.marker,
            { backgroundColor: colors.brand, top: `${100 - pct(SAMPLE)}%` },
            markerStyle,
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flexDirection: 'row', alignItems: 'stretch' },
  left: { flex: 1, justifyContent: 'center', gap: 4, paddingRight: 8 },
  numberRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, flexShrink: 1 },
  number: { flexShrink: 1 },

  chip: { alignSelf: 'flex-start', paddingHorizontal: 16, height: 40, justifyContent: 'center', marginTop: 12 },
  chipText: { fontFamily: fontFamily.bodySemibold, fontSize: 17, lineHeight: 20 },
  column: { width: COLUMN_W, marginVertical: 12 },
  tick: { position: 'absolute', right: 0, height: 2, marginTop: -1, borderRadius: 1 },
  label: {
    position: 'absolute',
    right: 52,
    height: 18,
    marginTop: -9,
    fontFamily: fontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
  },
  band: { position: 'absolute', left: 0, right: 0, opacity: 0.9, borderRadius: 4 },
  marker: { position: 'absolute', left: 0, right: 0, height: 4, marginTop: -2, borderRadius: 2 },
});
