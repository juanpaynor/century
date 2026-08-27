import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ParkMark, serif } from '@/components/Brand';
import { colors, gradients, peso, radius, shadow, spacing } from '@/constants/theme';
import { hotel, member, serviceRequests, stay } from '@/data/hotel';
import { useApp } from '@/data/store';

/* ── primitives ── */

function Eyebrow({ children, style }: { children: string; style?: object }) {
  return <Text style={[s.eyebrow, style]}>{children}</Text>;
}

function Row({
  label,
  value,
  icon,
  onPress,
  last,
  danger,
  right,
}: {
  label: string;
  value?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  last?: boolean;
  danger?: boolean;
  right?: React.ReactNode;
}) {
  const content = (
    <View style={[s.row, !last && s.rowDivider]}>
      {icon ? (
        <Ionicons
          name={icon}
          size={18}
          color={danger ? colors.danger : colors.maroon}
          style={{ width: 26 }}
        />
      ) : null}
      <Text style={[s.rowLabel, danger && { color: colors.danger }]}>{label}</Text>
      <View style={{ flex: 1 }} />
      {value ? <Text style={s.rowValue}>{value}</Text> : null}
      {right}
      {onPress && !right ? (
        <Ionicons name="chevron-forward" size={16} color={colors.inkFaint} />
      ) : null}
    </View>
  );
  if (!onPress) return content;
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => <View style={pressed ? { opacity: 0.6 } : undefined}>{content}</View>}
    </Pressable>
  );
}

/* ── screen ── */

