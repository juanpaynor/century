import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { serif } from '@/components/Brand';
import { fmtRange } from '@/constants/dates';
import { colors, peso, radius, shadow, spacing } from '@/constants/theme';
import { ELITE_RATE_DISCOUNT, eliteRate, member, rooms, type Room } from '@/data/hotel';
import { useApp } from '@/data/store';

function RoomCard({ room, onPress }: { room: Room; onPress: () => void }) {
  const elite = eliteRate(room.rate);
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View style={[s.card, pressed && { opacity: 0.9 }]}>
          <View style={s.photoWrap}>
            <Image
              source={typeof room.image === 'string' ? { uri: room.image } : room.image}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
            />
            {room.tag ? (
              <View style={s.tag}>
                <Text style={s.tagText}>{room.tag.toUpperCase()}</Text>
              </View>
            ) : null}
            <LinearGradient
              colors={['transparent', 'rgba(26,18,20,0.35)']}
              style={s.photoFade}
              pointerEvents="none"
            />
          </View>

          <View style={s.cardBody}>
            <Text style={s.roomName}>{room.name}</Text>
            <Text style={s.roomSpec}>
              {room.sqm} sqm · {room.bed} · up to {room.occupancy}
            </Text>

            <View style={s.cardRule} />

            <View style={s.rateRow}>
              <View style={s.rateLeft}>
                <Text style={s.barRate}>{peso(room.rate)}</Text>
                <Text style={s.eliteRate}>{peso(elite)}</Text>
              </View>
              <Text style={s.perNight}>/ night</Text>
            </View>
          </View>
        </View>
      )}
    </Pressable>
  );
}

export default function RoomsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { search, nights } = useApp();

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
          <Text style={s.eyebrow}>STAY WITH US</Text>
          <Text style={s.title}>Rooms & Suites</Text>
        </View>

        {/* Search bar */}
        <Pressable onPress={() => router.push('/booking/dates')} style={s.searchWrap}>
          {({ pressed }) => (
            <View style={[s.search, pressed && { opacity: 0.75 }]}>
              <Ionicons name="calendar-outline" size={17} color={colors.maroon} />
              <Text style={s.searchText}>{fmtRange(search.checkIn, search.checkOut)}</Text>
              <View style={s.searchDot} />
              <Text style={s.searchText}>
                {search.guests} guest{search.guests > 1 ? 's' : ''}
              </Text>
              <View style={{ flex: 1 }} />
              <Text style={s.searchNights}>
                {nights} night{nights > 1 ? 's' : ''}
              </Text>
              <Ionicons name="chevron-down" size={15} color={colors.inkFaint} />
            </View>
          )}
        </Pressable>

        {/* Elite strip */}
        <View style={s.eliteStrip}>
          <View style={s.eliteBadge}>
            <Text style={s.eliteBadgeText}>ELITE CARD</Text>
          </View>
          <Text style={s.eliteCopy}>
            {Math.round(ELITE_RATE_DISCOUNT * 100)}% off best available rate, applied below
          </Text>
        </View>

        <View style={{ gap: spacing.lg, paddingHorizontal: spacing.xl }}>
          {rooms.map((r) => (
            <RoomCard key={r.id} room={r} onPress={() => router.push(`/room/${r.id}`)} />
          ))}
        </View>

        <Text style={s.note}>
          Rates are indicative and exclude taxes and service charge.
        </Text>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  head: { paddingHorizontal: spacing.xl, marginBottom: spacing.lg },
  eyebrow: {
    fontSize: 9.5,
    letterSpacing: 1.6,
    fontWeight: '700',
    color: colors.gold,
  },
  title: {
    fontFamily: serif,
    fontSize: 30,
    fontWeight: '700',
    color: colors.ink,
    marginTop: 5,
  },

  searchWrap: { paddingHorizontal: spacing.xl },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    borderRadius: radius.pill,
    paddingVertical: 13,
    paddingHorizontal: spacing.lg,
    ...shadow.card,
  },
  searchText: { fontSize: 14, fontWeight: '600', color: colors.ink },
  searchDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: colors.inkFaint },
  searchNights: { fontSize: 12, color: colors.inkMuted, marginRight: 2 },

  eliteStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  eliteBadge: {
    backgroundColor: colors.maroon,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: radius.sm,
  },
  eliteBadgeText: {
    fontSize: 9,
    letterSpacing: 1.1,
    fontWeight: '800',
    color: colors.goldLight,
  },
  eliteCopy: { flex: 1, fontSize: 12.5, color: colors.inkMuted },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
    ...shadow.card,
  },
  photoWrap: { width: '100%', aspectRatio: 16 / 10, backgroundColor: colors.surfaceAlt },
  photoFade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 60 },
  tag: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(26,18,20,0.55)',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(228,199,102,0.45)',
  },
  tagText: {
    fontSize: 8.5,
    letterSpacing: 1.1,
    fontWeight: '800',
    color: colors.goldLight,
  },

  cardBody: { padding: spacing.lg },
  roomName: { fontFamily: serif, fontSize: 21, fontWeight: '700', color: colors.ink },
  roomSpec: { fontSize: 12.5, color: colors.inkMuted, marginTop: 3 },
  cardRule: { height: 1, backgroundColor: colors.line, marginVertical: spacing.md },

  rateRow: { flexDirection: 'row', alignItems: 'baseline' },
  rateLeft: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm, flex: 1 },
  barRate: {
    fontSize: 13,
    color: colors.inkFaint,
    textDecorationLine: 'line-through',
  },
  eliteRate: {
    fontFamily: serif,
    fontSize: 22,
    fontWeight: '700',
    color: colors.maroon,
  },
  perNight: { fontSize: 12, color: colors.inkMuted },

  note: {
    fontSize: 11,
    color: colors.inkFaint,
    textAlign: 'center',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xxl,
  },
});
