import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { selection } from '@/lib/haptics';
import { fontFamily, motion } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { Body } from './Text';

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

const PAD = 4;

export function Segmented<T extends string>({ options, value, onChange }: Props<T>) {
  const { colors, radii } = useTheme();
  const [width, setWidth] = useState(0);
  const index = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );
  const segment = width > 0 ? (width - PAD * 2) / options.length : 0;
  const x = useSharedValue(index * segment);

  useEffect(() => {
    x.value = withTiming(index * segment, { duration: motion.base });
  }, [index, segment, x]);

  const thumb = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  return (
    <View
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      accessibilityRole="radiogroup"
      style={[styles.track, { backgroundColor: colors.border, borderRadius: radii.md + 4 }]}>
      <Animated.View
        style={[
          styles.thumb,
          { width: segment, backgroundColor: colors.surface, borderRadius: radii.md },
          thumb,
        ]}
      />
      {options.map((o) => (
        <Pressable
          key={o.value}
          accessibilityRole="radio"
          accessibilityState={{ selected: o.value === value }}
          onPress={() => {
            if (o.value === value) return;
            selection();
            onChange(o.value);
          }}
          style={styles.item}>
          <Body color={o.value === value ? colors.text : colors.textMuted} style={styles.label}>
            {o.label}
          </Body>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: 'row', padding: PAD, minHeight: 48 },
  thumb: { position: 'absolute', top: PAD, bottom: PAD, left: PAD },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 44 },
  label: { fontFamily: fontFamily.bodyMedium },
});