export default function StayScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { requests, logRequest, orders } = useApp();

  const [push, setPush] = useState(true);
  const [offers, setOffers] = useState(false);

  const folioTotal = stay.folio.reduce((n, f) => n + f.amount, 0);
  const liveOrders = orders.filter((o) => o.status !== 'Delivered');

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + spacing.lg,
          paddingBottom: spacing.xxxl * 2,
        }}>
        <View style={s.head}>
          <Eyebrow>IN RESIDENCE</Eyebrow>
          <Text style={s.title}>Your stay</Text>
        </View>

        {/* ── Key card ── */}
        <View style={s.keyWrap}>
          <View style={s.keyCard}>
            <LinearGradient
              colors={gradients.card}
              start={{ x: 0.1, y: 0 }}
              end={{ x: 0.9, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={s.keyTop}>
              <View style={{ flex: 1 }}>
                <Text style={s.keyEyebrow}>ROOM</Text>
                <Text style={s.keyRoom}>{stay.room}</Text>
                <Text style={s.keyMeta}>
                  {stay.roomType} · {stay.guests} guests
                </Text>
              </View>
              <ParkMark size={40} />
            </View>

            <View style={s.keyDates}>
              <View>
                <Text style={s.keyDateLabel}>CHECK IN</Text>
                <Text style={s.keyDateValue}>{stay.checkIn}</Text>
              </View>
              <Ionicons name="arrow-forward" size={15} color={colors.onDarkFaint} />
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={s.keyDateLabel}>CHECK OUT</Text>
                <Text style={s.keyDateValue}>{stay.checkOut}</Text>
              </View>
            </View>

            <Pressable onPress={() => router.push('/digital-key')}>
              {({ pressed }) => (
                <View style={[s.keyBtn, pressed && { opacity: 0.85 }]}>
                  <Ionicons name="key" size={17} color={colors.pageDeep} />
                  <Text style={s.keyBtnText}>Open digital key</Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>

        {/* ── Folio ── */}
        <View style={s.section}>
          <Eyebrow>CHARGES</Eyebrow>
          <Text style={s.sectionTitle}>Folio</Text>
          <View style={s.card}>
            {stay.folio.map((f, i) => (
              <View key={f.id} style={[s.folioRow, i < stay.folio.length - 1 && s.rowDivider]}>
                <Text style={[s.folioLabel, f.amount < 0 && { color: colors.maroon }]}>
                  {f.label}
                </Text>
                <Text style={[s.folioAmount, f.amount < 0 && { color: colors.maroon }]}>
                  {peso(f.amount)}
                </Text>
              </View>
            ))}
            <View style={s.folioTotal}>
              <Text style={s.folioTotalLabel}>Balance</Text>
              <Text style={s.folioTotalValue}>{peso(folioTotal)}</Text>
            </View>
          </View>
          <Text style={s.note}>Settled at check-out. Confirmation {stay.confirmation}.</Text>
        </View>

        {/* ── Live orders ── */}
        {liveOrders.length ? (
          <View style={s.section}>
            <Eyebrow>IN PROGRESS</Eyebrow>
            <Text style={s.sectionTitle}>Room service</Text>
            <View style={s.card}>
              {liveOrders.map((o, i) => (
                <View key={o.id} style={[s.row, i < liveOrders.length - 1 && s.rowDivider]}>
                  <View style={s.pulse} />
                  <View style={{ flex: 1 }}>
                    <Text style={s.rowLabel}>{o.id}</Text>
                    <Text style={s.rowSub}>
                      {o.lines.length} item{o.lines.length > 1 ? 's' : ''} · {o.placedAt}
                    </Text>
                  </View>
                  <Text style={s.statusText}>{o.status}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* ── Requests ── */}
        <View style={s.section}>
          <Eyebrow>AT YOUR SERVICE</Eyebrow>
          <Text style={s.sectionTitle}>Request</Text>
          <View style={s.grid}>
            {serviceRequests.map((r) => (
              <Pressable
                key={r.id}
                style={s.tile}
                onPress={() => {
                  logRequest(r.label, r.icon);
                  Alert.alert(r.label, `Requested for Room ${stay.room}.\nEstimated ${r.eta}.`);
                }}>
                {({ pressed }) => (
                  <View style={[s.tileInner, pressed && { opacity: 0.6 }]}>
                    <View style={s.tileIcon}>
                      <Ionicons
                        name={r.icon as keyof typeof Ionicons.glyphMap}
                        size={20}
                        color={colors.maroon}
                      />
                    </View>
                    <Text style={s.tileLabel} numberOfLines={2}>
                      {r.label}
                    </Text>
                    <Text style={s.tileEta}>{r.eta}</Text>
                  </View>
                )}
              </Pressable>
            ))}
          </View>

          {requests.length ? (
            <View style={[s.card, { marginTop: spacing.lg }]}>
              {requests.slice(0, 5).map((r, i) => (
                <View
                  key={r.id}
                  style={[s.row, i < Math.min(requests.length, 5) - 1 && s.rowDivider]}>
                  <Ionicons
                    name={r.icon as keyof typeof Ionicons.glyphMap}
                    size={17}
                    color={colors.maroon}
                    style={{ width: 26 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={s.rowLabel}>{r.label}</Text>
                    <Text style={s.rowSub}>Requested {r.at}</Text>
                  </View>
                  <Text style={s.statusText}>{r.status}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>

        {/* ── Account ── */}
        <View style={s.section}>
          <Eyebrow>ACCOUNT</Eyebrow>
          <Text style={s.sectionTitle}>Settings</Text>

          <View style={s.profile}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>
                {member.firstName[0]}
                {member.lastName[0]}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.profileName}>
                {member.firstName} {member.lastName}
              </Text>
              <Text style={s.profileMeta}>{member.email}</Text>
              <Text style={s.profileElite}>
                Elite Card {member.memberNo} · member since {member.since}
              </Text>
            </View>
          </View>

          <View style={s.card}>
            <Row
              label="Push notifications"
              icon="notifications-outline"
              right={
                <Switch
                  value={push}
                  onValueChange={setPush}
                  trackColor={{ true: colors.maroon, false: colors.lineStrong }}
                />
              }
            />
            <Row
              label="Offers and promotions"
              icon="mail-outline"
              right={
                <Switch
                  value={offers}
                  onValueChange={setOffers}
                  trackColor={{ true: colors.maroon, false: colors.lineStrong }}
                />
              }
              last
            />
          </View>

          <View style={[s.card, { marginTop: spacing.md }]}>
            <Row label="Language" icon="language-outline" value="English" onPress={() => {}} />
            <Row label="Currency" icon="cash-outline" value="PHP ₱" onPress={() => {}} />
            <Row
              label="Payment methods"
              icon="card-outline"
              value="•••• 4471"
              onPress={() => {}}
              last
            />
          </View>

          <View style={[s.card, { marginTop: spacing.md }]}>
            <Row label="Help and contact" icon="help-circle-outline" onPress={() => {}} />
            <Row label="Privacy policy" icon="lock-closed-outline" onPress={() => {}} />
            <Row label="Terms of service" icon="document-text-outline" onPress={() => {}} last />
          </View>

          <View style={[s.card, { marginTop: spacing.md }]}>
            <Row
              label="Sign out"
              icon="log-out-outline"
              danger
              last
              onPress={() =>
                Alert.alert('Sign out', 'This is a prototype — nothing to sign out of yet.')
              }
            />
          </View>
        </View>

        {/* ── Colophon ── */}
        <View style={s.colophon}>
          <ParkMark size={30} />
          <Text style={s.colophonText}>
            {hotel.address}
            {'\n'}
            {hotel.phone}
          </Text>
          <Text style={s.colophonNote}>PROTOTYPE · SAMPLE DATA · v1.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  head: { paddingHorizontal: spacing.xl },
  eyebrow: { fontSize: 9.5, letterSpacing: 1.6, fontWeight: '700', color: colors.gold },
  title: { fontFamily: serif, fontSize: 30, fontWeight: '700', color: colors.ink, marginTop: 5 },

  keyWrap: { paddingHorizontal: spacing.xl, marginTop: spacing.lg },
  keyCard: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    padding: spacing.xl,
    ...shadow.lifted,
  },
  keyTop: { flexDirection: 'row', alignItems: 'flex-start' },
  keyEyebrow: { fontSize: 9, letterSpacing: 1.6, fontWeight: '700', color: colors.gold },
  keyRoom: {
    fontFamily: serif,
    fontSize: 42,
    lineHeight: 48,
    fontWeight: '700',
    color: colors.onDark,
  },
  keyMeta: { fontSize: 12.5, color: colors.onDarkMuted, marginTop: 2 },
  keyDates: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.lineOnDark,
  },
  keyDateLabel: { fontSize: 8.5, letterSpacing: 1.2, fontWeight: '700', color: colors.gold },
  keyDateValue: { fontFamily: serif, fontSize: 15, color: colors.onDark, marginTop: 3 },
  keyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.goldLight,
    borderRadius: radius.pill,
    paddingVertical: 13,
    marginTop: spacing.lg,
  },
  keyBtnText: { fontSize: 14.5, fontWeight: '700', color: colors.pageDeep },

  section: { paddingHorizontal: spacing.xl, marginTop: spacing.xxl },
  sectionTitle: {
    fontFamily: serif,
    fontSize: 24,
    fontWeight: '700',
    color: colors.ink,
    marginTop: 5,
    marginBottom: spacing.md,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
  },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: colors.line },
  rowLabel: { fontSize: 15, color: colors.ink },
  rowSub: { fontSize: 11.5, color: colors.inkFaint, marginTop: 1 },
  rowValue: { fontSize: 14, color: colors.inkMuted, marginRight: 4 },
  statusText: { fontSize: 11, fontWeight: '700', color: colors.gold, letterSpacing: 0.4 },
  pulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 18,
    marginLeft: 4,
  },

  folioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 13,
  },
  folioLabel: { flex: 1, fontSize: 14, color: colors.ink },
  folioAmount: { fontFamily: serif, fontSize: 15, color: colors.ink },
  folioTotal: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surfaceAlt,
  },
  folioTotalLabel: { fontSize: 15, fontWeight: '700', color: colors.ink },
  folioTotalValue: { fontFamily: serif, fontSize: 24, fontWeight: '700', color: colors.maroon },
  note: { fontSize: 11, color: colors.inkFaint, marginTop: spacing.sm },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  tile: { width: '31.7%' },
  tileInner: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
  },
  tileIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.maroonSoft,
  },
  tileLabel: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    color: colors.ink,
    textAlign: 'center',
  },
  tileEta: { fontSize: 9.5, color: colors.inkFaint },

  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.maroon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: serif, fontSize: 18, fontWeight: '700', color: colors.goldLight },
  profileName: { fontFamily: serif, fontSize: 18, fontWeight: '700', color: colors.ink },
  profileMeta: { fontSize: 12.5, color: colors.inkMuted, marginTop: 1 },
  profileElite: { fontSize: 11, color: colors.gold, marginTop: 3, fontWeight: '600' },

  colophon: { alignItems: 'center', marginTop: spacing.xxl, paddingHorizontal: spacing.xl },
  colophonText: {
    fontFamily: serif,
    fontSize: 12.5,
    lineHeight: 20,
    color: colors.inkFaint,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  colophonNote: {
    fontSize: 9,
    letterSpacing: 1.4,
    color: colors.inkFaint,
    marginTop: spacing.lg,
    fontWeight: '700',
  },
});
