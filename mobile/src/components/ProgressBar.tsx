import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useTheme } from '@/theme/useTheme';

type Props = {
  progress: number;
};

export function ProgressBar({ progress }: Props) {
  const { colors, radii } = useTheme();
  const value = useSharedValue(progress);

  useEffect(() => {
    value.value = withTiming(Math.min(Math.max(progress, 0), 1), { duration: 300 });
  }, [progress, value]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${value.value * 100}%` }));

  return (
    <View style={[styles.track, { backgroundColor: colors.border, borderRadius: radii.pill }]}>
      <Animated.View
        style={[styles.fill, { backgroundColor: colors.brand, borderRadius: radii.pill }, fillStyle]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 4, overflow: 'hidden' },
  fill: { height: '100%' },
});
