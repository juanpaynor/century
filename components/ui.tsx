import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { colors, radius, shadow, spacing, type } from '@/constants/theme';

/* Text primitives ------------------------------------------------------- */

type TxtProps = {
  children: ReactNode;
  style?: TextStyle | TextStyle[];
  numberOfLines?: number;
  color?: string;
};

export const Display = ({ children, style, color, numberOfLines }: TxtProps) => (
  <Text numberOfLines={numberOfLines} style={[type.display, { color: color ?? colors.ink }, style]}>
    {children}
  </Text>
);

export const Title = ({ children, style, color, numberOfLines }: TxtProps) => (
  <Text numberOfLines={numberOfLines} style={[type.title, { color: color ?? colors.ink }, style]}>
    {children}
  </Text>
);

export const SectionTitle = ({ children, style, color, numberOfLines }: TxtProps) => (
  <Text numberOfLines={numberOfLines} style={[type.section, { color: color ?? colors.ink }, style]}>
    {children}
  </Text>
);

export const Body = ({ children, style, color, numberOfLines }: TxtProps) => (
  <Text numberOfLines={numberOfLines} style={[type.body, { color: color ?? colors.inkMuted }, style]}>
    {children}
  </Text>
);

export const BodyStrong = ({ children, style, color, numberOfLines }: TxtProps) => (
  <Text numberOfLines={numberOfLines} style={[type.bodyStrong, { color: color ?? colors.ink }, style]}>
    {children}
  </Text>
);

export const Small = ({ children, style, color, numberOfLines }: TxtProps) => (
  <Text numberOfLines={numberOfLines} style={[type.small, { color: color ?? colors.inkMuted }, style]}>
    {children}
  </Text>
);

export const Caption = ({ children, style, color, numberOfLines }: TxtProps) => (
  <Text
    numberOfLines={numberOfLines}
    style={[type.caption, { color: color ?? colors.inkFaint, textTransform: 'uppercase' }, style]}>
    {children}
  </Text>
);

/* Layout ---------------------------------------------------------------- */

export function Card({
  children,
  style,
  onPress,
  padded = true,
}: {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
  onPress?: () => void;
  padded?: boolean;
}) {
  const content = (
    <View style={[s.card, padded && { padding: spacing.lg }, style]}>{children}</View>
  );
  if (!onPress) return content;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && s.pressed}>
      {content}
    </Pressable>
  );
}

export function SectionHeader({
  title,
  action,
  onAction,
  style,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
  style?: ViewStyle;
}) {
  return (
    <View style={[s.sectionHeader, style]}>
      <SectionTitle>{title}</SectionTitle>
      {action ? (
        <Pressable onPress={onAction} hitSlop={10} style={({ pressed }) => pressed && s.pressed}>
          <Text style={[type.small, { color: colors.gold, fontWeight: '700' }]}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export const Divider = ({ style }: { style?: ViewStyle }) => <View style={[s.divider, style]} />;

/* Controls -------------------------------------------------------------- */

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled,
  style,
  full,
}: {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'gold';
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  style?: ViewStyle;
  full?: boolean;
}) {
  const palette = {
    primary: { bg: colors.maroon, fg: '#FFFFFF', border: colors.maroon },
    gold: { bg: colors.gold, fg: '#FFFFFF', border: colors.gold },
    secondary: { bg: colors.surface, fg: colors.maroon, border: colors.lineStrong },
    ghost: { bg: 'transparent', fg: colors.maroon, border: 'transparent' },
  }[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        s.button,
        {
          backgroundColor: palette.bg,
          borderColor: palette.border,
          opacity: disabled ? 0.4 : pressed ? 0.85 : 1,
        },
        full && { alignSelf: 'stretch' },
        style,
      ]}>
      {icon ? <Ionicons name={icon} size={17} color={palette.fg} /> : null}
      <Text style={[type.bodyStrong, { color: palette.fg }]}>{label}</Text>
    </Pressable>
  );
}

export function Chip({
  label,
  active,
  onPress,
  icon,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        s.chip,
        active && { backgroundColor: colors.maroon, borderColor: colors.maroon },
        pressed && s.pressed,
      ]}>
      {icon ? (
        <Ionicons name={icon} size={14} color={active ? '#FFFFFF' : colors.inkMuted} />
      ) : null}
      <Text
        style={[
          type.small,
          { fontWeight: '600', color: active ? '#FFFFFF' : colors.inkMuted },
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function Tag({ label, tone = 'maroon' }: { label: string; tone?: 'maroon' | 'gold' | 'muted' }) {
  const palette = {
    maroon: { bg: colors.maroonSoft, fg: colors.maroon },
    gold: { bg: colors.goldSoft, fg: colors.gold },
    muted: { bg: colors.surfaceAlt, fg: colors.inkMuted },
  }[tone];
  return (
    <View style={[s.tag, { backgroundColor: palette.bg }]}>
      <Text style={[type.caption, { color: palette.fg }]}>{label.toUpperCase()}</Text>
    </View>
  );
}

/** Icon in a soft square — used for quick actions and service requests. */
export function IconTile({
  icon,
  tone = 'maroon',
  size = 44,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  tone?: 'maroon' | 'gold';
  size?: number;
}) {
  const palette =
    tone === 'gold'
      ? { bg: colors.goldSoft, fg: colors.gold }
      : { bg: colors.maroonSoft, fg: colors.maroon };
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: radius.md,
        backgroundColor: palette.bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Ionicons name={icon} size={size * 0.48} color={palette.fg} />
    </View>
  );
}

/** Bottom-anchored bar for primary actions on detail screens. */
export function ActionBar({ children }: { children: ReactNode }) {
  return (
    <View style={s.actionBar}>
      <LinearGradient
        colors={['rgba(250,247,242,0)', colors.bg]}
        style={s.actionBarFade}
        pointerEvents="none"
      />
      <View style={s.actionBarInner}>{children}</View>
    </View>
  );
}

export function EmptyState({
  icon,
  title,
  detail,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  detail: string;
}) {
  return (
    <View style={s.empty}>
      <IconTile icon={icon} size={56} />
      <SectionTitle style={{ marginTop: spacing.lg, textAlign: 'center' }}>{title}</SectionTitle>
      <Body style={{ marginTop: spacing.xs, textAlign: 'center' }}>{detail}</Body>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow.card,
  },
  pressed: { opacity: 0.7 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  divider: { height: 1, backgroundColor: colors.line },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  actionBar: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  actionBarFade: { height: 28 },
  actionBarInner: {
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl + spacing.md,
    borderTopWidth: 0,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
  },
});
