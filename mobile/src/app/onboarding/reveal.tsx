import { router, useLocalSearchParams } from 'expo-router';
import { ArrowUp, CaretDown, ChartBar, Info, ShieldCheck, type Icon } from 'phosphor-react-native';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Card } from '@/components/Card';
import { CountUpNumber } from '@/components/CountUpNumber';
import { PressableScale } from '@/components/PressableScale';
import { PrimaryButton } from '@/components/PrimaryButton';
import { RangeBand } from '@/components/RangeBand';
import { Screen } from '@/components/Screen';
import { Silhouettes, type SilhouetteItem } from '@/components/Silhouettes';
import { TextButton } from '@/components/TextButton';
import { Body, Caption, H2 } from '@/components/Text';
import { selection, success, tap } from '@/lib/haptics';
import { formatHeight } from '@/logic/height';
import { getNextStep, stepRoute } from '@/onboarding/steps';
import { useCopy, usePrediction } from '@/store/selectors';
import { useAppStore } from '@/store/useAppStore';
import { fontFamily } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

// Adult population means used only to size the outline of an unknown parent.
const ASSUMED_MOM_CM = 162;
const ASSUMED_DAD_CM = 175.5;

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function InfoRow({ icon: IconComponent, children }: { icon: Icon; children: ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={styles.infoRow}>
      <IconComponent size={22} weight="bold" color={colors.brand} />
      <Body style={styles.flex}>{children}</Body>
    </View>
  );
}

function Collapsible({ title, children }: { title: string; children: ReactNode }) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const turn = useSharedValue(0);
  const caret = useAnimatedStyle(() => ({ transform: [{ rotate: `${turn.get() * 180}deg` }] }));

  return (
    <Card style={styles.collapsible}>
      <Animated.View layout={LinearTransition.duration(220)}>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={title}
          accessibilityState={{ expanded: open }}
          scaleTo={0.99}
          onPress={() => {
            selection();
            turn.set(withTiming(open ? 0 : 1, { duration: 220 }));
            setOpen(!open);
          }}
          style={styles.collapsibleHead}>
          <Body style={styles.collapsibleTitle}>{title}</Body>
          <Animated.View style={caret}>
            <CaretDown size={20} weight="bold" color={colors.textMuted} />
          </Animated.View>
        </PressableScale>
        {open ? (
          <Animated.View entering={FadeIn.duration(250)} style={styles.collapsibleBody}>
            {children}
          </Animated.View>
        ) : null}
      </Animated.View>
    </Card>
  );
}

