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

import React from 'react';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#0f132e', borderTopColor: '#22264f' },
        tabBarActiveTintColor: '#5d7bff',
        tabBarInactiveTintColor: '#9aa1d6',
      }}
    >
      <Tabs.Screen
        name="cars"
        options={{
          title: 'Мои авто',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="car" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="fuel"
        options={{
          title: 'Заправки',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="gas-station" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="service"
        options={{
          title: 'ТО',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="tools" color={color} size={size} />,
        }}
      />
      {/* УБРАЛИ аналитику: если у тебя был файл stats.tsx — оставь его, но убери из табов */}
      <Tabs.Screen
        name="assistant"
        options={{
          title: 'Ассистент',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="smart-toy" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Настройки',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="settings" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}

