import { StyleSheet } from 'react-native';

import { selection } from '@/lib/haptics';
import { fontFamily } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { PressableScale } from './PressableScale';
import { Caption } from './Text';

type Props = {
  label: string;
  selected?: boolean;
  /** Without onPress the chip is a static label. */
  onPress?: () => void;
};

export function Chip({ label, selected = false, onPress }: Props) {
  const { colors, spacing, radii } = useTheme();
  return (
    <PressableScale
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      disabled={!onPress}
      onPress={() => {
        selection();
        onPress?.();
      }}
      style={[
        styles.base,
        {
          backgroundColor: selected ? colors.accent : colors.surface,
          borderColor: selected ? colors.accent : colors.border,
          borderRadius: radii.pill,
          paddingHorizontal: spacing.md,
        },
      ]}>
      <Caption color={selected ? colors.onAccent : colors.text} style={styles.label}>
        {label}
      </Caption>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 32,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  label: { fontFamily: fontFamily.bodyMedium },
});
