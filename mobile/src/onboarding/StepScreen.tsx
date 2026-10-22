import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { useTheme } from '@/theme/useTheme';

import { getNextStep, stepRoute, type OnboardingStep } from './steps';

type Props = {
  step: OnboardingStep;
  buttonLabel: string;
  onContinue?: () => void;
  children?: ReactNode;
};

// Placeholder scaffold; each screen is replaced by its Figma design.
export function StepScreen({ step, buttonLabel, onContinue, children }: Props) {
  const router = useRouter();
  const { colors, typeScale } = useTheme();

  const handlePress = () => {
    onContinue?.();
    const next = getNextStep(step);
    if (next) router.push(stepRoute(next));
  };

  return (
    <Screen edges={['bottom', 'left', 'right']}>
      <View style={styles.body}>
        <Text style={[typeScale.h1, { color: colors.text }]}>{step}</Text>
        {children}
      </View>
      <PrimaryButton label={buttonLabel} onPress={handlePress} />
    </Screen>
  );
}

const styles = StyleSheet.create({ body: { flex: 1, justifyContent: 'center' } });
