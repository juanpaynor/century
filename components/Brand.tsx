import { Image } from 'expo-image';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  type ImageStyle,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { colors } from '@/constants/theme';

/**
 * Brand marks — all real client artwork, cropped to tight bounds in
 * assets/brand/. Aspect ratios are baked in so callers only set one dimension.
 */

const MARK = require('@/assets/brand/mark.png');
const MARK_GOLD = require('@/assets/brand/mark-gold.png');
const LOCKUP_LIGHT = require('@/assets/brand/lockup-light.png');

const AR = {
  mark: 300 / 299,
  markGold: 233 / 277,
  lockup: 457 / 252,
} as const;

/** Serif face for headings; system serif on both platforms. */
export const serif = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'Georgia, "Times New Roman", serif',
});

/** The circular P mark, red disc and all. */
export function ParkMark({ size = 40, style }: { size?: number; style?: ImageStyle }) {
  return (
    <Image
      source={MARK}
      style={[{ width: size, height: size / AR.mark }, style]}
      contentFit="contain"
      transition={0}
    />
  );
}

/** Gold-only comma, as it appears on the physical Elite Card. */
export function ParkMarkGold({
  size = 40,
  opacity = 1,
  style,
}: {
  size?: number;
  opacity?: number;
  style?: ImageStyle;
}) {
  return (
    <Image
      source={MARK_GOLD}
      style={[{ width: size, height: size / AR.markGold, opacity }, style]}
      contentFit="contain"
      transition={0}
    />
  );
}

/**
 * Full stacked lockup — mark, "Century Park Hotel", rule, "MANILA".
 * The supplied artwork has WHITE type, so this only works on dark or
 * photographic ground. There is no dark-type version.
 */
export function Lockup({ width = 200, style }: { width?: number; style?: ImageStyle }) {
  return (
    <Image
      source={LOCKUP_LIGHT}
      style={[{ width, height: width / AR.lockup }, style]}
      contentFit="contain"
      transition={0}
    />
  );
}

/** Horizontal mark + name, for compact bars. `onDark` picks the type colour. */
export function Wordmark({
  size = 'md',
  onDark = false,
  style,
}: {
  size?: 'sm' | 'md' | 'lg';
  onDark?: boolean;
  style?: ViewStyle;
}) {
  const scale = { sm: 0.85, md: 1, lg: 1.3 }[size];
  return (
    <View style={[s.lockup, { gap: 9 * scale }, style]}>
      <ParkMark size={25 * scale} />
      <Text
        style={[
          s.wordmark,
          {
            fontSize: 16 * scale,
            color: onDark ? colors.onDark : colors.ink,
            letterSpacing: -0.2,
          },
        ]}>
        Century Park Hotel
      </Text>
    </View>
  );
}

/** Wide-tracked gold "ELITE CARD" lettering from the physical card. */
export function EliteWordmark({
  scale = 1,
  align = 'flex-start',
}: {
  scale?: number;
  align?: ViewStyle['alignItems'];
}) {
  return (
    <View style={{ alignItems: align }}>
      <Text
        style={[s.elite, { fontSize: 26 * scale, letterSpacing: 7 * scale, color: colors.goldLight }]}>
        ELITE
      </Text>
      <Text
        style={[
          s.elite,
          { fontSize: 11 * scale, letterSpacing: 6.5 * scale, color: colors.gold, marginTop: 2 * scale },
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
        { width: size, height: size, borderRadius: size / 2, borderWidth: Math.max(1, size * 0.03) },
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
    backgroundColor: 'transparent',
  },
  anniversaryNum: { fontFamily: serif, color: colors.goldLight, fontWeight: '700' } as TextStyle,
  anniversaryLabel: { fontFamily: serif, color: colors.gold, marginTop: -2 } as TextStyle,
});
