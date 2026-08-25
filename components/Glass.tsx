import { BlurView } from 'expo-blur';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { Platform, StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native';

/**
 * Liquid Glass where the OS supports it (iOS 26+), system blur on older iOS,
 * and a plain translucent fill on Android and web.
 *
 * Only worth using over photography or dark ground — on the cream background
 * it reads as a flat panel, so prefer <Card> there.
 */

export const liquidGlass = Platform.OS === 'ios' && isLiquidGlassAvailable();

type Props = ViewProps & {
  /** 'clear' is more transparent; 'regular' has more frost. */
  glassStyle?: 'clear' | 'regular';
  tint?: string;
  /** Fallback blur intensity for pre-iOS 26. */
  intensity?: number;
  interactive?: boolean;
  style?: ViewStyle | ViewStyle[];
};

export function Glass({
  children,
  glassStyle = 'regular',
  tint,
  intensity = 28,
  interactive = false,
  style,
  ...rest
}: Props) {
  if (liquidGlass) {
    return (
      <GlassView
        glassEffectStyle={glassStyle}
        tintColor={tint}
        isInteractive={interactive}
        style={style}
        {...rest}>
        {children}
      </GlassView>
    );
  }

  if (Platform.OS === 'ios') {
    return (
      <BlurView intensity={intensity} tint="light" style={style} {...rest}>
        {children}
      </BlurView>
    );
  }

  return (
    <View style={[styles.fallback, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.28)',
  },
});
