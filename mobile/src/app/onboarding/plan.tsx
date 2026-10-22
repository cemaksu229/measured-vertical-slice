import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native';

import { PlanTimeline } from '@/components/PlanTimeline';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { Body, Caption, H2 } from '@/components/Text';
import { stepRoute } from '@/onboarding/steps';
import { usePlan } from '@/store/selectors';
import { useTheme } from '@/theme/useTheme';

export default function PlanScreen() {
  const router = useRouter();
  const { spacing } = useTheme();
  const plan = usePlan();

  return (
    <Screen edges={['bottom', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={{ gap: spacing.lg, paddingBottom: spacing.lg }}
        showsVerticalScrollIndicator={false}>
        {plan ? (
          <>
            <H2>{plan.headline}</H2>
            <Body muted>{plan.summary}</Body>
            <PlanTimeline habits={plan.habits} unlocked={false} />
            <Caption>{plan.disclaimer}</Caption>
          </>
        ) : (
          <H2>Answer the earlier questions to build your plan.</H2>
        )}
      </ScrollView>
      <PrimaryButton label="Keep me on track" onPress={() => router.push(stepRoute('priming'))} />
    </Screen>
  );
}
