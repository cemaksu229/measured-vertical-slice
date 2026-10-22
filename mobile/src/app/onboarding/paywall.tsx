import { useLocalSearchParams, useRouter } from 'expo-router';
import { Check, X } from 'phosphor-react-native';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

import { Card } from '@/components/Card';
import { IconButton } from '@/components/IconButton';
import { PlanOption } from '@/components/PlanOption';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { Body, Caption, H1 } from '@/components/Text';
import { trialEndDate } from '@/lib/dates';
import { useCopy } from '@/store/selectors';
import { useAppStore, type Goal } from '@/store/useAppStore';
import { fontFamily } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const HEADLINES: Record<Goal, string> = {
  'reach-potential': 'Reach the top of your range',
  'know-final-height': 'Stay on top of your final height',
  'track-child': 'Help your child reach their range',
};


const CANCEL_LINE = Platform.select({
  ios: 'Cancel anytime in Settings → Apple ID → Subscriptions',
  default: 'Cancel anytime in Google Play → Payments & subscriptions → Subscriptions',
});

type Plan = 'yearly' | 'weekly';

export default function PaywallScreen() {
  const router = useRouter();
  const { colors, spacing } = useTheme();
  const goal = useAppStore((s) => s.goal);
  const copy = useCopy();
  const features = ['Full 4-week plan', 'Daily habit tracker', `Monthly re-check of ${copy.possessive} prediction`];
  const { from } = useLocalSearchParams<{ from?: string }>();
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const [plan, setPlan] = useState<Plan>('yearly');

  const close = () => {
    if (from === 'home') {
      router.back();
      return;
    }
    completeOnboarding();
    router.replace('/home');
  };

  return (
    <Screen edges={['bottom', 'left', 'right']} style={{ paddingTop: 0 }}>
      <View style={styles.top}>
        <IconButton
          accessibilityLabel="Close"
          onPress={close}
          icon={<X size={24} weight="bold" color={colors.text} />}
        />
      </View>
      <ScrollView
        contentContainerStyle={{ gap: spacing.md, paddingBottom: spacing.lg }}
        showsVerticalScrollIndicator={false}>
        <H1>{HEADLINES[goal ?? 'reach-potential']}</H1>
        <View style={{ gap: spacing.sm }}>
          {features.map((f) => (
            <View key={f} style={[styles.feature, { gap: spacing.sm }]}>
              <Check size={20} weight="bold" color={colors.brand} />
              <Body>{f}</Body>
            </View>
          ))}
        </View>
        <View style={{ gap: spacing.sm }} accessibilityRole="radiogroup">
          <PlanOption
            title="Yearly"
            badge="Best value"
            price="$29.99 / year"
            detail="≈ $0.58/week · 7-day free trial"
            selected={plan === 'yearly'}
            onPress={() => setPlan('yearly')}
          />
          <PlanOption
            title="Weekly"
            price="$3.99 / week"
            detail="No trial"
            selected={plan === 'weekly'}
            onPress={() => setPlan('weekly')}
          />
        </View>
        <Card style={{ gap: spacing.xs, padding: spacing.md }}>
          <Body style={{ fontFamily: fontFamily.bodySemibold }}>
            {plan === 'yearly' ? 'Today: $0' : 'Today: $3.99'}
          </Body>
          <Body>{plan === 'yearly' ? `On ${trialEndDate(7)}: $29.99` : 'Renews weekly at $3.99'}</Body>
          <Caption>{CANCEL_LINE}</Caption>
        </Card>
      </ScrollView>
      <View style={{ gap: spacing.sm }}>
        <PrimaryButton
          label={plan === 'yearly' ? 'Start my free week' : 'Subscribe for $3.99/week'}
          onPress={() => router.push('/onboarding/welcome')}
        />
        <Caption align="center">Restore · Terms · Privacy · Demo build: no real payment</Caption>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { alignItems: 'flex-start', marginLeft: -8 },
  feature: { flexDirection: 'row', alignItems: 'center' },
});
