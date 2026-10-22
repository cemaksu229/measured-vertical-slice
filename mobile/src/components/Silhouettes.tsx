import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Rect } from 'react-native-svg';

import { formatHeight } from '@/logic/height';
import type { Unit } from '@/store/useAppStore';
import { fontFamily } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { PressableScale } from './PressableScale';
import { Body, Caption } from './Text';

export type SilhouetteItem = {
  key: string;
  label: string;
  /** null draws a dashed outline captioned "Unknown". */
  heightCm: number | null;
  /** Height used to size the outline when `heightCm` is null. */
  assumedCm?: number;
  tone: 'parent' | 'now' | 'predicted';
};

type Props = {
  items: readonly SilhouetteItem[];
  unit: Unit;
  /** Tapping the figures calls this, typically to flip cm / ft-in. */
  onPress?: () => void;
  /** Pixel height of the tallest figure. */
  chartHeight?: number;
  /** Colour that sits behind the figures; used to hollow out dashed outlines. */
  backgroundColor?: string;
  delay?: number;
};

// Figure drawn in a 60 x 180 box.
const VIEW_W = 60;
const VIEW_H = 180;

function Figure({
  height,
  fill,
  stroke,
  dashed,
  hollow,
}: {
  height: number;
  fill: string;
  stroke: string;
  dashed: boolean;
  hollow: string;
}) {
  const width = (height * VIEW_W) / VIEW_H;
  const shapes = (paint: { fill?: string; stroke?: string }) => (
    <>
      <Circle cx={30} cy={14} r={12} {...paint} />
      <Rect x={12} y={29} width={36} height={64} rx={15} {...paint} />
      <Rect x={3} y={33} width={9} height={52} rx={4.5} {...paint} />
      <Rect x={48} y={33} width={9} height={52} rx={4.5} {...paint} />
      <Rect x={14} y={84} width={15} height={95} rx={7} {...paint} />
      <Rect x={31} y={84} width={15} height={95} rx={7} {...paint} />
    </>
  );
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}>
      {dashed ? (
        <>
          {/* Dashed strokes first, then a background fill hides the inner overlaps. */}
          {shapes({ stroke, fill: 'none' })}
          {shapes({ fill: hollow })}
        </>
      ) : (
        shapes({ fill })
      )}
    </Svg>
  );
}

function Column({
  item,
  index,
  scale,
  chartHeight,
  unit,
  delay,
  backgroundColor,
}: {
  item: SilhouetteItem;
  index: number;
  scale: number;
  chartHeight: number;
  unit: Unit;
  delay: number;
  backgroundColor: string;
}) {
  const { colors } = useTheme();
  const reduced = useReducedMotion();
  const grow = useSharedValue(reduced ? 1 : 0);

  useEffect(() => {
    if (reduced) return;
    grow.set(
      withDelay(delay + index * 140, withTiming(1, { duration: 520, easing: Easing.out(Easing.cubic) })),
    );
  }, [delay, index, reduced, grow]);

  const style = useAnimatedStyle(() => ({
    opacity: grow.get(),
    transform: [{ scaleY: 0.55 + 0.45 * grow.get() }],
  }));

  const unknown = item.heightCm === null;
  const cm = item.heightCm ?? item.assumedCm ?? 0;
  const figureHeight = Math.round(cm * scale);

  const fill =
    item.tone === 'predicted' ? colors.accent : item.tone === 'now' ? colors.text : colors.border;
  const stroke = unknown ? colors.textMuted : fill;

  return (
    <View style={styles.column}>
      <View style={[styles.figureSlot, { height: chartHeight }]}>
        <Animated.View style={[styles.figure, { transformOrigin: 'bottom' }, style]}>
          <Figure
            height={figureHeight}
            fill={fill}
            stroke={stroke}
            dashed={unknown}
            hollow={backgroundColor}
          />
        </Animated.View>
      </View>
      <View style={[styles.ground, { backgroundColor: colors.border }]} />
      <Caption align="center" style={styles.label}>
        {item.label}
      </Caption>
      <Body align="center" style={styles.value} muted={unknown}>
        {unknown ? 'Unknown' : formatHeight(item.heightCm as number, unit)}
      </Body>
    </View>
  );
}

/** Scaled human figures on a shared baseline. Heights are drawn to the true ratio. */
export function Silhouettes({
  items,
  unit,
  onPress,
  chartHeight = 190,
  backgroundColor,
  delay = 0,
}: Props) {
  const { colors } = useTheme();
  const tallest = Math.max(...items.map((i) => i.heightCm ?? i.assumedCm ?? 0), 1);
  const scale = chartHeight / tallest;
  const summary = items
    .map((i) => `${i.label} ${i.heightCm === null ? 'unknown' : formatHeight(i.heightCm, unit)}`)
    .join(', ');

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`Heights: ${summary}. Tap to switch units.`}
      onPress={onPress}
      disabled={!onPress}
      scaleTo={0.99}>
      <View style={styles.row}>
        {items.map((item, index) => (
          <Column
            key={item.key}
            item={item}
            index={index}
            scale={scale}
            chartHeight={chartHeight}
            unit={unit}
            delay={delay}
            backgroundColor={backgroundColor ?? colors.surface}
          />
        ))}
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  column: { flex: 1, alignItems: 'center' },
  figureSlot: { justifyContent: 'flex-end', alignItems: 'center', alignSelf: 'stretch' },
  figure: { alignItems: 'center' },
  ground: { height: 2, alignSelf: 'stretch', marginHorizontal: 6 },
  label: { marginTop: 8, minHeight: 36 },
  value: { fontFamily: fontFamily.bodySemibold },
});
