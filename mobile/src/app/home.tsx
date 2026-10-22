import { useRouter } from 'expo-router';
import { CaretRight, CheckCircle, Lock } from 'phosphor-react-native';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Card } from '@/components/Card';
import { HabitIcon } from '@/components/HabitCard';
import { PlanTimeline } from '@/components/PlanTimeline';
import { PressableScale } from '@/components/PressableScale';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { Body, Caption, H1, H2 } from '@/components/Text';
import { TextButton } from '@/components/TextButton';
import { success } from '@/lib/haptics';
import { formatHeight } from '@/logic/height';
import { useCopy, usePlan, usePrediction } from '@/store/selectors';
import { useAppStore } from '@/store/useAppStore';
import { fontFamily } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export default function HomeScreen() {
  const router = useRouter();
  const { colors, spacing } = useTheme();
  const copy = useCopy();
  const prediction = usePrediction();
  const plan = usePlan();
  const unit = useAppStore((s) => s.unit);
  const isPro = useAppStore((s) => s.isPro);
  const done = useAppStore((s) => s.completedHabitIds);
  const toggleHabit = useAppStore((s) => s.toggleHabit);
  const resetAll = useAppStore((s) => s.resetAll);

  const habits = plan?.habits ?? [];
  const doneCount = habits.filter((h) => done.includes(h.id)).length;

  return (
    <Screen edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={{ gap: spacing.lg, paddingBottom: spacing.lg }}
        showsVerticalScrollIndicator={false}>
        {prediction ? (
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel="Open your prediction"
            onPress={() => router.push('/onboarding/reveal?from=home')}>
            <Card highlighted style={styles.predRow}>
              <View style={styles.flex}>
                <Caption>{copy.isParent ? "Your child's predicted height" : 'Your predicted height'}</Caption>
                <H1>{formatHeight(prediction.predictedCm, unit)}</H1>
                <Body muted>{`${formatHeight(prediction.lowCm, unit)} – ${formatHeight(prediction.highCm, unit)}`}</Body>
              </View>
              <CaretRight size={24} weight="bold" color={colors.textMuted} />
            </Card>
          </PressableScale>
        ) : null}

        <View style={{ gap: spacing.sm }}>
          <View style={styles.between}>
            <H2>Tonight&apos;s plan</H2>
            <Caption>{`${doneCount} of ${habits.length} done`}</Caption>
          </View>
          {doneCount === 0 ? <Caption>Nothing checked yet. Start with the easiest one.</Caption> : null}
          {habits.map((h) => {
            const on = done.includes(h.id);
            return (
              <PressableScale
                key={h.id}
                accessibilityRole="checkbox"
                accessibilityLabel={h.title}
                accessibilityState={{ checked: on }}
                onPress={() => {
                  if (!on) success();
                  toggleHabit(h.id);
                }}>
                <Card style={[styles.habitRow, { padding: spacing.md, gap: spacing.md }]}>
                  <HabitIcon name={h.icon} color={on ? colors.textMuted : colors.brand} />
                  <View style={styles.flex}>
                    <Body
                      style={{
                        fontFamily: fontFamily.bodySemibold,
                        textDecorationLine: on ? 'line-through' : 'none',
                      }}
                      color={on ? colors.textMuted : colors.text}>
                      {h.title}
                    </Body>
                    <Caption>{h.dailyTarget}</Caption>
                  </View>
                  {on ? (
                    <CheckCircle size={28} weight="fill" color={colors.brand} />
                  ) : (
                    <View style={[styles.empty, { borderColor: colors.border }]} />
                  )}
                </Card>
              </PressableScale>
            );
          })}
        </View>

        {plan ? (
          isPro ? (
            <View style={{ gap: spacing.sm }}>
              <H2>Weeks 2 to 4</H2>
              <PlanTimeline habits={plan.habits} unlocked futureOnly />
            </View>
          ) : (
            <Card style={{ gap: spacing.md }}>
              <View style={[styles.habitRow, { gap: spacing.sm }]}>
                <Lock size={22} weight="bold" color={colors.textMuted} />
                <H2>Weeks 2 to 4</H2>
              </View>
              <Body muted>Unlocks with Pro. Your week 1 plan stays free.</Body>
              <PrimaryButton label="See Pro" onPress={() => router.push('/onboarding/paywall?from=home')} />
            </Card>
          )
        ) : null}

        <TextButton
          label="Reset demo"
          onPress={() => {
            resetAll();
            router.replace('/');
          }}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  empty: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, margin: 1 },
  predRow: { flexDirection: 'row', alignItems: 'center' },
  between: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  habitRow: { flexDirection: 'row', alignItems: 'center' },
});
