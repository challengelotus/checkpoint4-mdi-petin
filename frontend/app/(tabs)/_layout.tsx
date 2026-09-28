import { Tabs } from 'expo-router';

import {
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import { colors } from '@/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: colors.brown,
        tabBarInactiveTintColor: colors.brownLight,

        tabBarStyle: {
          height: 64,

          backgroundColor: colors.backgroundLight,

          borderTopWidth: 0,
        },

        tabBarLabelStyle: {
          fontFamily: 'Poppins_500Medium',
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Início',

          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="calendario"
        options={{
          title: 'Calendário',

          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="calendar-month"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="localizar"
        options={{
          title: 'Localizar',

          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="map-marker"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}