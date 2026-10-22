import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme/useTheme';

type Props = {
  children: ReactNode;
  /** Highlights the card with the brand border. */
  highlighted?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Card({ children, highlighted = false, style }: Props) {
  const { colors, spacing, radii } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: radii.lg,
          borderWidth: highlighted ? 2 : 1,
          borderColor: highlighted ? colors.brand : colors.border,
          padding: spacing.lg,
        },
        style,
      ]}>
      {children}
    </View>
  );
}
