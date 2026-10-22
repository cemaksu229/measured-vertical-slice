import { useColorScheme } from 'react-native';

import { darkColors, fontFamily, lightColors, motion, radii, spacing, typeScale } from './tokens';

export function useTheme() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  return { colors, spacing, typeScale, radii, fontFamily, motion, isDark: scheme === 'dark' };
}
