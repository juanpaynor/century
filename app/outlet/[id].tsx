import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { serif } from '@/components/Brand';
import { Glass } from '@/components/Glass';
import { colors, peso, radius, shadow, spacing } from '@/constants/theme';
import { eliteProgram, member, menu, openStatus, outlets } from '@/data/hotel';
import { useApp } from '@/data/store';

export default function OutletDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { addToCart } = useApp();
  const [page, setPage] = useState(0);

  const outlet = outlets.find((o) => o.id === id);
  if (!outlet) {
    return (
      <View style={s.missing}>
        <Text style={s.missingText}>Outlet not found.</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={s.missingLink}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const status = openStatus(outlet);
  const signatures = menu.filter((m) => m.outlet === outlet.name).slice(0, 3);
  const galleryH = Math.round(height * 0.38);
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setPage(Math.round(e.nativeEvent.contentOffset.x / width));

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="light" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: outlet.bookable ? 150 : spacing.xxxl * 2 }}>
        {/* ── Gallery ── */}
        <View style={{ height: galleryH }}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}>
            {outlet.gallery.map((g, i) => (
              <Image key={i} source={g} style={{ width, height: galleryH }} contentFit="cover" />
            ))}
          </ScrollView>

          {/* deeper top scrim so the back control survives a bright photo */}
          <LinearGradient
            colors={['rgba(26,18,20,0.62)', 'rgba(26,18,20,0.15)', 'transparent']}
            style={s.topFade}
            pointerEvents="none"
          />
          <LinearGradient
            colors={['transparent', 'rgba(250,247,242,0.9)', colors.bg]}
            style={s.bottomFade}
            pointerEvents="none"
          />

          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={[s.backWrap, { top: insets.top + spacing.sm }]}>
            {({ pressed }) => (
              <Glass glassStyle="regular" interactive style={[s.backBtn, pressed && { opacity: 0.7 }]}>
                <Ionicons name="chevron-back" size={21} color={colors.onDark} />
              </Glass>
            )}
          </Pressable>

          {/* dots moved to bottom-centre — top-right is where Expo Go
              parks its dev button, and it covered them */}
          {outlet.gallery.length > 1 ? (
            <View style={s.dotsWrap}>
              {outlet.gallery.map((_, i) => (
                <View key={i} style={[s.dot, i === page && s.dotActive]} />
              ))}
            </View>
          ) : null}
        </View>

        {/* ── Masthead ── */}
        <View style={s.body}>
          <Text style={s.eyebrow}>{outlet.kind.toUpperCase()}</Text>

          <View style={s.titleRow}>
            <Text style={s.name}>{outlet.name}</Text>
            <View style={s.bandWrap}>
              <Text style={s.band}>{outlet.priceBand}</Text>
            </View>
          </View>

          <View style={s.statusRow}>
            <View style={[s.statusDot, { backgroundColor: status.open ? colors.success : colors.inkFaint }]} />
            <Text style={[s.statusText, status.open && { color: colors.success }]}>
              {status.label}
            </Text>
          </View>

          <Text style={s.blurb}>{outlet.blurb}</Text>

          {/* ── Hours ── */}
          <Text style={[s.eyebrow, { marginTop: spacing.xxl }]}>HOURS</Text>
          <View style={s.hours}>
            {outlet.schedule.map((h, i) => {
              const active = status.current?.label === h.label;
              return (
                <View
                  key={h.label}
                  style={[
                    s.hourRow,
                    i < outlet.schedule.length - 1 && s.hourDivider,
                    active && s.hourActive,
                  ]}>
                  <Text style={[s.hourLabel, active && s.hourLabelActive]}>{h.label}</Text>
                  {active ? <Text style={s.nowTag}>NOW</Text> : null}
                  <Text style={[s.hourTime, active && s.hourTimeActive]}>{h.time}</Text>
                </View>
              );
            })}
          </View>

          {outlet.note ? (
            <View style={s.noteBox}>
              <Ionicons name="pricetag-outline" size={15} color={colors.gold} />
              <Text style={s.noteText}>{outlet.note}</Text>
            </View>
          ) : null}

          {/* ── Elite ── */}
          <Text style={[s.eyebrow, { marginTop: spacing.xxl }]}>ELITE CARD DINING</Text>
          <Text style={s.eliteIntro}>
            Your card applies automatically — the more of you there are, the
            smaller the discount.
          </Text>
          <View style={s.eliteTable}>
            {eliteProgram.diningTable.map((d, i) => (
              <View
                key={d.party}
                style={[s.eliteCell, i < eliteProgram.diningTable.length - 1 && s.eliteCellBorder]}>
                <Text style={s.eliteOff}>{d.off}</Text>
                <Text style={s.eliteParty}>{d.party}</Text>
              </View>
            ))}
          </View>

          {/* ── Signatures ── */}
          {signatures.length ? (
            <>
              <Text style={[s.eyebrow, { marginTop: spacing.xxl }]}>FROM THE MENU</Text>
              <View style={{ marginTop: spacing.sm }}>
                {signatures.map((m, i) => (
                  <View
                    key={m.id}
                    style={[s.dish, i < signatures.length - 1 && s.dishDivider]}>
                    <View style={{ flex: 1 }}>
                      <Text style={s.dishName}>{m.name}</Text>
                      <Text style={s.dishDesc} numberOfLines={2}>
                        {m.desc}
                      </Text>
                    </View>
                    <Text style={s.dishPrice}>{peso(m.price)}</Text>
                    <Pressable onPress={() => addToCart(m)} hitSlop={8}>
                      {({ pressed }) => (
                        <View style={[s.addBtn, pressed && { opacity: 0.7 }]}>
                          <Ionicons name="add" size={17} color={colors.maroon} />
                        </View>
                      )}
                    </Pressable>
                  </View>
                ))}
              </View>
              <Text style={s.dishNote}>Available through room service.</Text>
            </>
          ) : null}

          {outlet.phone ? (
            <View style={[s.noteBox, { marginTop: spacing.xl }]}>
              <Ionicons name="call-outline" size={15} color={colors.gold} />
              <Text style={s.noteText}>Reservations and orders · {outlet.phone}</Text>
            </View>
          ) : null}

          <Text style={s.fineprint}>
            Hours, description and photography from centurypark.com.ph. Dish prices are
            placeholder data.
          </Text>
        </View>
      </ScrollView>

      {/* ── Reserve ── */}
      {outlet.bookable ? (
        <View style={s.actionWrap} pointerEvents="box-none">
          <LinearGradient
            colors={['rgba(250,247,242,0)', colors.bg]}
            style={s.actionFade}
            pointerEvents="none"
          />
          <View style={[s.actionBar, { paddingBottom: insets.bottom + spacing.md }]}>
            <Pressable style={{ flex: 1 }}>
              {({ pressed }) => (
                <View style={[s.reserve, pressed && { opacity: 0.85 }]}>
                  <Ionicons name="restaurant-outline" size={17} color={colors.onDark} />
                  <Text style={s.reserveText}>Reserve a table</Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  missingText: { fontSize: 15, color: colors.inkMuted },
  missingLink: { fontSize: 15, color: colors.maroon, fontWeight: '700' },

  topFade: { position: 'absolute', left: 0, right: 0, top: 0, height: 150 },
  bottomFade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 90 },

  backWrap: { position: 'absolute', left: spacing.xl },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  dotsWrap: {
    position: 'absolute',
    bottom: spacing.xl,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(26,18,20,0.25)',
  },
  dotActive: { backgroundColor: colors.maroon, width: 18 },

  body: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
  eyebrow: { fontSize: 9.5, letterSpacing: 1.6, fontWeight: '700', color: colors.gold },

  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginTop: 6 },
  name: { flex: 1, fontFamily: serif, fontSize: 30, lineHeight: 36, fontWeight: '700', color: colors.ink },
  bandWrap: {
    borderWidth: 1,
    borderColor: colors.lineStrong,
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 6,
  },
  /* letterSpacing keeps the ₱ crossbars from joining into a strikethrough */
  band: { fontSize: 12, letterSpacing: 2.5, color: colors.gold, fontWeight: '700' },

  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.sm },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: 13, fontWeight: '600', color: colors.inkMuted },

  blurb: { fontSize: 15, lineHeight: 23, color: colors.inkMuted, marginTop: spacing.md },

  hours: {
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  hourRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  hourDivider: { borderBottomWidth: 1, borderBottomColor: colors.line },
  hourActive: { backgroundColor: colors.maroonSoft },
  hourLabel: { flex: 1, fontSize: 14.5, color: colors.ink },
  hourLabelActive: { fontWeight: '700', color: colors.maroon },
  hourTime: { fontFamily: serif, fontSize: 14.5, color: colors.inkMuted },
  hourTimeActive: { color: colors.maroon, fontWeight: '600' },
  nowTag: {
    fontSize: 8.5,
    letterSpacing: 1,
    fontWeight: '800',
    color: colors.onDark,
    backgroundColor: colors.maroon,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    overflow: 'hidden',
  },

  noteBox: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
    backgroundColor: colors.goldSoft,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  noteText: { flex: 1, fontSize: 12.5, lineHeight: 18, color: colors.ink },

  eliteIntro: { fontSize: 13.5, lineHeight: 20, color: colors.inkMuted, marginTop: 6 },
  eliteTable: {
    flexDirection: 'row',
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  eliteCell: { flex: 1, alignItems: 'center', paddingVertical: spacing.md },
  eliteCellBorder: { borderRightWidth: 1, borderRightColor: colors.line },
  eliteOff: { fontFamily: serif, fontSize: 19, fontWeight: '700', color: colors.maroon },
  eliteParty: { fontSize: 10, color: colors.inkMuted, marginTop: 3 },

  dish: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  dishDivider: { borderBottomWidth: 1, borderBottomColor: colors.line },
  dishName: { fontSize: 14.5, fontWeight: '600', color: colors.ink },
  dishDesc: { fontSize: 12, lineHeight: 17, color: colors.inkFaint, marginTop: 2 },
  dishPrice: { fontFamily: serif, fontSize: 15, fontWeight: '700', color: colors.ink },
  addBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dishNote: { fontSize: 11.5, color: colors.inkFaint, marginTop: spacing.md },

  fineprint: { fontSize: 11, lineHeight: 16, color: colors.inkFaint, marginTop: spacing.xxl },

  actionWrap: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  actionFade: { height: 32 },
  actionBar: {
    flexDirection: 'row',
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xs,
  },
  reserve: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.maroon,
    paddingVertical: 16,
    borderRadius: radius.pill,
    ...shadow.lifted,
  },
  reserveText: { color: colors.onDark, fontSize: 15, fontWeight: '700' },
});
