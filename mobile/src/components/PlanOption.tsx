import { StyleSheet, View } from 'react-native';

import { selection } from '@/lib/haptics';
import { fontFamily } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { PressableScale } from './PressableScale';
import { Body, Caption, H2 } from './Text';

type Props = {
  title: string;
  /** Full billed amount, shown as the largest price text. */
  price: string;
  detail: string;
  badge?: string;
  selected: boolean;
  onPress: () => void;
};

export function PlanOption({ title, price, detail, badge, selected, onPress }: Props) {
  const { colors, spacing, radii } = useTheme();
  return (
    <PressableScale
      accessibilityRole="radio"
      accessibilityLabel={`${title}, ${price}, ${detail}`}
      accessibilityState={{ selected }}
      onPress={() => {
        selection();
        onPress();
      }}
      style={[
        styles.row,
        {
          backgroundColor: colors.surface,
          borderRadius: radii.lg,
          borderColor: selected ? colors.brand : colors.border,
          padding: spacing.md,
          gap: spacing.xs,
        },
      ]}>
      <View style={[styles.topRow, { gap: spacing.md }]}>
        <View
          style={[
            styles.dot,
            {
              borderColor: selected ? colors.brand : colors.border,
              backgroundColor: selected ? colors.brand : 'transparent',
            },
          ]}
        />
        <View style={[styles.titleRow, styles.flex, { gap: spacing.sm }]}>
          <Body style={{ fontFamily: fontFamily.bodySemibold }}>{title}</Body>
          {badge ? (
            <View style={[styles.badge, { backgroundColor: colors.accent, borderRadius: radii.pill }]}>
              <Caption color={colors.onAccent} style={{ fontFamily: fontFamily.bodySemibold }}>
                {badge}
              </Caption>
            </View>
          ) : null}
        </View>
        <H2>{price}</H2>
      </View>
      <Caption style={{ marginLeft: 20 + spacing.md }}>{detail}</Caption>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: { borderWidth: 2, minHeight: 72, justifyContent: 'center' },
  topRow: { flexDirection: 'row', alignItems: 'center' },
  flex: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  badge: { paddingHorizontal: 8, paddingVertical: 2 },
  dot: { width: 20, height: 20, borderRadius: 10, borderWidth: 2 },
});
