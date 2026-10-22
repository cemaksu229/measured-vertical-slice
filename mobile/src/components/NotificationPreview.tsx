import { Moon } from 'phosphor-react-native';
import { StyleSheet, View } from 'react-native';

import { fontFamily } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { Body, Caption } from './Text';

type Props = { title?: string; body?: string };

export function NotificationPreview({
  title = 'Measured',
  body = 'Lights out in 30 min. Sleep is when you grow.',
}: Props) {
  const { colors, spacing, radii } = useTheme();
  return (
    <View
      accessibilityLabel={`Example notification: ${body}`}
      style={[
        styles.phone,
        { borderColor: colors.border, backgroundColor: colors.surface, padding: spacing.md },
      ]}>
      <View style={[styles.notch, { backgroundColor: colors.border }]} />
      <View
        style={[
          styles.card,
          { backgroundColor: colors.bg, borderRadius: radii.lg, padding: spacing.md, gap: spacing.md },
        ]}>
        <View style={[styles.icon, { backgroundColor: colors.brand, borderRadius: radii.md }]}>
          <Moon size={22} weight="bold" color={colors.onBrand} />
        </View>
        <View style={styles.flex}>
          <View style={styles.top}>
            <Body style={{ fontFamily: fontFamily.bodySemibold }}>{title}</Body>
            <Caption>now</Caption>
          </View>
          <Body>{body}</Body>
        </View>
      </View>
      <View
        style={[styles.ghost, { backgroundColor: colors.border, borderRadius: radii.lg, marginTop: spacing.sm }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  phone: { width: '100%', maxWidth: 320, alignSelf: 'center', borderWidth: 2, borderRadius: 36 },
  notch: { width: 64, height: 6, borderRadius: 3, alignSelf: 'center', marginBottom: 16 },
  card: { flexDirection: 'row', alignItems: 'flex-start' },
  flex: { flex: 1 },
  top: { flexDirection: 'row', justifyContent: 'space-between' },
  icon: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  ghost: { height: 48, opacity: 0.5, marginHorizontal: 8 },
});
