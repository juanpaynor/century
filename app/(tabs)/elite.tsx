import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ParkMarkGold, serif } from '@/components/Brand';
import { EliteCard } from '@/components/EliteCard';
import { colors, peso, radius, spacing } from '@/constants/theme';
import {
  POINTS_PER_PESO,
  eliteProgram,
  member,
  rewardGroups,
  rewards,
  type Reward,
} from '@/data/hotel';
import { useApp } from '@/data/store';

/* ── local primitives ── */

function Eyebrow({ children, style }: { children: string; style?: object }) {
  return <Text style={[s.eyebrow, style]}>{children}</Text>;
}

function RewardRow({
  reward,
  balance,
  onRedeem,
}: {
  reward: Reward;
  balance: number;
  onRedeem: (r: Reward) => void;
}) {
  const affordable = balance >= reward.points;
  const short = reward.points - balance;

  return (
    <View style={s.reward}>
      <View style={s.rewardIcon}>
        <Ionicons
          name={reward.icon as keyof typeof Ionicons.glyphMap}
          size={19}
          color={affordable ? colors.goldLight : colors.onDarkFaint}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={[s.rewardTitle, !affordable && { color: colors.onDarkMuted }]}>
          {reward.title}
        </Text>
        <Text style={s.rewardDetail} numberOfLines={1}>
          {reward.detail}
        </Text>
        <Text style={s.rewardValue}>Worth about {peso(reward.value)}</Text>
      </View>

      <View style={{ alignItems: 'flex-end', gap: 6 }}>
        <Text style={[s.rewardPoints, !affordable && { color: colors.onDarkFaint }]}>
          {reward.points.toLocaleString('en-PH')}
        </Text>
        {affordable ? (
          <Pressable onPress={() => onRedeem(reward)} hitSlop={6}>
            {({ pressed }) => (
              <View style={[s.redeemBtn, pressed && { opacity: 0.7 }]}>
                <Text style={s.redeemBtnText}>REDEEM</Text>
              </View>
            )}
          </Pressable>
        ) : (
          <Text style={s.shortText}>{short.toLocaleString('en-PH')} more</Text>
        )}
      </View>
    </View>
  );
}

/* ── screen ── */

