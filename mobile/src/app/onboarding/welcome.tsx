import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Chip } from '@/components/Chip';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { Body, H2 } from '@/components/Text';
import { success } from '@/lib/haptics';
import { useAppStore } from '@/store/useAppStore';
import { useTheme } from '@/theme/useTheme';

const TICKS = 31;

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors, spacing, radii } = useTheme();
  const setPro = useAppStore((s) => s.setPro);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const fill = useSharedValue(0);

  useEffect(() => {
    setPro(true);
    completeOnboarding();
    success();
    fill.set(withTiming(1, { duration: 1200, easing: Easing.out(Easing.cubic) }));
  }, [setPro, completeOnboarding, fill]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${fill.value * 100}%` }));

  return (
    <Screen edges={['top', 'bottom', 'left', 'right']}>
      <View style={{ flex: 1, justifyContent: 'center', gap: spacing.xl }}>
        <View
          accessibilityElementsHidden
          style={[styles.ruler, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.md }]}>
          <Animated.View style={[styles.fill, { backgroundColor: colors.accent }, fillStyle]} />
          <View style={styles.ticks}>
            {Array.from({ length: TICKS }, (_, i) => (
              <View
                key={i}
                style={{
                  width: 2,
                  height: i % 5 === 0 ? 28 : 16,
                  backgroundColor: colors.text,
                  opacity: 0.7,
                }}
              />
            ))}
          </View>
        </View>
        <View style={{ gap: spacing.sm }}>
          <H2>Welcome to Measured Pro</H2>
          <Body muted>Your full plan is unlocked. Week 1 starts tonight.</Body>
          <Chip label="Demo: no payment was taken" />
        </View>
      </View>
      <PrimaryButton label="Start week 1" onPress={() => router.replace('/home')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  ruler: { height: 72, borderWidth: 1, overflow: 'hidden', justifyContent: 'flex-end' },
  fill: { position: 'absolute', top: 0, bottom: 0, left: 0 },
  ticks: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12 },
});
