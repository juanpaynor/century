import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnniversaryMark, Lockup, ParkMarkGold, serif } from '@/components/Brand';
import { EliteCard } from '@/components/EliteCard';
import { Glass } from '@/components/Glass';
import { colors, gradients, peso, radius, spacing } from '@/constants/theme';
import { amenities, hotel, member, outlets, stay } from '@/data/hotel';
import { useApp } from '@/data/store';

/* ── Small editorial primitives, local to this screen ──────────────── */

function Rule({ width = 56, style }: { width?: number | '100%'; style?: object }) {
  return <View style={[{ width, height: 1, backgroundColor: colors.hairline }, style]} />;
}

function SectionHead({
  eyebrow,
  title,
  action,
  onAction,
}: {
  eyebrow: string;
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={s.sectionHead}>
      <View style={{ flex: 1 }}>
        <Text style={s.eyebrow}>{eyebrow}</Text>
        <Text style={s.sectionTitle}>{title}</Text>
      </View>
      {action ? (
        <Pressable onPress={onAction} hitSlop={10}>
          {({ pressed }) => (
            <Text style={[s.actionLink, pressed && { opacity: 0.6 }]}>{action}</Text>
          )}
        </Pressable>
      ) : null}
    </View>
  );
}

/** Hairline ledger row — the workhorse of the dark sections. */
function LedgerRow({
  label,
  value,
  sub,
  onPress,
  last,
  icon,
}: {
  label: string;
  value?: string;
  sub?: string;
  onPress?: () => void;
  last?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  const body = (
    <View style={[s.ledgerRow, !last && s.ledgerDivider]}>
      {icon ? (
        <Ionicons name={icon} size={17} color={colors.gold} style={{ width: 26 }} />
      ) : null}
      <View style={{ flex: 1 }}>
        <Text style={s.ledgerLabel}>{label}</Text>
        {sub ? <Text style={s.ledgerSub}>{sub}</Text> : null}
      </View>
      {value ? <Text style={s.ledgerValue}>{value}</Text> : null}
      {onPress ? (
        <Ionicons name="chevron-forward" size={15} color={colors.onDarkFaint} />
      ) : null}
    </View>
  );
  if (!onPress) return body;
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => <View style={pressed ? { opacity: 0.6 } : undefined}>{body}</View>}
    </Pressable>
  );
}

function Section({ children, style }: { children: ReactNode; style?: object }) {
  return <View style={[s.section, style]}>{children}</View>;
}

/* ── Screen ────────────────────────────────────────────────────────── */

