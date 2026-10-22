import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, Text, useWindowDimensions, View, type StyleProp, type ViewStyle } from 'react-native';
import { GestureDetector, GestureHandlerRootView, usePanGesture } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { selection } from '@/lib/haptics';
import { useAppStore, type Unit } from '@/store/useAppStore';
import { fontFamily } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { Segmented } from './Segmented';
import { Display, H1, H2 } from './Text';

// Stops the browser from scrolling the page while the ruler is dragged (react-native-web only).
const WEB_NO_SCROLL = { touchAction: 'none' } as object;
const MAX_FLING_STEPS = 12;

function clamp(n: number, lo: number, hi: number) {
  'worklet';
  return Math.min(Math.max(n, lo), hi);
}
const metricLabel = (v: number) => String(v);
const imperialLabel = (v: number) => `${v / 12}'`;
const cmToInches = (cm: number) => Math.round(cm / 2.54);
const inchesToCm = (inches: number) => Math.round(inches * 2.54 * 10) / 10;

/* -------------------------------------------------------------------------- */
/* Generic ruler                                                               */
/* -------------------------------------------------------------------------- */

type ScaleProps = {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  orientation: 'vertical' | 'horizontal';
  /** Pixels between two neighbouring ticks. */
  gap: number;
  /** Size of the ruler across the drag axis. */
  thickness: number;
  majorEvery: number;
  midEvery?: number;
  /** Label for major ticks; return null for none. */
  labelFor?: (value: number) => string | null;
  /** Ticks outside this range are drawn in the danger colour. */
  validMin?: number;
  validMax?: number;
  disabled?: boolean;
  accessibilityLabel: string;
  accessibilityValueText?: string;
  style?: StyleProp<ViewStyle>;
};

type TicksProps = Pick<
  ScaleProps,
  'min' | 'max' | 'orientation' | 'gap' | 'thickness' | 'majorEvery' | 'midEvery' | 'labelFor'
> & { validMin: number; validMax: number; tickColor: string; labelColor: string; dangerColor: string };

const Ticks = memo(function Ticks({
  min,
  max,
  orientation,
  gap,
  thickness,
  majorEvery,
  midEvery,
  labelFor,
  validMin,
  validMax,
  tickColor,
  labelColor,
  dangerColor,
}: TicksProps) {
  const vertical = orientation === 'vertical';
  const majorLen = Math.round(thickness * 0.42);
  const midLen = Math.round(thickness * 0.3);
  const minorLen = Math.round(thickness * 0.2);
  const length = (max - min) * gap;

  const nodes = [];
  for (let v = min; v <= max; v++) {
    const major = v % majorEvery === 0;
    const mid = !major && midEvery !== undefined && v % midEvery === 0;
    const len = major ? majorLen : mid ? midLen : minorLen;
    const pos = vertical ? (max - v) * gap : (v - min) * gap;
    const invalid = v < validMin || v > validMax;
    const color = invalid ? dangerColor : tickColor;
    const label = major && labelFor ? labelFor(v) : null;
    nodes.push(
      <View
        key={`t${v}`}
        style={
          vertical
            ? {
                position: 'absolute',
                top: pos - 1,
                right: 0,
                width: len,
                height: 2,
                borderRadius: 1,
                backgroundColor: color,
                opacity: major ? 1 : mid ? 0.7 : 0.45,
              }
            : {
                position: 'absolute',
                left: pos - 1,
                bottom: 0,
                width: 2,
                height: len,
                borderRadius: 1,
                backgroundColor: color,
                opacity: major ? 1 : mid ? 0.7 : 0.45,
              }
        }
      />,
    );
    if (label) {
      nodes.push(
        <Text
          key={`l${v}`}
          style={[
            styles.label,
            { color: invalid ? dangerColor : labelColor },
            vertical
              ? { top: pos - 9, right: majorLen + 8, textAlign: 'right' }
              : { left: pos - 24, width: 48, bottom: majorLen + 4, textAlign: 'center' },
          ]}>
          {label}
        </Text>,
      );
    }
  }

  return (
    <View
      style={
        vertical
          ? { position: 'absolute', top: 0, left: 0, width: thickness, height: length, pointerEvents: 'none' }
          : { position: 'absolute', top: 0, left: 0, height: thickness, width: length, pointerEvents: 'none' }
      }>
      {nodes}
    </View>
  );
});

