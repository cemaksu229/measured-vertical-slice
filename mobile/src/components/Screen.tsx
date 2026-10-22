import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/useTheme';

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  edges?: Edge[];
};

export function Screen({ children, style, edges }: Props) {
  const { colors, spacing } = useTheme();
  return (
    <SafeAreaView edges={edges} style={[styles.flex, { backgroundColor: colors.bg }]}>
      <View style={[styles.flex, { padding: spacing.lg }, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
