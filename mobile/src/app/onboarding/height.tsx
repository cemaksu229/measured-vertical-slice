import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { PrimaryButton } from '@/components/PrimaryButton';
import { RulerPicker } from '@/components/RulerPicker';
import { Screen } from '@/components/Screen';
import { Caption, H2 } from '@/components/Text';
import { getNextStep, stepRoute } from '@/onboarding/steps';
import { useCopy } from '@/store/selectors';
import { useAppStore } from '@/store/useAppStore';

export default function HeightScreen() {
  const copy = useCopy();
  const heightCm = useAppStore((s) => s.profile.currentHeightCm);
  const setProfile = useAppStore((s) => s.setProfile);

  return (
    <Screen edges={['bottom', 'left', 'right']}>
      <Animated.View entering={FadeInDown.duration(400)}>
        <H2>{copy.isParent ? 'How tall is your child now?' : 'How tall are you now?'}</H2>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(150).duration(500)} style={styles.picker}>
        <RulerPicker
          valueCm={heightCm}
          onChangeCm={(cm) => setProfile({ currentHeightCm: cm })}
          minCm={100}
          maxCm={220}
        />
      </Animated.View>

      <View style={styles.footer}>
        <Caption>Barefoot, back against a wall. A rough number is fine.</Caption>
        <PrimaryButton
          label="Continue"
          onPress={() => router.push(stepRoute(getNextStep('height')!))}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  picker: { flex: 1, marginVertical: 16 },
  footer: { gap: 16 },
});
