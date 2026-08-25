import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnniversaryMark, ParkMark, Wordmark, serif } from '@/components/Brand';
import { Glass } from '@/components/Glass';
import { EliteCard } from '@/components/EliteCard';
import {
  Body,
  BodyStrong,
  Caption,
  Card,
  IconTile,
  SectionHeader,
  Small,
  Tag,
  Title,
} from '@/components/ui';
import { anniversary, colors, gradients, peso, radius, shadow, spacing } from '@/constants/theme';
import { amenities, hotel, member, outlets, promos, stay } from '@/data/hotel';
import { useApp } from '@/data/store';

const QUICK_ACTIONS = [
  { id: 'key', label: 'Digital Key', icon: 'key-outline' as const, href: '/digital-key' },
  { id: 'dine', label: 'Room Service', icon: 'restaurant-outline' as const, href: '/(tabs)/dine' },
  { id: 'house', label: 'Housekeeping', icon: 'sparkles-outline' as const, href: '/(tabs)/stay' },
  { id: 'book', label: 'Book a Room', icon: 'bed-outline' as const, href: '/(tabs)/rooms' },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { logRequest } = useApp();

  const promoW = width - spacing.xl * 2;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.xxxl }}>
        {/* ── Hero ── */}
        <View style={s.hero}>
          <Image source={{ uri: hotel.hero }} style={StyleSheet.absoluteFill} contentFit="cover" />
          <LinearGradient
            colors={['rgba(74,12,23,0.82)', 'rgba(74,12,23,0.35)', 'rgba(26,18,20,0.9)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={[s.heroInner, { paddingTop: insets.top + spacing.md }]}>
            <View style={s.heroTop}>
              <Wordmark size="sm" onDark />
              <View style={s.heroActions}>
                <Glass glassStyle="clear" style={s.heroPill}>
                  <Text style={s.heroPillText}>{anniversary.years} YEARS</Text>
                </Glass>
                <Pressable
                  hitSlop={10}
                  onPress={() => router.push('/(tabs)/stay')}>
                  {({ pressed }) => (
                    <Glass
                      glassStyle="clear"
                      interactive
                      style={[s.bell, pressed && { opacity: 0.7 }]}>
                      <Ionicons name="notifications-outline" size={19} color={colors.onDark} />
                      <View style={s.bellDot} />
                    </Glass>
                  )}
                </Pressable>
              </View>
            </View>

            <View style={s.heroCopy}>
              <Caption color={colors.goldLight}>{hotel.address}</Caption>
              <Text style={s.heroTitle}>
                {greeting()},{'\n'}
                {member.firstName}.
              </Text>
              <Body color={colors.onDarkMuted} style={{ marginTop: spacing.sm }}>
                {hotel.blurb}
              </Body>
            </View>
          </View>
        </View>

        {/* ── Current stay ── */}
        <View style={s.body}>
          {stay.active ? (
            <Card style={s.stayCard} padded={false}>
              <View style={s.stayTop}>
                <View style={{ flex: 1 }}>
                  <Caption color={colors.gold}>Currently checked in</Caption>
                  <Title style={{ marginTop: 4 }}>Room {stay.room}</Title>
                  <Small style={{ marginTop: 2 }}>
                    {stay.roomType} · {stay.checkIn} – {stay.checkOut} · {stay.guests} guests
                  </Small>
                </View>
                <Pressable
                  onPress={() => router.push('/digital-key')}
                  style={({ pressed }) => [s.keyBtn, pressed && { opacity: 0.85 }]}>
                  <Ionicons name="key" size={20} color={colors.onDark} />
                  <Text style={s.keyBtnText}>Unlock</Text>
                </Pressable>
              </View>
              <View style={s.stayDivider} />
              <Pressable
                onPress={() => router.push('/(tabs)/stay')}
                style={({ pressed }) => [s.stayFooter, pressed && { opacity: 0.7 }]}>
                <Small>Folio balance</Small>
                <View style={s.row}>
                  <BodyStrong>
                    {peso(stay.folio.reduce((n, f) => n + f.amount, 0))}
                  </BodyStrong>
                  <Ionicons name="chevron-forward" size={15} color={colors.inkFaint} />
                </View>
              </Pressable>
            </Card>
          ) : null}

          {/* ── Quick actions ── */}
          <View style={s.quickGrid}>
            {QUICK_ACTIONS.map((a) => (
              <Pressable
                key={a.id}
                onPress={() => {
                  if (a.id === 'house') logRequest('Housekeeping', 'sparkles-outline');
                  router.push(a.href as never);
                }}
                style={({ pressed }) => [s.quickItem, pressed && { opacity: 0.65 }]}>
                <IconTile icon={a.icon} tone="maroon" size={50} />
                <Small color={colors.ink} style={{ fontWeight: '600', textAlign: 'center' }}>
                  {a.label}
                </Small>
              </Pressable>
            ))}
          </View>

          {/* ── Elite Card ── */}
          <SectionHeader
            title="Your Elite Card"
            action="Open"
            onAction={() => router.push('/(tabs)/elite')}
            style={{ marginTop: spacing.xl }}
          />
          <Pressable
            onPress={() => router.push('/(tabs)/elite')}
            style={({ pressed }) => pressed && { opacity: 0.9 }}>
            <EliteCard
              compact
              memberNo={member.memberNo}
              name={`${member.firstName} ${member.lastName}`}
              tier={member.tier}
            />
          </Pressable>
          <View style={s.pointsRow}>
            <View>
              <Caption>Points balance</Caption>
              <Text style={s.pointsValue}>{member.points.toLocaleString('en-PH')}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Caption>Saved this year</Caption>
              <Text style={[s.pointsValue, { color: colors.gold }]}>{peso(member.ytdSaved)}</Text>
            </View>
          </View>
        </View>

        {/* ── Promos ── */}
        <SectionHeader title="What's on" style={{ marginTop: spacing.xl, ...s.bodyPad }} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={promoW + spacing.md}
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: spacing.xl, gap: spacing.md }}>
          {promos.map((p) => (
            <View key={p.id} style={[s.promo, { width: promoW }]}>
              <Image source={{ uri: p.image }} style={StyleSheet.absoluteFill} contentFit="cover" />
              <LinearGradient colors={gradients.scrim} style={StyleSheet.absoluteFill} />
              <View style={s.promoCopy}>
                <BodyStrong color={colors.onDark} numberOfLines={1}>
                  {p.title}
                </BodyStrong>
                <Small color={colors.onDarkMuted} numberOfLines={1}>
                  {p.sub}
                </Small>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* ── 50th anniversary ── */}
        <View style={[s.body, { marginTop: spacing.xl }]}>
          <View style={s.anniversary}>
            <LinearGradient
              colors={gradients.maroonWash}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={{ flex: 1 }}>
              <Caption color={colors.goldLight}>
                {anniversary.founded} — {anniversary.year}
              </Caption>
              <Text style={s.anniversaryTitle}>Fifty years{'\n'}on Ocampo Street</Text>
              <Body color={colors.onDarkMuted} style={{ marginTop: spacing.sm }}>
                Golden anniversary offers running all year for Elite members.
              </Body>
            </View>
            <AnniversaryMark size={78} />
          </View>
        </View>

        {/* ── Dining ── */}
        <SectionHeader
          title="Dining"
          action="All outlets"
          onAction={() => router.push('/(tabs)/dine')}
          style={{ marginTop: spacing.xl, ...s.bodyPad }}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing.xl, gap: spacing.md }}>
          {outlets.map((o) => (
            <Pressable
              key={o.id}
              onPress={() => router.push(`/outlet/${o.id}` as never)}
              style={({ pressed }) => [s.outlet, pressed && { opacity: 0.8 }]}>
              <Image source={{ uri: o.image }} style={s.outletImg} contentFit="cover" />
              <View style={{ padding: spacing.md, gap: 2 }}>
                <BodyStrong numberOfLines={1}>{o.name}</BodyStrong>
                <Small numberOfLines={1}>{o.kind}</Small>
                <View style={{ marginTop: spacing.xs }}>
                  <Tag label={o.eliteDiscount} tone="gold" />
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* ── Amenities ── */}
        <View style={[s.body, { marginTop: spacing.xl }]}>
          <SectionHeader title="Hotel amenities" />
          <Card padded={false}>
            {amenities.map((a, i) => (
              <View key={a.id}>
                <View style={s.amenityRow}>
                  <IconTile icon={a.icon as never} tone="gold" size={38} />
                  <View style={{ flex: 1 }}>
                    <BodyStrong>{a.name}</BodyStrong>
                    <Small>{a.detail}</Small>
                  </View>
                </View>
                {i < amenities.length - 1 ? <View style={s.amenityDivider} /> : null}
              </View>
            ))}
          </Card>
        </View>

        {/* ── Footer ── */}
        <View style={s.footer}>
          <ParkMark size={34} variant="badge" />
          <Small color={colors.inkFaint} style={{ textAlign: 'center', marginTop: spacing.md }}>
            {hotel.address}
            {'\n'}
            {hotel.phone}
          </Small>
          <Text style={s.footerNote}>Prototype · sample data</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  hero: { height: 330 },
  heroInner: { flex: 1, paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heroActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  heroPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  heroPillText: {
    fontSize: 10,
    letterSpacing: 1.2,
    fontWeight: '800',
    color: colors.onDark,
  },
  bell: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  bellDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.gold,
  },
  heroCopy: { marginTop: 'auto' },
  heroTitle: {
    fontFamily: serif,
    fontSize: 34,
    lineHeight: 39,
    color: colors.onDark,
    marginTop: spacing.sm,
    fontWeight: '700',
  },
  body: { paddingHorizontal: spacing.xl },
  bodyPad: { paddingHorizontal: spacing.xl },
  row: { flexDirection: 'row', alignItems: 'center', gap: 4 },

  stayCard: { marginTop: -spacing.xxl, ...shadow.lifted },
  stayTop: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, gap: spacing.md },
  keyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.maroon,
    paddingHorizontal: spacing.lg,
    paddingVertical: 11,
    borderRadius: radius.pill,
  },
  keyBtnText: { color: colors.onDark, fontWeight: '700', fontSize: 14 },
  stayDivider: { height: 1, backgroundColor: colors.line, marginHorizontal: spacing.lg },
  stayFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },

  quickGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
  },
  quickItem: { alignItems: 'center', gap: spacing.sm, width: '23%' },

  pointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  pointsValue: {
    fontFamily: serif,
    fontSize: 24,
    color: colors.ink,
    fontWeight: '700',
    marginTop: 2,
  },

  promo: { height: 150, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.surfaceAlt },
  promoCopy: { marginTop: 'auto', padding: spacing.lg },

  anniversary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.xl,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(228,199,102,0.3)',
  },
  anniversaryTitle: {
    fontFamily: serif,
    fontSize: 24,
    lineHeight: 29,
    color: colors.onDark,
    fontWeight: '700',
    marginTop: spacing.sm,
  },

  outlet: {
    width: 190,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
    ...shadow.card,
  },
  outletImg: { width: '100%', height: 110, backgroundColor: colors.surfaceAlt },

  amenityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  amenityDivider: { height: 1, backgroundColor: colors.line, marginLeft: 66 },

  footer: { alignItems: 'center', marginTop: spacing.xxl, paddingHorizontal: spacing.xl },
  footerNote: {
    fontSize: 10,
    letterSpacing: 1,
    color: colors.inkFaint,
    marginTop: spacing.lg,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
});
