import { router } from 'expo-router';
import { Ruler, TrendUp, UsersThree } from 'phosphor-react-native';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { OptionRow } from '@/components/OptionRow';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { H2 } from '@/components/Text';
import { getNextStep, stepRoute } from '@/onboarding/steps';
import { useAppStore, type Goal } from '@/store/useAppStore';

const OPTIONS: readonly { value: Goal; label: string; icon: typeof Ruler }[] = [
  { value: 'know-final-height', label: 'I want to know my final height', icon: Ruler },
  { value: 'reach-potential', label: 'I want to reach my full potential', icon: TrendUp },
  { value: 'track-child', label: "I'm checking for my child", icon: UsersThree },
];

export default function GoalScreen() {
  const goal = useAppStore((s) => s.goal);
  const setGoal = useAppStore((s) => s.setGoal);

  return (
    <Screen edges={['bottom', 'left', 'right']}>
      <Animated.View entering={FadeInDown.duration(400)}>
        <H2>What brings you here?</H2>
      </Animated.View>

      <View style={styles.options} accessibilityRole="radiogroup">
        {OPTIONS.map((o, i) => (
          <Animated.View key={o.value} entering={FadeInDown.delay(120 + i * 90).duration(400)}>
            <OptionRow
              label={o.label}
              icon={o.icon}
              selected={goal === o.value}
              onPress={() => setGoal(o.value)}
            />
          </Animated.View>
        ))}
      </View>

      <PrimaryButton
        label="Continue"
        disabled={goal === null}
        onPress={() => router.push(stepRoute(getNextStep('goal')!))}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  options: { flex: 1, gap: 12, marginTop: 24 },
});
