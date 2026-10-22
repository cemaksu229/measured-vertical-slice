import { router } from 'expo-router';
import { CheckCircle } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { CountUpNumber } from '@/components/CountUpNumber';
import { Screen } from '@/components/Screen';
import { Body, H2 } from '@/components/Text';
import { success } from '@/lib/haptics';
import { formatHeight } from '@/logic/height';
import { getNextStep, stepRoute } from '@/onboarding/steps';
import { useAppStore } from '@/store/useAppStore';
import { useTheme } from '@/theme/useTheme';

const TOTAL_MS = 2500;
const TICKS = 41;

function FillTick({
  index,
  progress,
  activeColor,
  idleColor,
}: {
  index: number;
  progress: SharedValue<number>;
  activeColor: string;
  idleColor: string;
}) {
  const major = index % 5 === 0;
  const style = useAnimatedStyle(() => {
    const on = progress.get() * (TICKS - 1) >= index;
    return {
      backgroundColor: on ? activeColor : idleColor,
      transform: [{ scaleY: on ? 1 : 0.75 }],
    };
  });
  return <Animated.View style={[styles.tick, { height: major ? 56 : 36 }, style]} />;
}

function Line({ text, done, index }: { text: string; done: boolean; index: number }) {
  const { colors } = useTheme();
  return (
    <Animated.View entering={FadeInDown.delay(200 + index * 120).duration(400)} style={styles.line}>
      {done ? (
        <CheckCircle size={26} weight="fill" color={colors.brand} />
      ) : (
        <View style={[styles.pending, { borderColor: colors.border }]} />
      )}
      <Body muted={!done} style={styles.lineText}>
        {text}
      </Body>
    </Animated.View>
  );
}

export default function BuildingScreen() {
  const { colors } = useTheme();
  const unit = useAppStore((s) => s.unit);
  const profile = useAppStore((s) => s.profile);
  const [done, setDone] = useState(0);
  const progress = useSharedValue(0);

  const mom = profile.motherHeightCm === null ? 'unknown' : formatHeight(profile.motherHeightCm, unit);
  const dad = profile.fatherHeightCm === null ? 'unknown' : formatHeight(profile.fatherHeightCm, unit);
  const lines = [
    `Reading Mom ${mom} and Dad ${dad}`,
    'Applying the mid-parental method',
    `Adjusting for age ${profile.ageYears}`,
  ];

  useEffect(() => {
    progress.set(withTiming(1, { duration: TOTAL_MS - 200, easing: Easing.inOut(Easing.quad) }));
    const timers = [
      setTimeout(() => setDone(1), 750),
      setTimeout(() => setDone(2), 1450),
      setTimeout(() => setDone(3), 2150),
      setTimeout(() => {
        success();
        // Replace so Back from Reveal skips this loader.
        router.replace(stepRoute(getNextStep('building')!));
      }, TOTAL_MS),
    ];
    return () => timers.forEach(clearTimeout);
  }, [progress]);

  return (
    <Screen edges={['bottom', 'left', 'right']} style={styles.screen}>
      <View style={styles.top}>
        <View style={styles.percentRow}>
          <CountUpNumber value={100} duration={TOTAL_MS - 200} style={styles.percent} />
          <H2 muted>%</H2>
        </View>
        <H2>Building your prediction</H2>
      </View>

      <View style={styles.rulerRow} accessibilityElementsHidden importantForAccessibility="no">
        {Array.from({ length: TICKS }, (_, i) => (
          <FillTick
            key={i}
            index={i}
            progress={progress}
            activeColor={colors.brand}
            idleColor={colors.border}
          />
        ))}
      </View>

      <View style={styles.lines}>
        {lines.map((text, i) => (
          <Line key={text} text={text} done={done > i} index={i} />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { justifyContent: 'center', gap: 40 },
  top: { alignItems: 'center', gap: 8 },
  percentRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  percent: { fontSize: 96, lineHeight: 100 },
  rulerRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 60 },
  tick: { width: 3, borderRadius: 2, transformOrigin: 'bottom' },
  lines: { gap: 16 },
  line: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  lineText: { flex: 1 },
  pending: { width: 26, height: 26, borderRadius: 13, borderWidth: 2 },
});
