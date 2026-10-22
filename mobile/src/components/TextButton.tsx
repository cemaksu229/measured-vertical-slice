import { StyleSheet, Text } from 'react-native';

import { selection } from '@/lib/haptics';
import { useTheme } from '@/theme/useTheme';

import { PressableScale } from './PressableScale';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function TextButton({ label, onPress, disabled = false }: Props) {
  const { colors, typeScale } = useTheme();
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={() => {
        selection();
        onPress();
      }}
      scaleTo={0.98}
      style={[styles.base, { opacity: disabled ? 0.5 : 1 }]}>
      <Text style={[typeScale.button, { color: colors.textMuted }]}>{label}</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center', minHeight: 44, paddingHorizontal: 16 },
});
