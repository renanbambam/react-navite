import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light'; // Define tema padrão como 'light' se for indefinido

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === 'light' ? Colors.light.navegacao : Colors.dark.navegacao, // Cor da tabBar ativa
        tabBarInactiveTintColor: colorScheme === 'light' ? Colors.light.textoSecundario : Colors.dark.textoSecundario, // Cor da tabBar inativa
        tabBarStyle: {
          backgroundColor: colorScheme === 'light' ? Colors.light.background : Colors.dark.background, // Cor do fundo da tabBar
          elevation: 0, // Remove a sombra em Android
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
