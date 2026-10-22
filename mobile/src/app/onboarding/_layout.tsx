import { Stack, useGlobalSearchParams, usePathname } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProgressBar } from '@/components/ProgressBar';
import { getProgress, showsProgress } from '@/onboarding/steps';
import { useTheme } from '@/theme/useTheme';

export default function OnboardingLayout() {
  const pathname = usePathname();
  const { from } = useGlobalSearchParams<{ from?: string }>();
  const { colors, spacing } = useTheme();
  const step = pathname.split('/').pop() ?? '';

  return (
    <SafeAreaView edges={['top']} style={[styles.flex, { backgroundColor: colors.bg }]}>
      <View style={{ height: 4 + spacing.sm, paddingTop: spacing.sm, paddingHorizontal: spacing.lg }}>
        {showsProgress(step) && from !== 'home' ? <ProgressBar progress={getProgress(step)} /> : null}
      </View>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
          contentStyle: { backgroundColor: colors.bg },
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
