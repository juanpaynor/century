import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/theme';
import { useApp } from '@/data/store';

/**
 * iOS tab bar — rendered by UIKit rather than JS, so on iOS 26 it picks up
 * Liquid Glass, the scroll-to-minimise behaviour and SF Symbol morphing for
 * free. Web and Android fall back to the JS tabs in _layout.tsx.
 */
export default function TabsLayoutIOS() {
  const { cartCount, orders } = useApp();
  const live = orders.find((o) => o.status !== 'Delivered');

  return (
    <NativeTabs
      tintColor={colors.maroon}
      minimizeBehavior="onScrollDown"
      labelStyle={{ fontSize: 11, fontWeight: '600' }}
      iconColor={{ default: colors.inkFaint, selected: colors.maroon }}>
      {/* Live room-service order rides above the tab bar, Now Playing style. */}
      {live ? (
        <NativeTabs.BottomAccessory>
          <View style={s.accessory}>
            <View style={s.dot} />
            <Text style={s.accessoryText} numberOfLines={1}>
              {live.status} · {live.lines.length} item{live.lines.length > 1 ? 's' : ''}
            </Text>
            <Text style={s.accessoryMeta}>{live.id}</Text>
          </View>
        </NativeTabs.BottomAccessory>
      ) : null}

      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} />
        <NativeTabs.Trigger.Label>Hotel</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="rooms">
        <NativeTabs.Trigger.Icon sf={{ default: 'bed.double', selected: 'bed.double.fill' }} />
        <NativeTabs.Trigger.Label>Rooms</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="dine">
        <NativeTabs.Trigger.Icon sf="fork.knife" />
        <NativeTabs.Trigger.Label>Dine</NativeTabs.Trigger.Label>
        {cartCount > 0 ? (
          <NativeTabs.Trigger.Badge>{String(cartCount)}</NativeTabs.Trigger.Badge>
        ) : null}
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="elite">
        <NativeTabs.Trigger.Icon sf={{ default: 'creditcard', selected: 'creditcard.fill' }} />
        <NativeTabs.Trigger.Label>Elite Card</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="stay">
        <NativeTabs.Trigger.Icon sf={{ default: 'key', selected: 'key.fill' }} />
        <NativeTabs.Trigger.Label>My Stay</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

const s = StyleSheet.create({
  accessory: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.gold },
  accessoryText: { flex: 1, fontSize: 13, fontWeight: '600', color: colors.ink },
  accessoryMeta: { fontSize: 12, color: colors.inkFaint },
});
