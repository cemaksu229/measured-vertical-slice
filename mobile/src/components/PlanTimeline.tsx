import { Lock } from 'phosphor-react-native';
import { StyleSheet, View } from 'react-native';

import type { PlanHabit } from '@/logic/plan';
import { fontFamily } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { Card } from './Card';
import { HabitCard } from './HabitCard';
import { Body, Caption } from './Text';

type Props = {
  habits: PlanHabit[];
  /** When false, weeks 2-4 are dimmed behind a lock. */
  unlocked: boolean;
  /** Show only weeks 2-4 (used on Home). */
  futureOnly?: boolean;
};

export function PlanTimeline({ habits, unlocked, futureOnly = false }: Props) {
  const { colors, spacing, radii } = useTheme();
  const weeks = futureOnly ? [1, 2, 3] : [0, 1, 2, 3];

  return (
    <View style={{ gap: spacing.lg }}>
      {weeks.map((w) => {
        const open = w === 0 || unlocked;
        return (
          <View key={w}>
            <View style={[styles.header, { gap: spacing.sm, marginBottom: spacing.sm }]}>
              <View
                style={[
                  styles.pill,
                  { backgroundColor: open ? colors.accent : colors.border, borderRadius: radii.pill },
                ]}>
                <Caption
                  color={open ? colors.onAccent : colors.textMuted}
                  style={{ fontFamily: fontFamily.bodySemibold }}>
                  {`Week ${w + 1}`}
                </Caption>
              </View>
              {!open ? (
                <View style={[styles.header, { gap: spacing.xs }]}>
                  <Lock size={14} weight="bold" color={colors.textMuted} />
                  <Caption>Unlocks with Pro</Caption>
                </View>
              ) : null}
            </View>
            {open ? (
              <View style={{ gap: spacing.sm }}>
                {habits.map((h) => (
                  <HabitCard key={h.id} habit={h} note={w === 0 ? undefined : h.weeks[w]} />
                ))}
              </View>
            ) : (
              <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                <Card style={{ padding: spacing.md, gap: spacing.xs, opacity: 0.3 }}>
                  {habits.slice(0, 3).map((h) => (
                    <View key={h.id}>
                      <Body>{h.title}</Body>
                      <Caption>{h.weeks[w]}</Caption>
                    </View>
                  ))}
                </Card>
                <View style={[StyleSheet.absoluteFill, styles.lock]}>
                  <View
                    style={[styles.lockBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Lock size={24} weight="bold" color={colors.text} />
                  </View>
                </View>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center' },
  pill: { paddingHorizontal: 12, paddingVertical: 4 },
  lock: { alignItems: 'center', justifyContent: 'center' },
  lockBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
