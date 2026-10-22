import type { Icon } from 'phosphor-react-native';
import { StyleSheet, View } from 'react-native';

import { selection } from '@/lib/haptics';
import { useTheme } from '@/theme/useTheme';

import { PressableScale } from './PressableScale';
import { Body } from './Text';

type Props = {
  label: string;
  icon?: Icon;
  selected: boolean;
  onPress: () => void;
};

export function OptionRow({ label, icon: IconComponent, selected, onPress }: Props) {
  const { colors, spacing, radii } = useTheme();
  return (
    <PressableScale
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={() => {
        selection();
        onPress();
      }}
      style={[
        styles.row,
        {
          backgroundColor: colors.surface,
          borderRadius: radii.md,
          borderColor: selected ? colors.brand : colors.border,
          paddingHorizontal: spacing.md,
          gap: spacing.md,
        },
      ]}>
      {IconComponent ? (
        <IconComponent size={24} weight="bold" color={selected ? colors.brand : colors.textMuted} />
      ) : null}
      <View style={styles.flex}>
        <Body>{label}</Body>
      </View>
      <View
        style={[
          styles.dot,
          {
            borderColor: selected ? colors.brand : colors.border,
            backgroundColor: selected ? colors.brand : 'transparent',
          },
        ]}
      />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 64, borderWidth: 2 },
  flex: { flex: 1 },
  dot: { width: 20, height: 20, borderRadius: 10, borderWidth: 2 },
});
