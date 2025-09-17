// mobile/app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from 'react-native';
import { colors } from '../../constants/theme';

function iconFor(routeName: string): keyof typeof Ionicons.glyphMap {
  switch (routeName) {
    case 'cars': return 'car-outline';
    case 'fuel': return 'water-outline';
    case 'service': return 'construct-outline';
    case 'stats': return 'stats-chart-outline';
    case 'settings': return 'settings-outline';
    default: return 'ellipse-outline';
  }
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.card },
        headerTitleStyle: { color: colors.text },
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabel: ({ color, children }) => (
          <Text style={{ color, fontSize: 12 }}>{String(children)}</Text>
        ),
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={iconFor(route.name)} size={size} color={color} />
        ),
      })}
    >
      {/* Скрытый index (не показывать в таб-баре) */}
      <Tabs.Screen name="index" options={{ href: null }} />

      <Tabs.Screen name="cars" options={{ title: 'Мои авто' }} />
      <Tabs.Screen name="fuel" options={{ title: 'Заправки' }} />
      <Tabs.Screen name="service" options={{ title: 'ТО' }} />
      <Tabs.Screen name="stats" options={{ title: 'Аналитика' }} />
      <Tabs.Screen name="settings" options={{ title: 'Настройки' }} />
    </Tabs>
  );
}
