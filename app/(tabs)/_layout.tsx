import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/theme';
import { useApp } from '@/data/store';

export default function TabsLayout() {
  const { cartCount } = useApp();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.maroon,
        tabBarInactiveTintColor: colors.inkFaint,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.line,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hotel',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size - 2} color={color} />,
        }}
      />
      <Tabs.Screen
        name="rooms"
        options={{
          title: 'Rooms',
          tabBarIcon: ({ color, size }) => <Ionicons name="bed" size={size - 2} color={color} />,
        }}
      />
      <Tabs.Screen
        name="dine"
        options={{
          title: 'Dine',
          tabBarIcon: ({ color, size }) => (
            <View>
              <Ionicons name="restaurant" size={size - 2} color={color} />
              {cartCount > 0 ? (
                <View style={s.badge}>
                  <Text style={s.badgeText}>{cartCount}</Text>
                </View>
              ) : null}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="elite"
        options={{
          title: 'Elite Card',
          tabBarIcon: ({ color, size }) => <Ionicons name="card" size={size - 2} color={color} />,
        }}
      />
      <Tabs.Screen
        name="stay"
        options={{
          title: 'My Stay',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size - 2} color={color} />,
        }}
      />
    </Tabs>
  );
}

const s = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -5,
    right: -9,
    minWidth: 17,
    height: 17,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
});