export default function EliteScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { points, pointsHistory, redeemReward, certificates, redeemCertificate } = useApp();
  const [group, setGroup] = useState<(typeof rewardGroups)[number]>('Stays');

  const cardW = width - spacing.xl * 2;
  const visible = useMemo(() => rewards.filter((r) => r.group === group), [group]);

  /** Cheapest reward still out of reach — gives the balance a target. */
  const nextUp = useMemo(
    () =>
      rewards
        .filter((r) => r.points > points)
        .sort((a, b) => a.points - b.points)[0] ?? null,
    [points],
  );

  function onRedeem(r: Reward) {
    Alert.alert(
      r.title,
      `Redeem for ${r.points.toLocaleString('en-PH')} points?\n\nYou'll have ${(
        points - r.points
      ).toLocaleString('en-PH')} left.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Redeem',
          onPress: () => {
            const ok = redeemReward(r);
            if (!ok) Alert.alert('Not enough points', 'Your balance has changed.');
          },
        },
      ],
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.page }}>
      <StatusBar style="light" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + spacing.lg,
          paddingBottom: spacing.xxxl * 2,
        }}>
        {/* Masthead */}
        <View style={s.head}>
          <Eyebrow>MEMBERSHIP</Eyebrow>
          <Text style={s.title}>Elite Card</Text>
        </View>

        {/* The card */}
        <View style={{ paddingHorizontal: spacing.xl, marginTop: spacing.lg }}>
          <EliteCard
            memberNo={member.memberNo}
            name={`${member.firstName} ${member.lastName}`}
            since={member.since}
            style={{ width: cardW }}
          />
        </View>

        {/* Balance */}
        <View style={s.balance}>
          <Text style={s.balanceValue}>{points.toLocaleString('en-PH')}</Text>
          <Text style={s.balanceLabel}>POINTS AVAILABLE</Text>
          {nextUp ? (
            <Text style={s.nextUp}>
              {(nextUp.points - points).toLocaleString('en-PH')} more for {nextUp.title.toLowerCase()}
            </Text>
          ) : (
            <Text style={s.nextUp}>Everything in the catalogue is within reach</Text>
          )}
        </View>

        {/* Year to date */}
        <View style={s.stats}>
          <View style={s.stat}>
            <Text style={s.statValue}>{member.ytdNights}</Text>
            <Text style={s.statLabel}>NIGHTS</Text>
          </View>
          <View style={s.statDivider} />
          <View style={s.stat}>
            <Text style={s.statValue}>{peso(member.ytdSpend)}</Text>
            <Text style={s.statLabel}>SPENT</Text>
          </View>
          <View style={s.statDivider} />
          <View style={s.stat}>
            <Text style={[s.statValue, { color: colors.goldLight }]}>{peso(member.ytdSaved)}</Text>
            <Text style={s.statLabel}>SAVED</Text>
          </View>
        </View>

        {/* Redeem */}
        <View style={s.section}>
          <Eyebrow>SPEND YOUR POINTS</Eyebrow>
          <Text style={s.sectionTitle}>Redeem</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: spacing.sm, paddingVertical: spacing.md }}>
            {rewardGroups.map((g) => {
              const active = g === group;
              return (
                <Pressable key={g} onPress={() => setGroup(g)}>
                  <View style={[s.chip, active && s.chipActive]}>
                    <Text style={[s.chipText, active && s.chipTextActive]}>{g}</Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={s.rewardList}>
            {visible.map((r) => (
              <RewardRow key={r.id} reward={r} balance={points} onRedeem={onRedeem} />
            ))}
          </View>
        </View>

        {/* Certificates */}
        <View style={s.section}>
          <Eyebrow>INCLUDED WITH MEMBERSHIP</Eyebrow>
          <Text style={s.sectionTitle}>Certificates</Text>
          <View style={{ marginTop: spacing.md }}>
            {certificates.map((c) => (
              <View key={c.id} style={[s.cert, c.used && { opacity: 0.45 }]}>
                <View style={s.certIcon}>
                  <Ionicons
                    name={
                      c.kind === 'stay'
                        ? 'bed-outline'
                        : c.kind === 'upgrade'
                          ? 'arrow-up-circle-outline'
                          : 'restaurant-outline'
                    }
                    size={18}
                    color={colors.goldLight}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.certTitle}>{c.title}</Text>
                  <Text style={s.certDetail}>{c.detail}</Text>
                  <Text style={s.certExpiry}>Valid to {c.expires}</Text>
                </View>
                {c.used ? (
                  <Text style={s.usedTag}>USED</Text>
                ) : (
                  <Pressable onPress={() => redeemCertificate(c.id)} hitSlop={6}>
                    {({ pressed }) => (
                      <View style={[s.redeemBtn, pressed && { opacity: 0.7 }]}>
                        <Text style={s.redeemBtnText}>USE</Text>
                      </View>
                    )}
                  </Pressable>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Activity */}
        <View style={s.section}>
          <Eyebrow>HOW YOU EARNED</Eyebrow>
          <Text style={s.sectionTitle}>Activity</Text>
          <Text style={s.earnRate}>
            1 point for every {peso(Math.round(1 / POINTS_PER_PESO))} on stays and dining.
          </Text>
          <View style={{ marginTop: spacing.md }}>
            {pointsHistory.slice(0, 8).map((e, i) => (
              <View
                key={e.id}
                style={[s.activity, i < Math.min(pointsHistory.length, 8) - 1 && s.activityDivider]}>
                <View style={{ flex: 1 }}>
                  <Text style={s.activityLabel}>{e.label}</Text>
                  <Text style={s.activitySub}>{e.sub}</Text>
                </View>
                <Text style={s.activityDate}>{e.date}</Text>
                <Text style={[s.activityPoints, e.points < 0 && { color: colors.onDarkFaint }]}>
                  {e.points > 0 ? '+' : ''}
                  {e.points.toLocaleString('en-PH')}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Benefits */}
        <View style={s.section}>
          <Eyebrow>ALWAYS INCLUDED</Eyebrow>
          <Text style={s.sectionTitle}>Your benefits</Text>
          <View style={{ marginTop: spacing.md }}>
            {eliteProgram.benefits.map((b, i) => (
              <View
                key={b.title}
                style={[s.benefit, i < eliteProgram.benefits.length - 1 && s.activityDivider]}>
                <Ionicons
                  name={b.icon as keyof typeof Ionicons.glyphMap}
                  size={18}
                  color={colors.gold}
                  style={{ width: 26, marginTop: 2 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={s.benefitTitle}>{b.title}</Text>
                  <Text style={s.benefitDetail}>{b.detail}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Membership footer */}
        <View style={s.membership}>
          <LinearGradient
            colors={['rgba(255,255,255,0.07)', 'rgba(255,255,255,0.02)']}
            style={StyleSheet.absoluteFill}
          />
          <ParkMarkGold size={26} opacity={0.6} />
          <Text style={s.membershipTitle}>Membership renews {member.renews}</Text>
          <Text style={s.membershipBody}>
            {peso(eliteProgram.annualFee)} a year · transferable · non-replaceable
          </Text>
          <Text style={s.disclaimer}>
            Points are a proposed addition and not part of the current Elite Card. Earn rate
            and reward pricing are illustrative.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  head: { paddingHorizontal: spacing.xl },
  eyebrow: { fontSize: 9.5, letterSpacing: 1.6, fontWeight: '700', color: colors.gold },
  title: { fontFamily: serif, fontSize: 30, fontWeight: '700', color: colors.onDark, marginTop: 5 },

  balance: { alignItems: 'center', marginTop: spacing.xl },
  balanceValue: {
    fontFamily: serif,
    fontSize: 52,
    lineHeight: 58,
    fontWeight: '700',
    color: colors.onDark,
  },
  balanceLabel: {
    fontSize: 9.5,
    letterSpacing: 1.8,
    fontWeight: '700',
    color: colors.gold,
    marginTop: 2,
  },
  nextUp: { fontSize: 12.5, color: colors.onDarkMuted, marginTop: spacing.sm },

  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xl,
    marginHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.hairlineSoft,
  },
  stat: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, height: 28, backgroundColor: colors.hairlineSoft },
  statValue: { fontFamily: serif, fontSize: 17, fontWeight: '700', color: colors.onDark },
  statLabel: { fontSize: 8.5, letterSpacing: 1.2, color: colors.gold, marginTop: 4, fontWeight: '700' },

  section: { paddingHorizontal: spacing.xl, marginTop: spacing.xxl },
  sectionTitle: {
    fontFamily: serif,
    fontSize: 24,
    fontWeight: '700',
    color: colors.onDark,
    marginTop: 5,
  },

  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.hairlineSoft,
    backgroundColor: colors.raised,
  },
  chipActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  chipText: { fontSize: 12.5, fontWeight: '600', color: colors.onDarkMuted },
  chipTextActive: { color: colors.pageDeep, fontWeight: '700' },

  rewardList: { borderTopWidth: 1, borderTopColor: colors.hairline },
  reward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairlineSoft,
  },
  rewardIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.raised,
    borderWidth: 1,
    borderColor: colors.hairlineSoft,
  },
  rewardTitle: { fontSize: 15, fontWeight: '600', color: colors.onDark },
  rewardDetail: { fontSize: 11.5, color: colors.onDarkFaint, marginTop: 2 },
  rewardValue: { fontSize: 11, color: colors.gold, marginTop: 3 },
  rewardPoints: { fontFamily: serif, fontSize: 17, fontWeight: '700', color: colors.goldLight },
  shortText: { fontSize: 10, color: colors.onDarkFaint },

  redeemBtn: {
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  redeemBtnText: { fontSize: 9.5, letterSpacing: 1, fontWeight: '800', color: colors.goldLight },

  cert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairlineSoft,
  },
  certIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(201,162,39,0.14)',
  },
  certTitle: { fontSize: 14.5, fontWeight: '600', color: colors.onDark },
  certDetail: { fontSize: 11.5, color: colors.onDarkFaint, marginTop: 2 },
  certExpiry: { fontSize: 10.5, color: colors.gold, marginTop: 3 },
  usedTag: { fontSize: 9, letterSpacing: 1, fontWeight: '800', color: colors.onDarkFaint },

  earnRate: { fontSize: 12.5, color: colors.onDarkMuted, marginTop: 6 },
  activity: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  activityDivider: { borderBottomWidth: 1, borderBottomColor: colors.hairlineSoft },
  activityLabel: { fontSize: 14, color: colors.onDark },
  activitySub: { fontSize: 11, color: colors.onDarkFaint, marginTop: 1 },
  activityDate: { fontSize: 11, color: colors.onDarkFaint },
  activityPoints: {
    fontFamily: serif,
    fontSize: 15,
    fontWeight: '700',
    color: colors.goldLight,
    minWidth: 58,
    textAlign: 'right',
  },

  benefit: { flexDirection: 'row', gap: spacing.sm, paddingVertical: spacing.md },
  benefitTitle: { fontSize: 14.5, fontWeight: '600', color: colors.onDark },
  benefitDetail: { fontSize: 12, lineHeight: 18, color: colors.onDarkMuted, marginTop: 2 },

  membership: {
    alignItems: 'center',
    marginTop: spacing.xxl,
    marginHorizontal: spacing.xl,
    padding: spacing.xl,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  membershipTitle: {
    fontFamily: serif,
    fontSize: 17,
    fontWeight: '700',
    color: colors.onDark,
    marginTop: spacing.md,
  },
  membershipBody: { fontSize: 12.5, color: colors.onDarkMuted, marginTop: 4 },
  disclaimer: {
    fontSize: 10.5,
    lineHeight: 16,
    color: colors.onDarkFaint,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
