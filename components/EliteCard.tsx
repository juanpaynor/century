import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import { colors, gradients, radius, shadow, spacing } from '@/constants/theme';
import { EliteWordmark, ParkMarkGold, serif, Wordmark } from './Brand';

/**
 * Digital twin of the physical Elite Card: faceted maroon ground, gold
 * lettering, oversized P monogram bleeding off the right edge.
 */

const W = 340;
const H = 214;

/** Deterministic low-poly facets — mirrors the crumpled-foil print texture. */
const FACETS: { points: string; fill: string; opacity: number }[] = [
  { points: '0,0 96,0 44,58', fill: '#FFFFFF', opacity: 0.05 },
  { points: '96,0 176,0 128,52', fill: '#000000', opacity: 0.1 },
  { points: '44,58 96,0 128,52', fill: '#FFFFFF', opacity: 0.03 },
  { points: '176,0 262,0 214,44', fill: '#FFFFFF', opacity: 0.06 },
  { points: '262,0 340,0 340,62 296,40', fill: '#000000', opacity: 0.12 },
  { points: '0,0 44,58 0,104', fill: '#000000', opacity: 0.08 },
  { points: '44,58 128,52 92,124', fill: '#000000', opacity: 0.07 },
  { points: '128,52 214,44 186,110', fill: '#FFFFFF', opacity: 0.04 },
  { points: '214,44 296,40 268,116', fill: '#000000', opacity: 0.09 },
  { points: '0,104 44,58 92,124 30,166', fill: '#FFFFFF', opacity: 0.035 },
  { points: '92,124 186,110 150,180', fill: '#000000', opacity: 0.06 },
  { points: '186,110 268,116 240,190', fill: '#FFFFFF', opacity: 0.045 },
  { points: '268,116 340,62 340,158', fill: '#000000', opacity: 0.1 },
  { points: '0,166 30,166 78,214 0,214', fill: '#000000', opacity: 0.11 },
  { points: '30,166 150,180 118,214 78,214', fill: '#FFFFFF', opacity: 0.03 },
  { points: '150,180 240,190 214,214 118,214', fill: '#000000', opacity: 0.07 },
  { points: '240,190 340,158 340,214 214,214', fill: '#FFFFFF', opacity: 0.04 },
];

export function EliteCard({
  memberNo,
  name,
  since,
  style,
  compact = false,
}: {
  memberNo: string;
  name: string;
  /** Year joined — the card has no tiers, so this fills the corner. */
  since: number;
  style?: ViewStyle;
  compact?: boolean;
}) {
  return (
    <View style={[s.shell, compact && s.compact, style]}>
      <LinearGradient
        colors={gradients.card}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Faceted foil texture */}
      <Svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        style={StyleSheet.absoluteFill}>
        {FACETS.map((f, i) => (
          <Polygon key={i} points={f.points} fill={f.fill} fillOpacity={f.opacity} />
        ))}
      </Svg>

      {/* Oversized monogram, bleeding off the right edge */}
      <View style={s.monogram} pointerEvents="none">
        <ParkMarkGold size={compact ? 128 : 176} opacity={0.9} />
      </View>

      <View style={[s.content, compact && { padding: spacing.lg }]}>
        <Wordmark size="sm" onDark />

        <View style={{ marginTop: compact ? spacing.sm : spacing.lg }}>
          <EliteWordmark scale={compact ? 0.72 : 1} />
        </View>

        <View style={s.footer}>
          <View>
            <Text style={s.memberNo}>{memberNo}</Text>
            <Text style={s.memberName}>{name.toUpperCase()}</Text>
          </View>
          <View style={s.sincePill}>
            <Text style={s.sinceText}>MEMBER SINCE {since}</Text>
          </View>
        </View>
      </View>

      {/* Gold hairline edge */}
      <View style={s.edge} pointerEvents="none" />
    </View>
  );
}

const s = StyleSheet.create({
  shell: {
    aspectRatio: W / H,
    borderRadius: radius.card,
    overflow: 'hidden',
    backgroundColor: colors.maroon,
    ...shadow.lifted,
  },
  compact: { borderRadius: radius.md },
  content: { flex: 1, padding: spacing.xl, justifyContent: 'flex-start' },
  monogram: {
    position: 'absolute',
    right: -46,
    top: '50%',
    transform: [{ translateY: -102 }],
    opacity: 0.85,
  },
  footer: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  memberNo: {
    fontFamily: serif,
    fontSize: 15,
    letterSpacing: 2.5,
    color: colors.goldPale,
  },
  memberName: {
    fontSize: 10,
    letterSpacing: 1.6,
    fontWeight: '700',
    color: colors.onDarkMuted,
    marginTop: 3,
  },
  sincePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(228,199,102,0.55)',
    backgroundColor: 'rgba(201,162,39,0.16)',
  },
  sinceText: {
    fontSize: 9.5,
    letterSpacing: 1.4,
    fontWeight: '800',
    color: colors.goldLight,
  },
  edge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: 'rgba(228,199,102,0.32)',
  },
});
