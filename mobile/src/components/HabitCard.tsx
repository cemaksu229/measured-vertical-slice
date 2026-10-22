import * as Phosphor from 'phosphor-react-native';
import type { Icon } from 'phosphor-react-native';
import { StyleSheet, View } from 'react-native';

import type { Habit } from '@/logic/plan';
import { fontFamily } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { Card } from './Card';
import { Body, Caption } from './Text';

const icons = Phosphor as unknown as Record<string, Icon | undefined>;

/** Renders a Phosphor icon by name, with a safe fallback. */
export function HabitIcon({ name, size = 24, color }: { name: string; size?: number; color: string }) {
  const Component = icons[name] ?? Phosphor.Sparkle;
  return <Component size={size} weight="bold" color={color} />;
}

type Props = {
  habit: Habit;
  /** Optional line shown instead of "why" (e.g. a week's step). */
  note?: string;
};

export function HabitCard({ habit, note }: Props) {
  const { colors, spacing, radii } = useTheme();
  return (
    <Card style={{ padding: spacing.md }}>
      <View style={[styles.row, { gap: spacing.md }]}>
        <View style={[styles.badge, { backgroundColor: colors.accent, borderRadius: radii.md }]}>
          <HabitIcon name={habit.icon} color={colors.onAccent} />
        </View>
        <View style={styles.flex}>
          <Body style={{ fontFamily: fontFamily.bodySemibold }}>{habit.title}</Body>
          <Caption color={colors.brand}>{habit.dailyTarget}</Caption>
          <Caption style={{ marginTop: spacing.xs }}>{note ?? habit.why}</Caption>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  flex: { flex: 1 },
  badge: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});
