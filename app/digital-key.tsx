import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Lockup, ParkMarkGold, serif } from '@/components/Brand';
import { colors, gradients, radius, spacing } from '@/constants/theme';
import { stay } from '@/data/hotel';

const HOLD_MS = 1200;
const RESET_MS = 5000;

type Phase = 'idle' | 'holding' | 'unlocked';

export default function DigitalKey() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [phase, setPhase] = useState<Phase>('idle');

  const progress = useRef(new Animated.Value(0)).current;
  const halo = useRef(new Animated.Value(0)).current;
  const holdAnim = useRef<Animated.CompositeAnimation | null>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      holdAnim.current?.stop();
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    [],
  );

  function startHold() {
    if (phase === 'unlocked') return;
    setPhase('holding');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

    holdAnim.current = Animated.timing(progress, {
      toValue: 1,
      duration: HOLD_MS,
      easing: Easing.linear,
      useNativeDriver: false,
    });
    holdAnim.current.start(({ finished }) => {
      if (!finished) return;
      unlock();
    });
  }

  function cancelHold() {
    if (phase !== 'holding') return;
    holdAnim.current?.stop();
    setPhase('idle');
    Animated.timing(progress, {
      toValue: 0,
      duration: 220,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }

  function unlock() {
    setPhase('unlocked');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

    Animated.sequence([
      Animated.timing(halo, {
        toValue: 1,
        duration: 480,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(halo, {
        toValue: 0,
        duration: 420,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    resetTimer.current = setTimeout(() => {
      setPhase('idle');
      progress.setValue(0);
    }, RESET_MS);
  }

  const unlocked = phase === 'unlocked';

  return (
    <View style={{ flex: 1, backgroundColor: colors.pageDeep }}>
      <LinearGradient colors={gradients.card} style={StyleSheet.absoluteFill} />

      <View style={[s.wrap, { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + spacing.xl }]}>
        {/* Close */}
        <Pressable onPress={() => router.back()} hitSlop={12} style={s.close}>
          {({ pressed }) => (
            <View style={[s.closeInner, pressed && { opacity: 0.6 }]}>
              <Ionicons name="close" size={20} color={colors.onDark} />
            </View>
          )}
        </Pressable>

        <View style={s.top}>
          <Lockup width={172} />
        </View>

        {/* Room */}
        <View style={s.center}>
          <Text style={s.eyebrow}>YOUR ROOM</Text>
          <Text style={s.room}>{stay.room}</Text>
          <Text style={s.meta}>
            {stay.roomType} · until {stay.checkOut}
          </Text>

          {/* Key disc */}
          <View style={s.discWrap}>
            <Animated.View
              pointerEvents="none"
              style={[
                s.halo,
                {
                  opacity: halo.interpolate({ inputRange: [0, 1], outputRange: [0, 0.55] }),
                  transform: [
                    { scale: halo.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1.55] }) },
                  ],
                },
              ]}
            />

            <Pressable
              onPressIn={startHold}
              onPressOut={cancelHold}
              disabled={unlocked}
              style={s.disc}>
              {/* fill rises as you hold */}
              <Animated.View
                pointerEvents="none"
                style={[
                  s.discFill,
                  {
                    height: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
              <View style={s.discContent}>
                {unlocked ? (
                  <Ionicons name="lock-open" size={44} color={colors.pageDeep} />
                ) : (
                  <ParkMarkGold size={58} opacity={0.95} />
                )}
              </View>
            </Pressable>
          </View>

          <Text style={[s.action, unlocked && { color: colors.goldLight }]}>
            {unlocked
              ? 'Door unlocked'
              : phase === 'holding'
                ? 'Keep holding…'
                : 'Hold to unlock'}
          </Text>
          <Text style={s.hint}>
            {unlocked
              ? 'Hold your phone near the reader'
              : `Room ${stay.room} · ${stay.confirmation}`}
          </Text>
        </View>

        {/* Footer */}
        <View style={s.footer}>
          <View style={s.chip}>
            <View style={[s.dot, { backgroundColor: unlocked ? colors.success : colors.gold }]} />
            <Text style={s.chipText}>
              {unlocked ? 'Access granted' : stay.keyReady ? 'Key active' : 'Key pending'}
            </Text>
          </View>
          <Text style={s.disclaimer}>
            Prototype — no lock is contacted. A live build would use the hotel's BLE or NFC
            lock SDK.
          </Text>
        </View>
      </View>
    </View>
  );
}

const DISC = 190;

const s = StyleSheet.create({
  wrap: { flex: 1, paddingHorizontal: spacing.xl },
  close: { position: 'absolute', right: spacing.xl, zIndex: 5 },
  closeInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: colors.lineOnDark,
  },
  top: { alignItems: 'center', paddingTop: spacing.xxl },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  eyebrow: { fontSize: 9.5, letterSpacing: 1.8, fontWeight: '700', color: colors.gold },
  room: {
    fontFamily: serif,
    fontSize: 68,
    lineHeight: 76,
    fontWeight: '700',
    color: colors.onDark,
  },
  meta: { fontSize: 13, color: colors.onDarkMuted },

  discWrap: { marginTop: spacing.xxl, alignItems: 'center', justifyContent: 'center' },
  halo: {
    position: 'absolute',
    width: DISC,
    height: DISC,
    borderRadius: DISC / 2,
    backgroundColor: colors.goldLight,
  },
  disc: {
    width: DISC,
    height: DISC,
    borderRadius: DISC / 2,
    borderWidth: 2,
    borderColor: 'rgba(228,199,102,0.5)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  discFill: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.goldLight,
  },
  discContent: { alignItems: 'center', justifyContent: 'center' },

  action: {
    fontFamily: serif,
    fontSize: 19,
    fontWeight: '700',
    color: colors.onDark,
    marginTop: spacing.xl,
  },
  hint: { fontSize: 12, color: colors.onDarkFaint, marginTop: 5 },

  footer: { alignItems: 'center', gap: spacing.md },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.hairline,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  dot: { width: 7, height: 7, borderRadius: 4 },
  chipText: { fontSize: 11.5, fontWeight: '700', color: colors.onDark, letterSpacing: 0.3 },
  disclaimer: {
    fontSize: 10.5,
    lineHeight: 16,
    color: colors.onDarkFaint,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
});
