import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { RangeBand } from '@/components/RangeBand';
import { Body, Caption, H2 } from '@/components/Text';
import { selection } from '@/lib/haptics';
import { stepRoute } from '@/onboarding/steps';
import { useCopy, usePrediction } from '@/store/selectors';
import { useAppStore, type Habits } from '@/store/useAppStore';
import { fontFamily } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

type Opt<T extends string> = { value: T; label: string };

// Local single-select row: unlike Segmented, it can show "nothing chosen yet".
function Choice<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly Opt<T>[];
  value: T | null;
  onChange: (v: T) => void;
}) {
  const { colors, spacing, radii } = useTheme();
  return (
    <View style={{ gap: spacing.sm }}>
      <Body style={{ fontFamily: fontFamily.bodyMedium }}>{label}</Body>
      <View
        accessibilityRole="radiogroup"
        style={[styles.track, { backgroundColor: colors.border, borderRadius: radii.md + 4 }]}>
        {options.map((o) => {
          const on = o.value === value;
          return (
            <Pressable
              key={o.value}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              onPress={() => {
                if (on) return;
                selection();
                onChange(o.value);
              }}
              style={[
                styles.item,
                { backgroundColor: on ? colors.surface : 'transparent', borderRadius: radii.md },
              ]}>
              <Body color={on ? colors.text : colors.textMuted} style={{ fontFamily: fontFamily.bodyMedium }}>
                {o.label}
              </Body>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function HabitsScreen() {
  const router = useRouter();
  const { spacing } = useTheme();
  const copy = useCopy();
  const prediction = usePrediction();
  const unit = useAppStore((s) => s.unit);
  const habits = useAppStore((s) => s.habits);
  const setHabits = useAppStore((s) => s.setHabits);
  const ready = habits.sleepHours !== null && habits.activity !== null && habits.diet !== null;

  return (
    <Screen edges={['bottom', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={{ gap: spacing.xl, paddingBottom: spacing.lg }}
        showsVerticalScrollIndicator={false}>
        <View style={{ gap: spacing.sm }}>
          <H2>{`Habits decide whether ${copy.isParent ? 'your child hits' : 'you hit'} the top or bottom of ${copy.isParent ? 'their' : 'your'} range.`}</H2>
          <Body muted>
            {`Habits can't change ${copy.isParent ? "your child's" : 'your'} genes, but sleep, food and movement help ${copy.isParent ? 'them' : 'you'} reach ${copy.isParent ? 'their' : 'your'} range.`}
          </Body>
        </View>
        {prediction ? (
          <View style={{ gap: spacing.sm }}>
            <Caption>Your range</Caption>
            <RangeBand
              lowCm={prediction.lowCm}
              highCm={prediction.highCm}
              predictedCm={prediction.predictedCm}
              unit={unit}
              delay={200}
            />
          </View>
        ) : null}
        <Choice<NonNullable<Habits['sleepHours']>>
          label="Sleep"
          value={habits.sleepHours}
          onChange={(sleepHours) => setHabits({ sleepHours })}
          options={[
            { value: '<7', label: '<7h' },
            { value: '7-8', label: '7–8h' },
            { value: '9+', label: '9h+' },
          ]}
        />
        <Choice<NonNullable<Habits['activity']>>
          label="Activity"
          value={habits.activity}
          onChange={(activity) => setHabits({ activity })}
          options={[
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
          ]}
        />
        <Choice<NonNullable<Habits['diet']>>
          label="Protein & dairy"
          value={habits.diet}
          onChange={(diet) => setHabits({ diet })}
          options={[
            { value: 'low', label: 'Rarely' },
            { value: 'ok', label: 'Some days' },
            { value: 'good', label: 'Most days' },
          ]}
        />
        {!ready ? <Caption>Answer all three to continue.</Caption> : null}
      </ScrollView>
      <PrimaryButton label="Show my plan" disabled={!ready} onPress={() => router.push(stepRoute('plan'))} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: 'row', padding: 4, minHeight: 48, gap: 2 },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 44 },
});
