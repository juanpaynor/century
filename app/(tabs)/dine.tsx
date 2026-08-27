import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { serif } from '@/components/Brand';
import { colors, peso, radius, shadow, spacing } from '@/constants/theme';
import {
  eliteProgram,
  member,
  menu,
  menuCategories,
  outlets,
  roomServiceBlurb,
  stay,
  type MenuItem,
} from '@/data/hotel';
import { useApp } from '@/data/store';

type Tab = 'outlets' | 'service';

function Segmented({ value, onChange }: { value: Tab; onChange: (t: Tab) => void }) {
  const items: { key: Tab; label: string }[] = [
    { key: 'outlets', label: 'Outlets' },
    { key: 'service', label: 'Room Service' },
  ];
  return (
    <View style={s.segmented}>
      {items.map((it) => {
        const active = it.key === value;
        return (
          <Pressable key={it.key} style={s.segment} onPress={() => onChange(it.key)}>
            <View style={[s.segmentInner, active && s.segmentActive]}>
              <Text style={[s.segmentText, active && s.segmentTextActive]}>{it.label}</Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

function MenuRow({ item }: { item: MenuItem }) {
  const { cart, addToCart, setQty } = useApp();
  const line = cart.find((l) => l.item.id === item.id);

  return (
    <View style={s.menuRow}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={s.menuImg} contentFit="cover" />
      ) : (
        <View style={[s.menuImg, s.menuImgEmpty]}>
          <Ionicons name="wine-outline" size={20} color={colors.inkFaint} />
        </View>
      )}

      <View style={{ flex: 1 }}>
        <Text style={s.menuName}>{item.name}</Text>
        <Text style={s.menuDesc} numberOfLines={2}>
          {item.desc}
        </Text>
        <View style={s.menuFoot}>
          <Text style={s.menuPrice}>{peso(item.price)}</Text>
          <Text style={s.menuOutlet}>{item.outlet}</Text>
        </View>
      </View>

      {line ? (
        <View style={s.qty}>
          <Pressable onPress={() => setQty(item.id, line.qty - 1)} hitSlop={6} style={s.qtyBtn}>
            <Ionicons name="remove" size={15} color={colors.maroon} />
          </Pressable>
          <Text style={s.qtyText}>{line.qty}</Text>
          <Pressable onPress={() => setQty(item.id, line.qty + 1)} hitSlop={6} style={s.qtyBtn}>
            <Ionicons name="add" size={15} color={colors.maroon} />
          </Pressable>
        </View>
      ) : (
        <Pressable onPress={() => addToCart(item)} hitSlop={8}>
          {({ pressed }) => (
            <View style={[s.addBtn, pressed && { opacity: 0.7 }]}>
              <Ionicons name="add" size={19} color={colors.onDark} />
            </View>
          )}
        </Pressable>
      )}
    </View>
  );
}

export default function DineScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { cartCount, cartTotal } = useApp();

  const [tab, setTab] = useState<Tab>('outlets');
  const [category, setCategory] = useState('Popular');

  const visible = useMemo(
    () => (category === 'Popular' ? menu.filter((m) => m.popular) : menu.filter((m) => m.category === category)),
    [category],
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + spacing.lg,
          paddingBottom: cartCount > 0 ? 170 : spacing.xxxl * 2,
        }}>
        <View style={s.head}>
          <Text style={s.eyebrow}>EAT & DRINK</Text>
          <Text style={s.title}>Dining</Text>
        </View>

        <Segmented value={tab} onChange={setTab} />

        {tab === 'outlets' ? (
          <>
            <View style={s.eliteStrip}>
              <View style={s.eliteBadge}>
                <Text style={s.eliteBadgeText}>ELITE CARD</Text>
              </View>
              <Text style={s.eliteCopy}>
                {eliteProgram.diningTable[0].off} off for two, scaling to{' '}
                {eliteProgram.diningTable[3].off} for larger parties
              </Text>
            </View>

            <View style={{ gap: spacing.lg, paddingHorizontal: spacing.xl }}>
              {outlets.map((o) => (
                <Pressable key={o.id} onPress={() => router.push(`/outlet/${o.id}`)}>
                  {({ pressed }) => (
                    <View style={[s.card, pressed && { opacity: 0.9 }]}>
                      <Image source={o.image} style={s.cardImg} contentFit="cover" />
                      <View style={s.cardBody}>
                        <View style={s.cardTop}>
                          <Text style={s.outletName}>{o.name}</Text>
                          <Text style={s.priceBand}>{o.priceBand}</Text>
                        </View>
                        <Text style={s.outletKind}>{o.kind}</Text>
                        <View style={s.cardRule} />
                        <View style={s.cardFoot}>
                          <Ionicons name="time-outline" size={13} color={colors.inkFaint} />
                          <Text style={s.hours} numberOfLines={1}>
                            {o.hours}
                          </Text>
                          <View style={{ flex: 1 }} />
                          <Text style={s.eliteTag}>{o.eliteDiscount.toUpperCase()}</Text>
                        </View>
                      </View>
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          </>
        ) : (
          <>
            <View style={s.serviceIntro}>
              <View style={s.deliverTo}>
                <Ionicons name="location-outline" size={15} color={colors.maroon} />
                <Text style={s.deliverToText}>
                  Delivering to <Text style={{ fontWeight: '700' }}>Room {stay.room}</Text>
                </Text>
                <View style={{ flex: 1 }} />
                <Text style={s.eta}>30–45 min</Text>
              </View>
              <Text style={s.serviceBlurb}>{roomServiceBlurb}</Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.chips}>
              {menuCategories.map((c) => {
                const active = c === category;
                return (
                  <Pressable key={c} onPress={() => setCategory(c)}>
                    <View style={[s.chip, active && s.chipActive]}>
                      <Text style={[s.chipText, active && s.chipTextActive]}>{c}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={{ paddingHorizontal: spacing.xl }}>
              {visible.length ? (
                visible.map((m) => <MenuRow key={m.id} item={m} />)
              ) : (
                <Text style={s.empty}>Nothing in this section yet.</Text>
              )}
            </View>
          </>
        )}
      </ScrollView>

      {/* Cart bar */}
      {cartCount > 0 ? (
        <Pressable
          onPress={() => router.push('/dine/cart')}
          style={[s.cartBar, { paddingBottom: insets.bottom + spacing.md }]}>
          {({ pressed }) => (
            <View style={[s.cartInner, pressed && { opacity: 0.88 }]}>
              <View style={s.cartCount}>
                <Text style={s.cartCountText}>{cartCount}</Text>
              </View>
              <Text style={s.cartLabel}>View order</Text>
              <View style={{ flex: 1 }} />
              <Text style={s.cartTotal}>{peso(cartTotal)}</Text>
              <Ionicons name="chevron-forward" size={17} color={colors.onDark} />
            </View>
          )}
        </Pressable>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  head: { paddingHorizontal: spacing.xl },
  eyebrow: { fontSize: 9.5, letterSpacing: 1.6, fontWeight: '700', color: colors.gold },
  title: { fontFamily: serif, fontSize: 30, fontWeight: '700', color: colors.ink, marginTop: 5 },

  segmented: {
    flexDirection: 'row',
    marginHorizontal: spacing.xl,
    marginTop: spacing.lg,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    padding: 3,
  },
  segment: { flex: 1 },
  segmentInner: { paddingVertical: 9, borderRadius: radius.pill, alignItems: 'center' },
  segmentActive: { backgroundColor: colors.maroon },
  segmentText: { fontSize: 13.5, fontWeight: '600', color: colors.inkMuted },
  segmentTextActive: { color: colors.onDark, fontWeight: '700' },

  eliteStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  eliteBadge: {
    backgroundColor: colors.maroon,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: radius.sm,
  },
  eliteBadgeText: { fontSize: 9, letterSpacing: 1.1, fontWeight: '800', color: colors.goldLight },
  eliteCopy: { flex: 1, fontSize: 12.5, color: colors.inkMuted },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
    ...shadow.card,
  },
  cardImg: { width: '100%', aspectRatio: 16 / 10, backgroundColor: colors.surfaceAlt },
  cardBody: { padding: spacing.lg },
  cardTop: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm },
  outletName: { flex: 1, fontFamily: serif, fontSize: 20, fontWeight: '700', color: colors.ink },
  /* letterSpacing keeps the ₱ crossbars from joining into a strikethrough */
  priceBand: { fontSize: 12, letterSpacing: 2, color: colors.gold, fontWeight: '700' },
  outletKind: { fontSize: 12.5, color: colors.inkMuted, marginTop: 2 },
  cardRule: { height: 1, backgroundColor: colors.line, marginVertical: spacing.md },
  cardFoot: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  hours: { fontSize: 11.5, color: colors.inkMuted, flexShrink: 1 },
  eliteTag: { fontSize: 9, letterSpacing: 1, fontWeight: '800', color: colors.maroon },

  serviceIntro: { paddingHorizontal: spacing.xl, marginTop: spacing.lg },
  deliverTo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.maroonSoft,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 11,
  },
  deliverToText: { fontSize: 13, color: colors.ink },
  eta: { fontSize: 11.5, color: colors.maroon, fontWeight: '700' },
  serviceBlurb: {
    fontSize: 13.5,
    lineHeight: 20,
    color: colors.inkMuted,
    marginTop: spacing.md,
  },

  chips: { paddingHorizontal: spacing.xl, gap: spacing.sm, paddingVertical: spacing.lg },
  chip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  chipActive: { backgroundColor: colors.maroon, borderColor: colors.maroon },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.inkMuted },
  chipTextActive: { color: colors.onDark },

  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  menuImg: { width: 66, height: 66, borderRadius: radius.md, backgroundColor: colors.surfaceAlt },
  menuImgEmpty: { alignItems: 'center', justifyContent: 'center' },
  menuName: { fontSize: 15, fontWeight: '600', color: colors.ink },
  menuDesc: { fontSize: 12.5, lineHeight: 17, color: colors.inkMuted, marginTop: 2 },
  menuFoot: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 5 },
  menuPrice: { fontFamily: serif, fontSize: 15, fontWeight: '700', color: colors.ink },
  menuOutlet: { fontSize: 10.5, color: colors.inkFaint },

  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.maroon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  qtyBtn: { padding: 2 },
  qtyText: { fontSize: 14, fontWeight: '700', color: colors.ink, minWidth: 14, textAlign: 'center' },

  empty: { fontSize: 14, color: colors.inkFaint, textAlign: 'center', paddingVertical: spacing.xxl },

  cartBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  cartInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.maroon,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    ...shadow.lifted,
  },
  cartCount: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    paddingHorizontal: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartCountText: { color: colors.onDark, fontSize: 12, fontWeight: '800' },
  cartLabel: { color: colors.onDark, fontSize: 15, fontWeight: '700' },
  cartTotal: { fontFamily: serif, color: colors.goldLight, fontSize: 17, fontWeight: '700' },
});
