import React from 'react';
import { Tabs } from 'expo-router';
import { theme } from '@/theme';
import { Platform } from 'react-native';
import { SymbolView, SFSymbol } from 'expo-symbols';

import { View, Text, ColorValue } from 'react-native';

function TabIcon({ name, color }: { name: SFSymbol; color: string | ColorValue }) {
  return (
    <View importantForAccessibility="no" accessibilityElementsHidden={true}>
      <SymbolView 
        name={name} 
        size={24} 
        tintColor={color as string} 
        fallback={
          <Text style={{ color: color as string, fontSize: 18, fontWeight: 'bold' }}>â€¢</Text>
        }
      />
    </View>
  );
}


export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.textPrimary,
        headerTitleStyle: {
          fontWeight: theme.typography.weights.bold,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.surfaceElevated,
          borderTopColor: theme.colors.border,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          paddingTop: 12,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabIcon name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: 'Practice',
          tabBarIcon: ({ color }) => <TabIcon name="play.circle.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color }) => <TabIcon name="chart.bar.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabIcon name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}


