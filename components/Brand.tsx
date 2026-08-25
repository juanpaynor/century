import { Platform, StyleSheet, Text, View, type TextStyle, type ViewStyle } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors } from '@/constants/theme';

/**
 * NOTE — the P monogram below is a hand-traced SVG approximation of the real
 * Century Park mark, built so the prototype has correct-looking branding today.
 * Drop the official artwork at assets/brand/mark.svg (or .png) and swap
 * <ParkMark> for an <Image> before this goes anywhere near the client.
 */

/** Serif face for the heritage wordmark; system serif on both platforms. */
export const serif = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'Georgia, "Times New Roman", serif',
});

export function ParkMark({
  size = 40,
  variant = 'badge',
}: {
  size?: number;
  /** badge = gold on the red disc · gold = gold on dark · solid = maroon on light */
  variant?: 'badge' | 'gold' | 'solid';
}) {
  const ring =
    variant === 'badge' ? colors.gold : variant === 'gold' ? colors.gold : colors.maroon;
  const fill = ring;

  return (
    <Svg width={size} height={size} viewBox="0 0 120 120">
      {variant === 'badge' ? <Circle cx={60} cy={60} r={59} fill={colors.logoRed} /> : null}
      <Circle
        cx={60}
        cy={60}
        r={variant === 'badge' ? 47 : 54}
        stroke={ring}
        strokeWidth={variant === 'badge' ? 5 : 4}
        fill="none"
      />
      {/* Half-disc: flat vertical edge on the centreline, bulging right. */}
      <Path
        d={
          variant === 'badge'
            ? 'M 60,22 A 38,38 0 0 1 60,98 Z'
            : 'M 60,17 A 43,43 0 0 1 60,103 Z'
        }
        fill={fill}
      />
    </Svg>
  );
}

/** "Century Park Hotel" lockup — mark plus serif wordmark. */
export function Wordmark({
  size = 'md',
  onDark = false,
  showMark = true,
  style,
}: {
  size?: 'sm' | 'md' | 'lg';
  onDark?: boolean;
  showMark?: boolean;
  style?: ViewStyle;
}) {
  const scale = { sm: 0.8, md: 1, lg: 1.35 }[size];
  const ink = onDark ? colors.onDark : colors.ink;

  return (
    <View style={[s.lockup, { gap: 8 * scale }, style]}>
      {showMark ? <ParkMark size={26 * scale} variant={onDark ? 'gold' : 'badge'} /> : null}
      <Text
        style={[
          s.wordmark,
          { fontSize: 17 * scale, color: ink, letterSpacing: -0.2 * scale },
        ]}>
        Century Park Hotel
      </Text>
    </View>
  );
}

/** Wide-tracked gold "ELITE CARD" lettering from the physical card. */
export function EliteWordmark({ scale = 1, align = 'flex-start' }: { scale?: number; align?: ViewStyle['alignItems'] }) {
  return (
    <View style={{ alignItems: align }}>
      <Text
        style={[
          s.elite,
          { fontSize: 26 * scale, letterSpacing: 7 * scale, color: colors.goldLight },
        ]}>
        ELITE
      </Text>
      <Text
        style={[
          s.elite,
          {
            fontSize: 11 * scale,
            letterSpacing: 6.5 * scale,
            color: colors.gold,
            marginTop: 2 * scale,
          },
        ]}>
        CARD
      </Text>
    </View>
  );
}

/** Golden-anniversary roundel — 1976–2026. */
export function AnniversaryMark({ size = 56 }: { size?: number }) {
  return (
    <View
      style={[
        s.anniversary,
        { width: size, height: size, borderRadius: size / 2, borderWidth: size * 0.03 },
      ]}>
      <Text style={[s.anniversaryNum, { fontSize: size * 0.36 }]}>50</Text>
      <Text style={[s.anniversaryLabel, { fontSize: size * 0.1, letterSpacing: size * 0.02 }]}>
        YEARS
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  lockup: { flexDirection: 'row', alignItems: 'center' },
  wordmark: { fontFamily: serif, fontWeight: '700' } as TextStyle,
  elite: { fontFamily: serif, fontWeight: '400' } as TextStyle,
  anniversary: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.gold,
    backgroundColor: colors.maroon,
  },
  anniversaryNum: {
    fontFamily: serif,
    color: colors.goldLight,
    fontWeight: '700',
    lineHeight: undefined,
  } as TextStyle,
  anniversaryLabel: { fontFamily: serif, color: colors.gold, marginTop: -2 } as TextStyle,
});
