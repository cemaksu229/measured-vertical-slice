import type { ReactElement } from 'react';
import { StyleSheet } from 'react-native';

import { selection } from '@/lib/haptics';

import { PressableScale } from './PressableScale';

type Props = {
  /** Required for screen readers, e.g. "Close". */
  accessibilityLabel: string;
  onPress: () => void;
  /** A Phosphor icon element, e.g. <X size={22} weight="bold" color={colors.text} />. */
  icon: ReactElement;
};

export function IconButton({ accessibilityLabel, onPress, icon }: Props) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={() => {
        selection();
        onPress();
      }}
      style={styles.base}>
      {icon}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});
