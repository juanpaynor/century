import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { serif } from '@/components/Brand';
import {
  WEEKDAYS,
  addDays,
  fmtWithWeekday,
  isBetween,
  monthGrid,
  monthLabel,
  nightsBetween,
  sameDay,
  startOfDay,
} from '@/constants/dates';
import { colors, radius, shadow, spacing } from '@/constants/theme';
import { useApp } from '@/data/store';

const MONTHS_SHOWN = 4;

export default function DatesSheet() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { search, setSearch } = useApp();

  const [checkIn, setCheckIn] = useState<Date>(search.checkIn);
  const [checkOut, setCheckOut] = useState<Date | null>(search.checkOut);
  const [guests, setGuests] = useState(search.guests);

  const today = startOfDay(new Date());
  const nights = checkOut ? nightsBetween(checkIn, checkOut) : 0;

  /** First tap sets check-in and clears check-out; second tap closes the range. */
  function onPickDay(d: Date) {
    if (!checkOut) {
      if (startOfDay(d).getTime() <= startOfDay(checkIn).getTime()) {
        setCheckIn(d);
        return;
      }
      setCheckOut(d);
      return;
    }
    setCheckIn(d);
    setCheckOut(null);
  }

  function apply() {
    setSearch({ checkIn, checkOut: checkOut ?? addDays(checkIn, 1), guests });
    router.back();
  }

  const now = new Date();
  const months = Array.from({ length: MONTHS_SHOWN }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingBottom: 180 }}>
        {/* Guests */}
        <View style={s.block}>
          <Text style={s.eyebrow}>GUESTS</Text>
          <View style={s.stepperRow}>
            <Text style={s.stepperLabel}>
              {guests} guest{guests > 1 ? 's' : ''}
            </Text>
            <View style={s.stepper}>
              <Pressable
                onPress={() => setGuests((g) => Math.max(1, g - 1))}
                disabled={guests <= 1}
                style={({ pressed }) => [
                  s.stepBtn,
                  (pressed || guests <= 1) && { opacity: 0.4 },
                ]}>
                <Ionicons name="remove" size={19} color={colors.maroon} />
              </Pressable>
              <Pressable
                onPress={() => setGuests((g) => Math.min(6, g + 1))}
                disabled={guests >= 6}
                style={({ pressed }) => [
                  s.stepBtn,
                  (pressed || guests >= 6) && { opacity: 0.4 },
                ]}>
                <Ionicons name="add" size={19} color={colors.maroon} />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Calendar */}
        <View style={[s.block, { paddingBottom: spacing.sm }]}>
          <Text style={s.eyebrow}>DATES</Text>
          <Text style={s.hint}>
            {checkOut ? 'Tap any date to start again' : 'Now choose your check-out date'}
          </Text>
        </View>

        <View style={s.weekdays}>
          {WEEKDAYS.map((w, i) => (
            <Text key={i} style={s.weekday}>
              {w}
            </Text>
          ))}
        </View>

        {months.map(({ year, month }) => (
          <View key={`${year}-${month}`} style={s.month}>
            <Text style={s.monthLabel}>{monthLabel(year, month)}</Text>
            <View style={s.grid}>
              {monthGrid(year, month).map((d, i) => {
                if (!d) return <View key={i} style={s.cell} />;

                const past = startOfDay(d).getTime() < today.getTime();
                const isIn = sameDay(d, checkIn);
                const isOut = checkOut ? sameDay(d, checkOut) : false;
                const inRange = checkOut ? isBetween(d, checkIn, checkOut) : false;
                const edge = isIn || isOut;

                return (
                  <View key={i} style={s.cell}>
                    {inRange ? <View style={s.rangeFill} /> : null}
                    {isIn && checkOut ? <View style={[s.rangeFill, s.rangeStart]} /> : null}
                    {isOut ? <View style={[s.rangeFill, s.rangeEnd]} /> : null}
                    <Pressable
                      disabled={past}
                      onPress={() => onPickDay(d)}
                      style={({ pressed }) => [
                        s.day,
                        edge && s.dayEdge,
                        pressed && !past && !edge && s.dayPressed,
                      ]}>
                      <Text
                        style={[
                          s.dayText,
                          past && s.dayPast,
                          inRange && s.dayInRange,
                          edge && s.dayEdgeText,
                        ]}>
                        {d.getDate()}
                      </Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Summary + apply */}
      <View style={[s.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <View style={s.summary}>
          <View style={{ flex: 1 }}>
            <Text style={s.summaryLabel}>CHECK IN</Text>
            <Text style={s.summaryValue}>{fmtWithWeekday(checkIn)}</Text>
          </View>
          <Ionicons name="arrow-forward" size={16} color={colors.inkFaint} />
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text style={s.summaryLabel}>CHECK OUT</Text>
            <Text style={s.summaryValue}>
              {checkOut ? fmtWithWeekday(checkOut) : '—'}
            </Text>
          </View>
        </View>

        <Pressable onPress={apply} disabled={!checkOut}>
          {({ pressed }) => (
            <View style={[s.apply, (pressed || !checkOut) && { opacity: 0.55 }]}>
              <Text style={s.applyText}>
                {checkOut ? `Apply · ${nights} night${nights > 1 ? 's' : ''}` : 'Select check-out'}
              </Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const CELL = `${100 / 7}%`;

const s = StyleSheet.create({
  block: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  eyebrow: { fontSize: 9.5, letterSpacing: 1.6, fontWeight: '700', color: colors.gold },
  hint: { fontSize: 12.5, color: colors.inkMuted, marginTop: 6 },

  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  stepperLabel: { fontFamily: serif, fontSize: 20, fontWeight: '700', color: colors.ink },
  stepper: { flexDirection: 'row', gap: spacing.sm },
  stepBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: colors.surface,
  },

  weekdays: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  weekday: {
    width: CELL,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '700',
    color: colors.inkFaint,
    letterSpacing: 0.5,
  },

  month: { marginTop: spacing.lg, paddingHorizontal: spacing.xl },
  monthLabel: {
    fontFamily: serif,
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },

  cell: {
    width: CELL,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rangeFill: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '12%',
    bottom: '12%',
    backgroundColor: colors.maroonSoft,
  },
  rangeStart: { left: '50%', right: 0 },
  rangeEnd: { left: 0, right: '50%' },

  day: {
    width: '78%',
    aspectRatio: 1,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayPressed: { backgroundColor: colors.surfaceAlt },
  dayEdge: { backgroundColor: colors.maroon },
  dayText: { fontSize: 14.5, color: colors.ink, fontWeight: '500' },
  dayPast: { color: colors.inkFaint, opacity: 0.45 },
  dayInRange: { color: colors.maroon, fontWeight: '600' },
  dayEdgeText: { color: colors.onDark, fontWeight: '700' },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    gap: spacing.md,
    ...shadow.lifted,
  },
  summary: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  summaryLabel: { fontSize: 9, letterSpacing: 1.2, fontWeight: '700', color: colors.gold },
  summaryValue: {
    fontFamily: serif,
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
    marginTop: 3,
  },
  apply: {
    backgroundColor: colors.maroon,
    borderRadius: radius.pill,
    paddingVertical: 15,
    alignItems: 'center',
  },
  applyText: { color: colors.onDark, fontSize: 15, fontWeight: '700' },
});