const SERVICES = [
  { id: 'key', label: 'Digital Key', icon: 'key-outline' as const, href: '/digital-key' },
  { id: 'dine', label: 'Room Service', icon: 'restaurant-outline' as const, href: '/(tabs)/dine' },
  { id: 'house', label: 'Housekeeping', icon: 'sparkles-outline' as const, href: '/(tabs)/stay' },
  { id: 'concierge', label: 'Concierge', icon: 'chatbubble-outline' as const, href: '/(tabs)/stay' },
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
  const { width, height } = useWindowDimensions();
  const { logRequest } = useApp();

  const folio = stay.folio.reduce((n, f) => n + f.amount, 0);
  const cardW = width - spacing.xl * 2;

  return (
    <View style={{ flex: 1, backgroundColor: colors.page }}>
      <StatusBar style="light" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={{ paddingBottom: spacing.xxxl * 2 }}>
        {/* ══ Hero ══ */}
        <View style={[s.hero, { minHeight: Math.max(560, height * 0.74) }]}>
          <Image source={hotel.hero} style={StyleSheet.absoluteFill} contentFit="cover" />
          <LinearGradient
            colors={gradients.heroScrim}
            locations={[0, 0.42, 0.8]}
            style={StyleSheet.absoluteFill}
          />

          <View style={[s.heroInner, { paddingTop: insets.top + spacing.sm }]}>
            {/* top rail */}
            <View style={s.heroTop}>
              <Glass glassStyle="clear" style={s.glassPill}>
                <Text style={s.glassPillText}>1976 — 2026</Text>
              </Glass>
              <Pressable hitSlop={10} onPress={() => router.push('/(tabs)/stay')}>
                {({ pressed }) => (
                  <Glass
                    glassStyle="clear"
                    interactive
                    style={[s.glassCircle, pressed && { opacity: 0.7 }]}>
                    <Ionicons name="notifications-outline" size={18} color={colors.onDark} />
                    <View style={s.dot} />
                  </Glass>
                )}
              </Pressable>
            </View>

            {/* spacer keeps the masthead pinned low without negative margins */}
            <View style={{ flex: 1, minHeight: spacing.xxl }} />

            {/* masthead */}
            <View style={s.masthead}>
              <Lockup width={Math.min(228, width * 0.6)} />
              <Text style={s.display}>
                Fifty years on{'\n'}Ocampo Street
              </Text>
              <Rule style={{ marginTop: spacing.lg }} />
              <Text style={s.address}>{hotel.address.toUpperCase()}</Text>
            </View>

            {/* stay pill — glass, over photography */}
            {stay.active ? (
              <View style={{ marginTop: spacing.xl }}>
                <Text style={s.greeting}>
                  {greeting()}, {member.firstName}
                </Text>
                <Pressable onPress={() => router.push('/digital-key')}>
                  {({ pressed }) => (
                    <Glass
                      glassStyle="regular"
                      interactive
                      style={[s.stayPill, pressed && { opacity: 0.8 }]}>
                      <View style={s.keyBadge}>
                        <Ionicons name="key" size={15} color={colors.goldLight} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={s.stayRoom}>Room {stay.room}</Text>
                        <Text style={s.stayMeta}>
                          {stay.roomType} · until {stay.checkOut}
                        </Text>
                      </View>
                      <Text style={s.unlock}>UNLOCK</Text>
                      <Ionicons name="chevron-forward" size={15} color={colors.goldLight} />
                    </Glass>
                  )}
                </Pressable>
              </View>
            ) : null}
          </View>
        </View>

        {/* ══ Your stay ══ */}
        {stay.active ? (
          <Section>
            <SectionHead
              eyebrow="In residence"
              title="Your stay"
              action="Details"
              onAction={() => router.push('/(tabs)/stay')}
            />
            <View style={s.ledger}>
              <LedgerRow label="Nights" value={`${stay.nights}`} sub={`${stay.checkIn} – ${stay.checkOut}`} />
              <LedgerRow label="Guests" value={`${stay.guests}`} />
              <LedgerRow
                label="Folio balance"
                value={peso(folio)}
                onPress={() => router.push('/(tabs)/stay')}
                last
              />
            </View>
          </Section>
        ) : null}

        {/* ══ Services ══ */}
        <Section>
          <SectionHead eyebrow="At your service" title="Request" />
          <View style={s.services}>
            {SERVICES.map((a) => (
              <Pressable
                key={a.id}
                style={s.serviceCell}
                onPress={() => {
                  if (a.id === 'house') logRequest('Housekeeping', 'sparkles-outline');
                  router.push(a.href as never);
                }}>
                {({ pressed }) => (
                  <View style={[s.serviceInner, pressed && { opacity: 0.55 }]}>
                    <View style={s.serviceIcon}>
                      <Ionicons name={a.icon} size={20} color={colors.goldLight} />
                    </View>
                    <Text style={s.serviceLabel} numberOfLines={2}>
                      {a.label}
                    </Text>
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </Section>

        {/* ══ Elite Card ══ */}
        <Section>
          <SectionHead
            eyebrow="Membership"
            title="Elite Card"
            action="Open"
            onAction={() => router.push('/(tabs)/elite')}
          />
          <Pressable onPress={() => router.push('/(tabs)/elite')}>
            {({ pressed }) => (
              <View style={pressed ? { opacity: 0.9 } : undefined}>
                <EliteCard
                  memberNo={member.memberNo}
                  name={`${member.firstName} ${member.lastName}`}
                  since={member.since}
                  style={{ width: cardW }}
                />
              </View>
            )}
          </Pressable>
          <View style={s.stats}>
            <View style={s.stat}>
              <Text style={s.statValue}>{member.points.toLocaleString('en-PH')}</Text>
              <Text style={s.statLabel}>POINTS</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.stat}>
              <Text style={s.statValue}>{peso(member.ytdSaved)}</Text>
              <Text style={s.statLabel}>SAVED THIS YEAR</Text>
            </View>
          </View>
        </Section>

        {/* ══ Dining ══ */}
        <View style={{ marginTop: spacing.xxl }}>
          <View style={{ paddingHorizontal: spacing.xl }}>
            <SectionHead
              eyebrow="Tonight at the hotel"
              title="Dining"
              action="All"
              onAction={() => router.push('/(tabs)/dine')}
            />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: spacing.xl, gap: spacing.md }}>
            {outlets.map((o) => (
              <Pressable key={o.id} onPress={() => router.push(`/outlet/${o.id}` as never)}>
                {({ pressed }) => (
                  <View style={[s.outlet, pressed && { opacity: 0.8 }]}>
                    <Image source={o.image} style={s.outletImg} contentFit="cover" />
                    <View style={s.outletBody}>
                      <Text style={s.outletName} numberOfLines={1}>
                        {o.name}
                      </Text>
                      <Text style={s.outletKind} numberOfLines={1}>
                        {o.kind}
                      </Text>
                      <Text style={s.outletElite}>{o.eliteDiscount.toUpperCase()}</Text>
                    </View>
                  </View>
                )}
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* ══ Anniversary feature ══ */}
        <View style={s.feature}>
          <Image source={hotel.exterior} style={StyleSheet.absoluteFill} contentFit="cover" />
          <LinearGradient
            colors={['rgba(44,7,16,0.55)', 'rgba(44,7,16,0.92)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={s.featureInner}>
            <AnniversaryMark size={74} />
            <Text style={s.featureTitle}>The Golden Year</Text>
            <Text style={s.featureBody}>
              Fifty years of the Atrium, Tsukiji and the Park. Anniversary rates and member
              certificates all through {new Date().getFullYear()}.
            </Text>
            <Rule width={40} style={{ marginTop: spacing.lg }} />
          </View>
        </View>

        {/* ══ The hotel ══ */}
        <Section>
          <SectionHead eyebrow="The house" title="Amenities" />
          <View style={s.ledger}>
            {amenities.map((a, i) => (
              <LedgerRow
                key={a.id}
                icon={a.icon as keyof typeof Ionicons.glyphMap}
                label={a.name}
                sub={a.detail}
                last={i === amenities.length - 1}
              />
            ))}
          </View>
        </Section>

        {/* ══ Colophon ══ */}
        <View style={s.colophon}>
          <ParkMarkGold size={30} opacity={0.5} />
          <Rule width={30} style={{ marginTop: spacing.lg }} />
          <Text style={s.colophonText}>
            {hotel.address}
            {'\n'}
            {hotel.phone}
          </Text>
          <Text style={s.colophonNote}>PROTOTYPE · SAMPLE DATA</Text>
        </View>
      </ScrollView>
    </View>
  );
}

/* ── Styles ────────────────────────────────────────────────────────── */

const s = StyleSheet.create({
  /* Hero */
  hero: { width: '100%' },
  heroInner: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  glassPill: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  glassPillText: {
    fontFamily: serif,
    fontSize: 11,
    letterSpacing: 1.4,
    color: colors.onDark,
  },
  glassCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  dot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.gold,
  },

  masthead: { alignItems: 'center' },
  display: {
    fontFamily: serif,
    fontSize: 36,
    lineHeight: 43,
    fontWeight: '700',
    color: colors.onDark,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  address: {
    fontSize: 9.5,
    letterSpacing: 1.6,
    color: colors.goldLight,
    marginTop: spacing.md,
    textAlign: 'center',
    fontWeight: '600',
  },

  greeting: {
    fontFamily: serif,
    fontSize: 13,
    letterSpacing: 0.4,
    color: colors.onDarkMuted,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  stayPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  keyBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(201,162,39,0.22)',
  },
  stayRoom: { fontSize: 15, fontWeight: '700', color: colors.onDark },
  stayMeta: { fontSize: 11.5, color: colors.onDarkMuted, marginTop: 1 },
  unlock: {
    fontSize: 10,
    letterSpacing: 1.2,
    fontWeight: '800',
    color: colors.goldLight,
  },

  /* Sections */
  section: { paddingHorizontal: spacing.xl, marginTop: spacing.xxl },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing.lg,
  },
  eyebrow: {
    fontSize: 9.5,
    letterSpacing: 1.6,
    fontWeight: '700',
    color: colors.gold,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontFamily: serif,
    fontSize: 25,
    fontWeight: '700',
    color: colors.onDark,
    marginTop: 5,
  },
  actionLink: {
    fontSize: 12,
    letterSpacing: 0.6,
    fontWeight: '700',
    color: colors.goldLight,
    paddingBottom: 4,
  },

  /* Ledger */
  ledger: {
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
  },
  ledgerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  ledgerDivider: { borderBottomWidth: 1, borderBottomColor: colors.hairlineSoft },
  ledgerLabel: { fontSize: 15, color: colors.onDark, fontWeight: '500' },
  ledgerSub: { fontSize: 12, color: colors.onDarkFaint, marginTop: 2 },
  ledgerValue: {
    fontFamily: serif,
    fontSize: 17,
    color: colors.goldLight,
    marginRight: 2,
  },

  /* Services */
  services: { flexDirection: 'row', gap: spacing.sm },
  serviceCell: { flex: 1 },
  serviceInner: { alignItems: 'center', gap: spacing.sm },
  serviceIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.raised,
    borderWidth: 1,
    borderColor: colors.hairlineSoft,
  },
  serviceLabel: {
    fontSize: 11,
    lineHeight: 14,
    color: colors.onDarkMuted,
    textAlign: 'center',
    fontWeight: '600',
  },

  /* Elite stats */
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  stat: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, height: 34, backgroundColor: colors.hairlineSoft },
  statValue: { fontFamily: serif, fontSize: 22, color: colors.onDark, fontWeight: '700' },
  statLabel: {
    fontSize: 9,
    letterSpacing: 1.3,
    color: colors.gold,
    marginTop: 5,
    fontWeight: '700',
  },

  /* Dining */
  outlet: {
    width: 168,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.raised,
    borderWidth: 1,
    borderColor: colors.hairlineSoft,
  },
  outletImg: { width: '100%', height: 108, backgroundColor: colors.pageDeep },
  outletBody: { padding: spacing.md },
  outletName: { fontFamily: serif, fontSize: 15, color: colors.onDark, fontWeight: '700' },
  outletKind: { fontSize: 11.5, color: colors.onDarkFaint, marginTop: 2 },
  outletElite: {
    fontSize: 9,
    letterSpacing: 1.1,
    color: colors.gold,
    fontWeight: '700',
    marginTop: spacing.sm,
  },

  /* Anniversary feature */
  feature: { marginTop: spacing.xxl, minHeight: 300, justifyContent: 'center' },
  featureInner: { alignItems: 'center', padding: spacing.xxl },
  featureTitle: {
    fontFamily: serif,
    fontSize: 30,
    fontWeight: '700',
    color: colors.onDark,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  featureBody: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.onDarkMuted,
    textAlign: 'center',
    marginTop: spacing.md,
    maxWidth: 320,
  },

  /* Colophon */
  colophon: { alignItems: 'center', marginTop: spacing.xxl, paddingHorizontal: spacing.xl },
  colophonText: {
    fontFamily: serif,
    fontSize: 12.5,
    lineHeight: 20,
    color: colors.onDarkFaint,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  colophonNote: {
    fontSize: 9,
    letterSpacing: 1.4,
    color: 'rgba(255,255,255,0.28)',
    marginTop: spacing.xl,
    fontWeight: '700',
  },
});
