import { router } from 'expo-router';
import { Check, Warning } from 'phosphor-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Card } from '@/components/Card';
import { PressableScale } from '@/components/PressableScale';
import { PrimaryButton } from '@/components/PrimaryButton';
import { RulerPicker } from '@/components/RulerPicker';
import { Screen } from '@/components/Screen';
import { Body, Caption, H2 } from '@/components/Text';
import { selection } from '@/lib/haptics';
import { getNextStep, stepRoute } from '@/onboarding/steps';
import { useCopy } from '@/store/selectors';
import { useAppStore } from '@/store/useAppStore';
import { useTheme } from '@/theme/useTheme';

const VALID_MIN = 120;
const VALID_MAX = 220;
const isOff = (cm: number | null) => cm !== null && (cm < VALID_MIN || cm > VALID_MAX);

function ParentCard({
  label,
  value,
  fallbackCm,
  onChange,
}: {
  label: string;
  value: number | null;
  fallbackCm: number;
  onChange: (cm: number | null) => void;
}) {
  const { colors } = useTheme();
  const [lastKnown, setLastKnown] = useState(value ?? fallbackCm);
  const unknown = value === null;
  const off = isOff(value);

  return (
    <Card highlighted={off} style={styles.card}>
      <RulerPicker
        variant="compact"
        label={label}
        valueCm={value ?? lastKnown}
        onChangeCm={(cm) => {
          setLastKnown(cm);
          onChange(cm);
        }}
        minCm={100}
        maxCm={240}
        validMinCm={VALID_MIN}
        validMaxCm={VALID_MAX}
        disabled={unknown}
      />
      {off ? (
        <View style={styles.error} accessibilityLiveRegion="polite">
          <Warning size={18} weight="bold" color={colors.danger} />
          <Caption color={colors.danger}>That looks off. Double-check this one?</Caption>
        </View>
      ) : null}
      <PressableScale
        accessibilityRole="checkbox"
        accessibilityLabel={`I don't know ${label}'s height`}
        accessibilityState={{ checked: unknown }}
        onPress={() => {
          selection();
          onChange(unknown ? lastKnown : null);
        }}
        scaleTo={0.98}
        style={styles.check}>
        <View
          style={[
            styles.box,
            {
              borderColor: unknown ? colors.brand : colors.border,
              backgroundColor: unknown ? colors.brand : 'transparent',
            },
          ]}>
          {unknown ? <Check size={14} weight="bold" color={colors.onBrand} /> : null}
        </View>
        <Body>I don&apos;t know</Body>
      </PressableScale>
    </Card>
  );
}

export default function ParentsScreen() {
  const copy = useCopy();
  const mother = useAppStore((s) => s.profile.motherHeightCm);
  const father = useAppStore((s) => s.profile.fatherHeightCm);
  const setProfile = useAppStore((s) => s.setProfile);
  const blocked = isOff(mother) || isOff(father);

  return (
    <Screen edges={['bottom', 'left', 'right']}>
      <Animated.View entering={FadeInDown.duration(400)}>
        <H2>{copy.isParent ? "How tall are your child's parents?" : 'How tall are your parents?'}</H2>
      </Animated.View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(120).duration(450)}>
          <ParentCard
            label="Mom"
            value={mother}
            fallbackCm={163}
            onChange={(cm) => setProfile({ motherHeightCm: cm })}
          />
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(220).duration(450)}>
          <ParentCard
            label="Dad"
            value={father}
            fallbackCm={177}
            onChange={(cm) => setProfile({ fatherHeightCm: cm })}
          />
        </Animated.View>
        <Caption>
          {`Biological parents give the most accurate estimate. Not sure? That's okay, we'll widen ${copy.isParent ? "your child's" : 'your'} range.`}
        </Caption>
      </ScrollView>

      <PrimaryButton
        label="Build my prediction"
        disabled={blocked}
        onPress={() => router.push(stepRoute(getNextStep('parents')!))}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, marginTop: 16 },
  scrollContent: { gap: 12, paddingBottom: 16 },
  card: { paddingVertical: 16, gap: 8 },
  error: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  check: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 44 },
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