export default function RevealScreen() {
  const { colors } = useTheme();
  const copy = useCopy();
  const { from } = useLocalSearchParams<{ from?: string }>();
  const fromHome = from === 'home';
  const prediction = usePrediction();
  const profile = useAppStore((s) => s.profile);
  const unit = useAppStore((s) => s.unit);
  const setUnit = useAppStore((s) => s.setUnit);
  const [toast, setToast] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Without a sex there is nothing to predict; send the user back to answer it.
  const missing = prediction === null;
  useEffect(() => {
    if (missing) router.replace('/onboarding/about');
  }, [missing]);

  useEffect(() => {
    if (missing) return;
    const t = setTimeout(success, 900);
    return () => clearTimeout(t);
  }, [missing]);

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    [],
  );

  if (!prediction) return null;

  const metric = unit === 'metric';
  const sexNoun = profile.sex === 'female' ? 'women' : 'men';
  const goRound = Math.round(prediction.growthRemainingCm);
  const toGo = !metric ? Math.round(prediction.growthRemainingCm / 2.54) : goRound;

  const spreadCm = Math.round((prediction.highCm - prediction.lowCm) / 2);
  const spreadText = metric ? `${spreadCm} cm` : `${Math.round(spreadCm / 2.54)} in`;
  const complete = prediction.growthRemainingCm <= 0;
  const varyText = complete
    ? `${copy.isParent ? "Your child's" : 'Your'} growth is likely complete, so we use ${copy.isParent ? 'their' : 'your'} current height.`
    : `Real outcomes vary by about ${spreadText} either way.`;

  const toGoText =
    prediction.growthRemainingCm <= 0
      ? 'Growth likely complete'
      : toGo < 1
        ? `Under 1 ${metric ? 'cm' : 'in'} to go`
        : `≈ ${toGo} ${metric ? 'cm' : 'in'} to go`;

  const personalise = (note: string) =>
    copy.isParent
      ? note
          .replace('your range', "your child's range")
          .replace('your current height', 'their current height')
          .replace('your final height', 'their final height')
      : note;
  const notes = prediction.notes
    .filter((n) => /unknown|less reliable|likely complete/i.test(n))
    .map(personalise);

  const subject = copy.isParent ? 'Child' : 'You';
  const items: SilhouetteItem[] = [
    {
      key: 'mom',
      label: 'Mom',
      heightCm: profile.motherHeightCm,
      assumedCm: ASSUMED_MOM_CM,
      tone: 'parent',
    },
    { key: 'now', label: `${subject} now`, heightCm: profile.currentHeightCm, tone: 'now' },
    {
      key: 'pred',
      label: `${subject} (predicted)`,
      heightCm: prediction.predictedCm,
      tone: 'predicted',
    },
    {
      key: 'dad',
      label: 'Dad',
      heightCm: profile.fatherHeightCm,
      assumedCm: ASSUMED_DAD_CM,
      tone: 'parent',
    },
  ];

  const showToast = () => {
    tap();
    setToast(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(false), 2200);
  };

  return (
    <Screen edges={['bottom', 'left', 'right']}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.hero}>
          <Caption align="center">
            {copy.isParent ? "Your child's predicted height" : 'Your predicted adult height'}
          </Caption>
          <View style={styles.numberRow}>
            <CountUpNumber
              from={Math.round(profile.currentHeightCm)}
              value={Math.round(prediction.predictedCm)}
              duration={900}
              delay={250}
              format={(n) => (metric ? String(n) : formatHeight(n, 'imperial'))}
              style={styles.number}
            />
            {metric ? <H2 muted>cm</H2> : null}
          </View>
        </Animated.View>

        <RangeBand
          lowCm={prediction.lowCm}
          highCm={prediction.highCm}
          predictedCm={prediction.predictedCm}
          unit={unit}
          delay={700}
        />

        <Animated.View entering={FadeInDown.delay(900).duration(450)}>
          <Card>
            <Silhouettes
              items={items}
              unit={unit}
              delay={1000}
              chartHeight={96}
              backgroundColor={colors.surface}
              onPress={() => {
                selection();
                setUnit(metric ? 'imperial' : 'metric');
              }}
            />
            <Caption align="center" style={styles.hint}>
              Tap to switch between cm and ft.
            </Caption>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(1100).duration(450)} style={styles.info}>
          <InfoRow icon={ArrowUp}>{toGoText}</InfoRow>
          <InfoRow icon={ChartBar}>
            {`${cap(prediction.percentileLabel)} for adult ${sexNoun}`}
          </InfoRow>
          <InfoRow icon={ShieldCheck}>{`${cap(prediction.confidence)} confidence`}</InfoRow>
          {notes.map((n) => (
            <InfoRow key={n} icon={Info}>
              {n}
            </InfoRow>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(1250).duration(450)}>
          <Collapsible title="How we calculate this">
            <Body muted>Tanner mid-parental method + CDC growth data.</Body>
            <Body muted>{varyText}</Body>
            <Body muted>Not medical advice.</Body>
          </Collapsible>
        </Animated.View>
      </ScrollView>

      {toast ? (
        <Animated.View
          entering={FadeInDown.duration(250)}
          exiting={FadeOut.duration(200)}
          style={[styles.toast, { backgroundColor: colors.text }]}
          accessibilityLiveRegion="polite">
          <Body color={colors.bg} style={styles.toastText}>
            Sharing is off in this demo.
          </Body>
        </Animated.View>
      ) : null}

      <View
        style={[
          styles.footer,
          { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
        ]}>
        <PrimaryButton
          label={fromHome ? 'Back to my plan' : 'Make my growth plan'}
          onPress={() =>
            fromHome ? router.back() : router.push(stepRoute(getNextStep('reveal')!))
          }
        />
        <TextButton label="Share my range" onPress={showToast} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { gap: 12, paddingBottom: 12 },
  hero: { alignItems: 'center', gap: 4 },
  numberRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  number: { fontSize: 64, lineHeight: 68 },
  hint: { marginTop: 8 },
  info: { gap: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  collapsible: { paddingVertical: 8 },
  collapsibleHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  collapsibleTitle: { fontFamily: fontFamily.bodyMedium },
  collapsibleBody: { gap: 8, paddingBottom: 12 },
  footer: { gap: 0, paddingTop: 12 },
  toast: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 140,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  toastText: { fontFamily: fontFamily.bodyMedium },
});
