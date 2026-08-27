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
import { fmtRange } from '@/constants/dates';
import { colors, peso, radius, shadow, spacing } from '@/constants/theme';
import { ELITE_RATE_DISCOUNT, eliteRate, member, rooms } from '@/data/hotel';
import { useApp } from '@/data/store';

/** Gallery entries mix local requires and remote placeholders. */
const src = (v: string | number) => (typeof v === 'string' ? { uri: v } : v);

export default function RoomDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { search, nights } = useApp();
  const [page, setPage] = useState(0);

  const room = rooms.find((r) => r.id === id);
  if (!room) {
    return (
      <View style={s.missing}>
        <Text style={s.missingText}>Room not found.</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={s.missingLink}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const gallery = [room.image, ...room.gallery];
  const galleryH = Math.round(height * 0.52);
  const elite = eliteRate(room.rate);
  const saved = room.rate - elite;
  const total = elite * nights;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setPage(Math.round(e.nativeEvent.contentOffset.x / width));

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="light" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }}>
        {/* Gallery */}
        <View style={{ height: galleryH }}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}>
            {gallery.map((g, i) => (
              <Image
                key={i}
                source={src(g)}
                style={{ width, height: galleryH }}
                contentFit="cover"
              />
            ))}
          </ScrollView>

          <LinearGradient
            colors={['rgba(26,18,20,0.5)', 'transparent']}
            style={s.topFade}
            pointerEvents="none"
          />

          <View style={[s.chrome, { top: insets.top + spacing.sm }]}>
            <Pressable onPress={() => router.back()} hitSlop={10}>
              {({ pressed }) => (
                <Glass
                  glassStyle="clear"
                  interactive
                  style={[s.backBtn, pressed && { opacity: 0.7 }]}>
                  <Ionicons name="chevron-back" size={20} color={colors.onDark} />
                </Glass>
              )}
            </Pressable>

            {gallery.length > 1 ? (
              <Glass glassStyle="clear" style={s.dots}>
                {gallery.map((_, i) => (
                  <View key={i} style={[s.dot, i === page && s.dotActive]} />
                ))}
              </Glass>
            ) : null}
          </View>
        </View>

        {/* Body */}
        <View style={s.body}>
          {room.tag ? <Text style={s.eyebrow}>{room.tag.toUpperCase()}</Text> : null}
          <Text style={s.name}>{room.name}</Text>
          <Text style={s.blurb}>{room.blurb}</Text>

          {/* Spec triad */}
          <View style={s.rule} />
          <View style={s.specs}>
            <View style={s.spec}>
              <Text style={s.specValue}>{room.sqm}</Text>
              <Text style={s.specLabel}>SQM</Text>
            </View>
            <View style={s.specDivider} />
            <View style={s.spec}>
              <Text style={s.specValue}>{room.bed.split(' ')[0]}</Text>
              <Text style={s.specLabel}>BED</Text>
            </View>
            <View style={s.specDivider} />
            <View style={s.spec}>
              <Text style={s.specValue}>{room.occupancy}</Text>
              <Text style={s.specLabel}>GUESTS</Text>
            </View>
          </View>
          <View style={s.rule} />

          {/* Amenities */}
          <Text style={[s.eyebrow, { marginTop: spacing.xl }]}>IN THE ROOM</Text>
          <View style={s.amenities}>
            {room.amenities.map((a) => (
              <View key={a} style={s.amenity}>
                <Ionicons name="ellipse" size={5} color={colors.gold} />
                <Text style={s.amenityText}>{a}</Text>
              </View>
            ))}
          </View>

          {/* Rate ledger */}
          <Text style={[s.eyebrow, { marginTop: spacing.xxl }]}>YOUR RATE</Text>
          <Text style={s.rateDates}>
            {fmtRange(search.checkIn, search.checkOut)} · {search.guests} guest
            {search.guests > 1 ? 's' : ''}
          </Text>

          <View style={[s.rule, { marginTop: spacing.md }]} />
          <View style={s.ledgerRow}>
            <Text style={s.ledgerLabel}>Best available rate</Text>
            <Text style={s.ledgerValue}>{peso(room.rate)}</Text>
          </View>
          <View style={s.ledgerRow}>
            <Text style={[s.ledgerLabel, { color: colors.maroon }]}>
              Elite Card · {Math.round(ELITE_RATE_DISCOUNT * 100)}% off
            </Text>
            <Text style={[s.ledgerValue, { color: colors.maroon }]}>−{peso(saved)}</Text>
          </View>
          <View style={s.rule} />
          <View style={s.ledgerRow}>
            <Text style={s.ledgerLabel}>Per night</Text>
            <Text style={s.ledgerValue}>{peso(elite)}</Text>
          </View>
          <View style={[s.ledgerRow, { paddingBottom: 0 }]}>
            <Text style={s.totalLabel}>
              {nights} night{nights > 1 ? 's' : ''}
            </Text>
            <Text style={s.totalValue}>{peso(total)}</Text>
          </View>

          <Text style={s.fineprint}>
            Excludes taxes and service charge. Rates are indicative for this prototype.
          </Text>
        </View>
      </ScrollView>

      {/* Action bar */}
      <View style={[s.actionBar, { paddingBottom: insets.bottom + spacing.md }]}>
        <View style={{ flex: 1 }}>
          <Text style={s.actionTotal}>{peso(total)}</Text>
          <Text style={s.actionMeta}>
            {nights} night{nights > 1 ? 's' : ''} · {fmtRange(search.checkIn, search.checkOut)}
          </Text>
        </View>
        <Pressable onPress={() => router.push('/booking/review')}>
          {({ pressed }) => (
            <View style={[s.reserve, pressed && { opacity: 0.85 }]}>
              <Text style={s.reserveText}>Reserve</Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  missingText: { fontSize: 15, color: colors.inkMuted },
  missingLink: { fontSize: 15, color: colors.maroon, fontWeight: '700' },

  topFade: { position: 'absolute', left: 0, right: 0, top: 0, height: 120 },
  chrome: {
    position: 'absolute',
    left: spacing.xl,
    right: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  dots: {
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  dotActive: { backgroundColor: colors.goldLight, width: 14 },

  body: { padding: spacing.xl },
  eyebrow: { fontSize: 9.5, letterSpacing: 1.6, fontWeight: '700', color: colors.gold },
  name: {
    fontFamily: serif,
    fontSize: 30,
    fontWeight: '700',
    color: colors.ink,
    marginTop: 6,
  },
  blurb: { fontSize: 15, lineHeight: 22, color: colors.inkMuted, marginTop: spacing.sm },

  rule: { height: 1, backgroundColor: colors.line, marginVertical: spacing.lg },
  specs: { flexDirection: 'row', alignItems: 'center' },
  spec: { flex: 1, alignItems: 'center' },
  specDivider: { width: 1, height: 30, backgroundColor: colors.line },
  specValue: { fontFamily: serif, fontSize: 20, fontWeight: '700', color: colors.ink },
  specLabel: {
    fontSize: 8.5,
    letterSpacing: 1.2,
    fontWeight: '700',
    color: colors.gold,
    marginTop: 4,
  },

  amenities: { marginTop: spacing.md, gap: spacing.sm },
  amenity: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  amenityText: { fontSize: 14.5, color: colors.ink },

  rateDates: { fontSize: 12.5, color: colors.inkMuted, marginTop: 6 },
  ledgerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  ledgerLabel: { fontSize: 14.5, color: colors.inkMuted },
  ledgerValue: { fontFamily: serif, fontSize: 16, color: colors.ink, fontWeight: '600' },
  totalLabel: { fontSize: 15, color: colors.ink, fontWeight: '700' },
  totalValue: { fontFamily: serif, fontSize: 24, color: colors.maroon, fontWeight: '700' },

  fineprint: {
    fontSize: 11,
    lineHeight: 16,
    color: colors.inkFaint,
    marginTop: spacing.lg,
  },

  actionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    ...shadow.lifted,
  },
  actionTotal: { fontFamily: serif, fontSize: 22, fontWeight: '700', color: colors.ink },
  actionMeta: { fontSize: 11.5, color: colors.inkMuted, marginTop: 1 },
  reserve: {
    backgroundColor: colors.maroon,
    paddingHorizontal: spacing.xxl,
    paddingVertical: 14,
    borderRadius: radius.pill,
  },
  reserveText: { color: colors.onDark, fontSize: 15, fontWeight: '700' },
});
