import { router } from 'expo-router';
import { GenderFemale, GenderMale, type Icon } from 'phosphor-react-native';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { PressableScale } from '@/components/PressableScale';
import { PrimaryButton } from '@/components/PrimaryButton';
import { RulerScale } from '@/components/RulerPicker';
import { Screen } from '@/components/Screen';
import { Body, Caption, Display, H2 } from '@/components/Text';
import { selection } from '@/lib/haptics';
import { getNextStep, stepRoute } from '@/onboarding/steps';
import { useAppStore, type Sex } from '@/store/useAppStore';
import { useCopy } from '@/store/selectors';
import { fontFamily } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const AGE_MIN = 10;
const AGE_MAX = 25;

const SEXES: readonly { value: Sex; label: string; icon: Icon }[] = [
  { value: 'male', label: 'Male', icon: GenderMale },
  { value: 'female', label: 'Female', icon: GenderFemale },
];

function SexTile({
  label,
  icon: IconComponent,
  selected,
  onPress,
}: {
  label: string;
  icon: Icon;
  selected: boolean;
  onPress: () => void;
}) {
  const { colors, radii } = useTheme();
  return (
    <PressableScale
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={() => {
        selection();
        onPress();
      }}
      style={[
        styles.tile,
        {
          backgroundColor: colors.surface,
          borderRadius: radii.md,
          borderColor: selected ? colors.brand : colors.border,
        },
      ]}>
      <IconComponent size={28} weight="bold" color={selected ? colors.brand : colors.textMuted} />
      <Body color={selected ? colors.text : colors.textMuted} style={styles.tileLabel}>
        {label}
      </Body>
    </PressableScale>
  );
}

const ageLabel = (v: number) => String(v);

export default function AboutScreen() {
  const { colors, radii } = useTheme();
  const copy = useCopy();
  const sex = useAppStore((s) => s.profile.sex);
  const age = useAppStore((s) => s.profile.ageYears);
  const setProfile = useAppStore((s) => s.setProfile);

  return (
    <Screen edges={['bottom', 'left', 'right']}>
      <Animated.View entering={FadeInDown.duration(400)}>
        <H2>{copy.isParent ? 'A little about your child.' : 'A little about you.'}</H2>
      </Animated.View>

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.delay(120).duration(400)} style={styles.block}>
          <Caption>Sex</Caption>
          <View style={styles.tiles} accessibilityRole="radiogroup">
            {SEXES.map((o) => (
              <SexTile
                key={o.value}
                label={o.label}
                icon={o.icon}
                selected={sex === o.value}
                onPress={() => setProfile({ sex: o.value })}
              />
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(240).duration(400)} style={styles.block}>
          <Caption>Age</Caption>
          <View
            style={[
              styles.ageCard,
              { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg },
            ]}>
            <View style={styles.ageNumber}>
              <Display style={styles.tabular}>{age}</Display>
              <H2 muted>years</H2>
            </View>
            <RulerScale
              value={age}
              min={AGE_MIN}
              max={AGE_MAX}
              onChange={(v) => setProfile({ ageYears: v })}
              orientation="horizontal"
              gap={56}
              thickness={72}
              majorEvery={1}
              labelFor={ageLabel}
              accessibilityLabel="Age in years"
              accessibilityValueText={`${age} years`}
              style={styles.ageRuler}
            />
          </View>
          <Caption>We use this to pick the right growth curve.</Caption>
        </Animated.View>
      </View>

      <PrimaryButton
        label="Continue"
        disabled={sex === null}
        onPress={() => router.push(stepRoute(getNextStep('about')!))}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, marginTop: 24, gap: 32 },
  block: { gap: 8 },
  tiles: { flexDirection: 'row', gap: 12 },
  tile: {
    flex: 1,
    minHeight: 80,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  tileLabel: { fontFamily: fontFamily.bodyMedium },
  ageCard: { borderWidth: 1, paddingTop: 16, overflow: 'hidden' },
  ageNumber: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', gap: 8 },
  tabular: { fontVariant: ['tabular-nums'] },
  ageRuler: { height: 88, marginTop: 8 },
});
