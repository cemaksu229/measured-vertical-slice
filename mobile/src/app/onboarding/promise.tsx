import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Chip } from '@/components/Chip';
import { PrimaryButton } from '@/components/PrimaryButton';
import { RulerHero } from '@/components/RulerHero';
import { Screen } from '@/components/Screen';
import { Body, Caption, H1 } from '@/components/Text';
import { getNextStep, stepRoute } from '@/onboarding/steps';

export default function PromiseScreen() {
  return (
    <Screen edges={['bottom', 'left', 'right']}>
      <RulerHero style={styles.hero} />

      <View style={styles.copy}>
        <Animated.View entering={FadeInDown.delay(500).duration(450)} style={styles.gap}>
          <H1>Your honest adult height, in 60 seconds.</H1>
          <Body muted>
            Based on your parents&apos; heights and a method doctors use. See your result before
            any paywall.
          </Body>
          <Chip label="4 questions · about 60 seconds" />
        </Animated.View>
      </View>

      <Animated.View entering={FadeInDown.delay(700).duration(450)} style={styles.footer}>
        <PrimaryButton
          label="Predict my height"
          onPress={() => router.push(stepRoute(getNextStep('promise')!))}
        />
        <Caption align="center">No account needed.</Caption>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { flex: 1, minHeight: 240 },
  copy: { marginTop: 24 },
  gap: { gap: 12 },
  footer: { marginTop: 24, gap: 12 },
});
