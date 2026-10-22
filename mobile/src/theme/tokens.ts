export const lightColors = {
  brand: '#FF5A1F',
  accent: '#C6F25B',
  bg: '#F6F4EF',
  surface: '#FFFFFF',
  text: '#141414',
  textMuted: '#6B6B6B',
  border: '#E3E0D8',
  danger: '#E5484D',
  success: '#C6F25B',
  onBrand: '#FFFFFF',
  onAccent: '#141414',
};

export type Colors = typeof lightColors;

export const darkColors: Colors = {
  brand: '#FF5A1F',
  accent: '#C6F25B',
  bg: '#141414',
  surface: '#1E1E1E',
  text: '#F6F4EF',
  textMuted: '#A3A3A3',
  border: '#333333',
  danger: '#E5484D',
  success: '#C6F25B',
  onBrand: '#FFFFFF',
  onAccent: '#141414',
};

export const fontFamily = {
  displaySemibold: 'ClashDisplay-Semibold',
  displayMedium: 'ClashDisplay-Medium',
  bodyRegular: 'GeneralSans-Regular',
  bodyMedium: 'GeneralSans-Medium',
  bodySemibold: 'GeneralSans-Semibold',
} as const;

export const fontAssets = {
  [fontFamily.displaySemibold]: require('../../assets/fonts/ClashDisplay-Semibold.otf'),
  [fontFamily.displayMedium]: require('../../assets/fonts/ClashDisplay-Medium.otf'),
  [fontFamily.bodyRegular]: require('../../assets/fonts/GeneralSans-Regular.otf'),
  [fontFamily.bodyMedium]: require('../../assets/fonts/GeneralSans-Medium.otf'),
  [fontFamily.bodySemibold]: require('../../assets/fonts/GeneralSans-Semibold.otf'),
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
  huge: 64,
};

export const typeScale = {
  display: { fontFamily: fontFamily.displaySemibold, fontSize: 64, lineHeight: 64 },
  h1: { fontFamily: fontFamily.displaySemibold, fontSize: 34, lineHeight: 38 },
  h2: { fontFamily: fontFamily.displaySemibold, fontSize: 26, lineHeight: 30 },
  body: { fontFamily: fontFamily.bodyRegular, fontSize: 17, lineHeight: 24 },
  caption: { fontFamily: fontFamily.bodyRegular, fontSize: 13, lineHeight: 18 },
  button: { fontFamily: fontFamily.bodySemibold, fontSize: 17, lineHeight: 20 },
} as const;

export const radii = {
  md: 12,
  lg: 20,
  pill: 999,
};

export const motion = {
  fast: 150,
  base: 250,
  countUp: 800,
};