/**
 * Draggable ruler. The strip follows the finger continuously, snaps to whole steps on release,
 * and fires a selection haptic whenever the value crosses a tick. Vertical rulers read bigger
 * numbers towards the top (like a wall chart), horizontal ones towards the right.
 */
export function RulerScale({
  value,
  min,
  max,
  onChange,
  orientation,
  gap,
  thickness,
  majorEvery,
  midEvery,
  labelFor,
  validMin,
  validMax,
  disabled = false,
  accessibilityLabel,
  accessibilityValueText,
  style,
}: ScaleProps) {
  const { colors } = useTheme();
  const vertical = orientation === 'vertical';
  const pos = useSharedValue(clamp(value, min, max));
  const startPos = useSharedValue(0);

  const onChangeRef = useRef(onChange);
  const lastEmitted = useRef(Math.round(value));
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  // True from touch-down until the release animation settles. While it is set, `value` only
  // echoes our own (slightly delayed) emits, so syncing from it would yank the strip backwards.
  const interacting = useRef(false);
  const setInteracting = useCallback((next: boolean) => {
    interacting.current = next;
  }, []);
  const settling = useSharedValue(false);

  // Follow value changes that did not come from a drag (for example accessibility actions).
  useEffect(() => {
    if (interacting.current) return;
    lastEmitted.current = Math.round(value);
    if (Math.round(pos.get()) !== Math.round(value)) {
      cancelAnimation(pos);
      pos.set(withTiming(clamp(value, min, max), { duration: 250 }));
    }
  }, [value, min, max, pos]);

  const emit = useCallback((v: number) => {
    if (v === lastEmitted.current) return;
    lastEmitted.current = v;
    selection();
    onChangeRef.current(v);
  }, []);

  useAnimatedReaction(
    () => Math.round(pos.get()),
    (current, previous) => {
      if (previous !== null && current !== previous) scheduleOnRN(emit, current);
    },
  );

  const pan = usePanGesture({
    enabled: !disabled,
    activeOffsetX: vertical ? undefined : ([-4, 4] as [number, number]),
    activeOffsetY: vertical ? ([-4, 4] as [number, number]) : undefined,
    failOffsetY: vertical ? undefined : ([-16, 16] as [number, number]),
    onBegin: () => {
      cancelAnimation(pos);
      settling.set(false);
      startPos.set(pos.get());
      scheduleOnRN(setInteracting, true);
    },
    onUpdate: (e) => {
      const delta = vertical ? e.translationY : -e.translationX;
      pos.set(clamp(startPos.get() + delta / gap, min, max));
    },
    onDeactivate: (e) => {
      const velocity = vertical ? e.velocityY : -e.velocityX;
      // Cap the fling so a fast release (or one far outside the ruler) can't throw it across the scale.
      const fling = clamp((velocity * 0.16) / gap, -MAX_FLING_STEPS, MAX_FLING_STEPS);
      const target = Math.round(clamp(pos.get() + fling, min, max));
      const distance = Math.abs(target - pos.get());
      settling.set(true);
      pos.set(
        withTiming(
          target,
          { duration: 220 + Math.min(distance, 20) * 12, easing: Easing.out(Easing.cubic) },
          (finished) => {
            if (finished) scheduleOnRN(setInteracting, false);
          },
        ),
      );
    },
    onFinalize: () => {
      // Touch cancelled without a release (system gesture, scroll took over): snap to the nearest tick.
      if (settling.get()) return;
      pos.set(
        withTiming(Math.round(pos.get()), { duration: 180 }, (finished) => {
          if (finished) scheduleOnRN(setInteracting, false);
        }),
      );
    },
  });

  const strip = useAnimatedStyle(() => {
    const along = vertical ? (max - pos.get()) * gap : (pos.get() - min) * gap;
    return { transform: vertical ? [{ translateY: -along }] : [{ translateX: -along }] };
  });

  const stepBy = (delta: number) => onChange(clamp(Math.round(value) + delta, min, max));

  return (
    <GestureHandlerRootView
      style={style}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={accessibilityValueText ? { text: accessibilityValueText } : undefined}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(e) => {
        if (e.nativeEvent.actionName === 'increment') stepBy(1);
        if (e.nativeEvent.actionName === 'decrement') stepBy(-1);
      }}>
      <GestureDetector gesture={pan}>
        <View
          style={[styles.fill, WEB_NO_SCROLL]}>
          <Animated.View
            style={[
              vertical
                ? { position: 'absolute', top: '50%', right: 0, width: thickness, height: (max - min) * gap }
                : { position: 'absolute', top: 0, left: '50%', height: thickness, width: (max - min) * gap },
              strip,
            ]}>
            <Ticks
              min={min}
              max={max}
              orientation={orientation}
              gap={gap}
              thickness={thickness}
              majorEvery={majorEvery}
              midEvery={midEvery}
              labelFor={labelFor}
              validMin={validMin ?? min}
              validMax={validMax ?? max}
              tickColor={colors.textMuted}
              labelColor={colors.textMuted}
              dangerColor={colors.danger}
            />
          </Animated.View>
          <View
            style={[
              styles.needle,
              { backgroundColor: colors.brand, pointerEvents: 'none' },
              vertical
                ? { left: 0, right: 0, top: '50%', height: 3, marginTop: -1.5 }
                : { bottom: 0, height: Math.round(thickness * 0.42) + 2, left: '50%', width: 3, marginLeft: -1.5 },
            ]}
          />
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

/* -------------------------------------------------------------------------- */
/* Height picker                                                               */
/* -------------------------------------------------------------------------- */

export type RulerPickerProps = {
  valueCm: number;
  onChangeCm: (cm: number) => void;
  /** `full` is the vertical Height layout; `compact` is a horizontal card row for Parents. */
  variant?: 'full' | 'compact';
  minCm?: number;
  maxCm?: number;
  /** Ticks outside this range are drawn in the danger colour. */
  validMinCm?: number;
  validMaxCm?: number;
  /** Shows the cm / ft-in toggle. Defaults to true for `full`. */
  showToggle?: boolean;
  /** Compact only: row title, for example "Mom". */
  label?: string;
  /** Compact only: dims the ruler and shows `disabledText` instead of the number. */
  disabled?: boolean;
  disabledText?: string;
  style?: StyleProp<ViewStyle>;
};

const UNIT_OPTIONS = [
  { value: 'metric', label: 'cm' },
  { value: 'imperial', label: 'ft / in' },
] as const;

function bigNumber(cm: number, unit: Unit): { text: string; suffix: string | null } {
  if (unit === 'metric') return { text: String(Math.round(cm)), suffix: 'cm' };
  const total = cmToInches(cm);
  return { text: `${Math.floor(total / 12)}'${total % 12}"`, suffix: null };
}

export function RulerPicker({
  valueCm,
  onChangeCm,
  variant = 'full',
  minCm = 100,
  maxCm = 220,
  validMinCm,
  validMaxCm,
  showToggle,
  label,
  disabled = false,
  disabledText = 'Unknown',
  style,
}: RulerPickerProps) {
  const { colors, spacing } = useTheme();
  const unit = useAppStore((s) => s.unit);
  const setUnit = useAppStore((s) => s.setUnit);
  const compact = variant === 'compact';
  const toggle = showToggle ?? !compact;
  const metric = unit === 'metric';

  const conv = useMemo(
    () =>
      metric
        ? {
            min: Math.round(minCm),
            max: Math.round(maxCm),
            validMin: validMinCm === undefined ? undefined : Math.round(validMinCm),
            validMax: validMaxCm === undefined ? undefined : Math.round(validMaxCm),
            toCm: (v: number) => v,
            gap: compact ? 9 : 10,
            majorEvery: 10,
            midEvery: 5,
            labelFor: metricLabel,
          }
        : {
            min: cmToInches(minCm),
            max: cmToInches(maxCm),
            validMin: validMinCm === undefined ? undefined : cmToInches(validMinCm),
            validMax: validMaxCm === undefined ? undefined : cmToInches(validMaxCm),
            toCm: inchesToCm,
            gap: compact ? 14 : 16,
            majorEvery: 12,
            midEvery: 6,
            labelFor: imperialLabel,
          },
    [metric, minCm, maxCm, validMinCm, validMaxCm, compact],
  );

  const scaleValue = metric ? Math.round(valueCm) : cmToInches(valueCm);
  const { width } = useWindowDimensions();
  const small = width < 380;
  const { text, suffix } = bigNumber(valueCm, unit);
  const spoken = metric ? `${Math.round(valueCm)} centimetres` : `${text.replace("'", ' feet ').replace('"', ' inches')}`;

  const scale = (
    <RulerScale
      key={unit}
      value={scaleValue}
      min={conv.min}
      max={conv.max}
      onChange={(v) => onChangeCm(conv.toCm(v))}
      orientation={compact ? 'horizontal' : 'vertical'}
      gap={conv.gap}
      thickness={compact ? 64 : 104}
      majorEvery={conv.majorEvery}
      midEvery={conv.midEvery}
      labelFor={conv.labelFor}
      validMin={conv.validMin}
      validMax={conv.validMax}
      disabled={disabled}
      accessibilityLabel={label ? `${label} height` : 'Height'}
      accessibilityValueText={spoken}
      style={compact ? styles.compactRuler : styles.fullRuler}
    />
  );

  if (compact) {
    return (
      <View style={style}>
        <View style={[styles.compactHead, { marginBottom: spacing.sm }]}>
          {label ? <H2>{label}</H2> : <View />}
          {disabled ? (
            <H1 muted>{disabledText}</H1>
          ) : (
            <View style={styles.numberRow}>
              <H1 style={styles.tabular}>{text}</H1>
              {suffix ? <H2 muted>{suffix}</H2> : null}
            </View>
          )}
        </View>
        <View style={{ opacity: disabled ? 0.3 : 1, pointerEvents: disabled ? 'none' : 'auto' }}>
          {scale}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.fullRow, style]}>
      <View style={styles.fullLeft}>
        <View style={styles.numberRow}>
          <Display
            numberOfLines={1}
            adjustsFontSizeToFit
            accessibilityLiveRegion="polite"
            style={[
              styles.tabular,
              styles.shrink,
              metric
                ? { fontSize: small ? 76 : 92, lineHeight: small ? 80 : 96 }
                : { fontSize: small ? 64 : 72, lineHeight: small ? 72 : 80 },
            ]}>
            {text}
          </Display>
          {suffix ? <H2 muted>{suffix}</H2> : null}
        </View>
        {toggle ? (
          <View style={{ marginTop: spacing.lg }}>
            <Segmented options={UNIT_OPTIONS} value={unit} onChange={setUnit} />
          </View>
        ) : null}
      </View>
      <View style={[styles.fullRulerWrap, { borderLeftColor: colors.border }]}>{scale}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, overflow: 'hidden' },
  needle: { position: 'absolute', borderRadius: 2 },
  label: {
    position: 'absolute',
    height: 18,
    fontFamily: fontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
  },
  shrink: { flexShrink: 1 },
  tabular: { fontVariant: ['tabular-nums'] },
  numberRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  fullRow: { flex: 1, flexDirection: 'row', alignItems: 'stretch' },
  fullLeft: { flex: 1, justifyContent: 'center', paddingRight: 8 },
  fullRulerWrap: { width: 104, borderLeftWidth: StyleSheet.hairlineWidth },
  fullRuler: { flex: 1 },
  compactRuler: { height: 64, borderRadius: 12, overflow: 'hidden' },
  compactHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
});
