import { useRouter } from 'expo-router';
import { Platform, View } from 'react-native';

import { NotificationPreview } from '@/components/NotificationPreview';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { Body, H2 } from '@/components/Text';
import { TextButton } from '@/components/TextButton';
import { stepRoute } from '@/onboarding/steps';
import { useAppStore } from '@/store/useAppStore';
import { useTheme } from '@/theme/useTheme';

export default function PrimingScreen() {
  const router = useRouter();
  const { spacing } = useTheme();
  const setNotificationsAsked = useAppStore((s) => s.setNotificationsAsked);

  const next = () => router.push(stepRoute('paywall'));

  const turnOn = async () => {
    try {
      if (Platform.OS !== 'web') {
        const Notifications = await import('expo-notifications');
        await Notifications.requestPermissionsAsync();
      }
    } catch {
      // Permission is optional; continue regardless.
    }
    setNotificationsAsked(true);
    next();
  };

  const skip = () => {
    setNotificationsAsked(true);
    next();
  };

  return (
    <Screen edges={['bottom', 'left', 'right']}>
      <View style={{ flex: 1, justifyContent: 'center', gap: spacing.xl }}>
        <NotificationPreview />
        <View style={{ gap: spacing.sm }}>
          <H2>A nudge at bedtime?</H2>
          <Body muted>
            One reminder a day for your plan. And if you start a trial, we&apos;ll remind you 2 days before it
            ends.
          </Body>
        </View>
      </View>
      <View style={{ gap: spacing.sm }}>
        <PrimaryButton label="Turn on reminders" onPress={turnOn} />
        <TextButton label="Not now" onPress={skip} />
      </View>
    </Screen>
  );
}
