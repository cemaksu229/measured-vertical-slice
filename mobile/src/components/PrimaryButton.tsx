import { ActivityIndicator, StyleSheet, Text } from 'react-native';

import { tap } from '@/lib/haptics';
import { useTheme } from '@/theme/useTheme';

import { PressableScale } from './PressableScale';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export function PrimaryButton({ label, onPress, disabled = false, loading = false }: Props) {
  const { colors, spacing, radii, typeScale } = useTheme();
  const inactive = disabled || loading;

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={() => {
        tap();
        onPress();
      }}
      style={[
        styles.base,
        {
          backgroundColor: colors.brand,
          borderRadius: radii.lg,
          paddingHorizontal: spacing.lg,
          opacity: disabled ? 0.5 : 1,
        },
      ]}>
      {loading ? (
        <ActivityIndicator color={colors.onBrand} />
      ) : (
        <Text style={[typeScale.button, { color: colors.onBrand }]}>{label}</Text>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center', minHeight: 56 },
});
