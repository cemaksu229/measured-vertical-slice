import { Text as RNText, type StyleProp, type TextProps, type TextStyle } from 'react-native';

import { useTheme } from '@/theme/useTheme';

export type TypeProps = TextProps & {
  /** Overrides the themed colour. */
  color?: string;
  /** Uses the muted text colour. Ignored when `color` is set. */
  muted?: boolean;
  align?: TextStyle['textAlign'];
  style?: StyleProp<TextStyle>;
};

type Variant = 'display' | 'h1' | 'h2' | 'body' | 'caption';

function make(variant: Variant, displayName: string) {
  const Component = ({ color, muted, align, style, ...rest }: TypeProps) => {
    const { colors, typeScale } = useTheme();
    const resolved = color ?? (muted || variant === 'caption' ? colors.textMuted : colors.text);
    return (
      <RNText
        accessibilityRole={variant === 'h1' || variant === 'h2' ? 'header' : undefined}
        {...rest}
        style={[typeScale[variant], { color: resolved, textAlign: align }, style]}
      />
    );
  };
  Component.displayName = displayName;
  return Component;
}

export const Display = make('display', 'Display');
export const H1 = make('h1', 'H1');
export const H2 = make('h2', 'H2');
export const Body = make('body', 'Body');
/** Muted by default; pass `color` to override. */
export const Caption = make('caption', 'Caption');
