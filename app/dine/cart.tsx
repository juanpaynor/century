import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { serif } from '@/components/Brand';
import { colors, peso, radius, shadow, spacing } from '@/constants/theme';
import { stay } from '@/data/hotel';
import { useApp } from '@/data/store';

/** Service charge and VAT are indicative — replace with the real rates. */
const SERVICE_CHARGE = 0.1;
const VAT = 0.12;

export default function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { cart, cartTotal, setQty, placeOrder } = useApp();
  const [note, setNote] = useState('');
  const [placed, setPlaced] = useState<string | null>(null);

  const service = Math.round(cartTotal * SERVICE_CHARGE);
  const vat = Math.round((cartTotal + service) * VAT);
  const grand = cartTotal + service + vat;

  if (placed) {
    return (
      <View style={[s.done, { paddingBottom: insets.bottom + spacing.xxl }]}>
        <View style={s.tick}>
          <Ionicons name="checkmark" size={34} color={colors.onDark} />
        </View>
        <Text style={s.doneTitle}>Order placed</Text>
        <Text style={s.doneBody}>
          {placed} · delivering to Room {stay.room}
        </Text>
        <Text style={s.doneMeta}>Estimated 30–45 minutes</Text>
        <Pressable onPress={() => router.back()} style={{ alignSelf: 'stretch' }}>
          {({ pressed }) => (
            <View style={[s.primary, pressed && { opacity: 0.85 }]}>
              <Text style={s.primaryText}>Done</Text>
            </View>
          )}
        </Pressable>
      </View>
    );
  }

  if (!cart.length) {
    return (
      <View style={s.done}>
        <Ionicons name="basket-outline" size={40} color={colors.inkFaint} />
        <Text style={s.doneTitle}>Your order is empty</Text>
        <Text style={s.doneBody}>Add something from the room service menu.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: spacing.xl, paddingBottom: 230 }}>
        <View style={s.deliverTo}>
          <Ionicons name="location-outline" size={15} color={colors.maroon} />
          <Text style={s.deliverToText}>
            Room {stay.room} · {stay.roomType}
          </Text>
        </View>

        {cart.map((l) => (
          <View key={l.item.id} style={s.line}>
            {l.item.image ? (
              <Image source={{ uri: l.item.image }} style={s.lineImg} contentFit="cover" />
            ) : (
              <View style={[s.lineImg, s.lineImgEmpty]}>
                <Ionicons name="wine-outline" size={18} color={colors.inkFaint} />
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={s.lineName}>{l.item.name}</Text>
              <Text style={s.lineOutlet}>{l.item.outlet}</Text>
              <Text style={s.linePrice}>{peso(l.item.price * l.qty)}</Text>
            </View>
            <View style={s.qty}>
              <Pressable onPress={() => setQty(l.item.id, l.qty - 1)} hitSlop={6} style={s.qtyBtn}>
                <Ionicons
                  name={l.qty === 1 ? 'trash-outline' : 'remove'}
                  size={15}
                  color={colors.maroon}
                />
              </Pressable>
              <Text style={s.qtyText}>{l.qty}</Text>
              <Pressable onPress={() => setQty(l.item.id, l.qty + 1)} hitSlop={6} style={s.qtyBtn}>
                <Ionicons name="add" size={15} color={colors.maroon} />
              </Pressable>
            </View>
          </View>
        ))}

        <Text style={s.eyebrow}>NOTES FOR THE KITCHEN</Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Allergies, preferences, delivery timing…"
          placeholderTextColor={colors.inkFaint}
          multiline
          style={s.input}
        />

        <View style={s.totals}>
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>Subtotal</Text>
            <Text style={s.totalValue}>{peso(cartTotal)}</Text>
          </View>
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>Service charge {SERVICE_CHARGE * 100}%</Text>
            <Text style={s.totalValue}>{peso(service)}</Text>
          </View>
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>VAT {VAT * 100}%</Text>
            <Text style={s.totalValue}>{peso(vat)}</Text>
          </View>
          <View style={s.rule} />
          <View style={s.totalRow}>
            <Text style={s.grandLabel}>Charged to your room</Text>
            <Text style={s.grandValue}>{peso(grand)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[s.bar, { paddingBottom: insets.bottom + spacing.md }]}>
        <Pressable
          onPress={() => {
            const order = placeOrder(note);
            setPlaced(order.id);
          }}>
          {({ pressed }) => (
            <View style={[s.primary, pressed && { opacity: 0.85 }]}>
              <Text style={s.primaryText}>Place order · {peso(grand)}</Text>
            </View>
          )}
        </Pressable>
        <Text style={s.barNote}>Charged to folio, settled at check-out.</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  done: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    gap: spacing.sm,
  },
  tick: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: colors.maroon,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  doneTitle: { fontFamily: serif, fontSize: 24, fontWeight: '700', color: colors.ink },
  doneBody: { fontSize: 14.5, color: colors.inkMuted, textAlign: 'center' },
  doneMeta: { fontSize: 12.5, color: colors.gold, fontWeight: '700', marginBottom: spacing.xl },

  deliverTo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.maroonSoft,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 11,
    marginBottom: spacing.lg,
  },
  deliverToText: { fontSize: 13, color: colors.ink, fontWeight: '600' },

  line: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  lineImg: { width: 54, height: 54, borderRadius: radius.sm, backgroundColor: colors.surfaceAlt },
  lineImgEmpty: { alignItems: 'center', justifyContent: 'center' },
  lineName: { fontSize: 14.5, fontWeight: '600', color: colors.ink },
  lineOutlet: { fontSize: 11, color: colors.inkFaint, marginTop: 1 },
  linePrice: { fontFamily: serif, fontSize: 14.5, fontWeight: '700', color: colors.ink, marginTop: 3 },

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

  eyebrow: {
    fontSize: 9.5,
    letterSpacing: 1.6,
    fontWeight: '700',
    color: colors.gold,
    marginTop: spacing.xl,
  },
  input: {
    marginTop: spacing.sm,
    minHeight: 76,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    fontSize: 14,
    color: colors.ink,
    textAlignVertical: 'top',
  },

  totals: { marginTop: spacing.xl },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingVertical: 6,
  },
  totalLabel: { fontSize: 14, color: colors.inkMuted },
  totalValue: { fontFamily: serif, fontSize: 15, color: colors.ink },
  rule: { height: 1, backgroundColor: colors.line, marginVertical: spacing.sm },
  grandLabel: { fontSize: 15, fontWeight: '700', color: colors.ink },
  grandValue: { fontFamily: serif, fontSize: 23, fontWeight: '700', color: colors.maroon },

  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    ...shadow.lifted,
  },
  primary: {
    backgroundColor: colors.maroon,
    borderRadius: radius.pill,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryText: { color: colors.onDark, fontSize: 15, fontWeight: '700' },
  barNote: {
    fontSize: 11,
    color: colors.inkFaint,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
