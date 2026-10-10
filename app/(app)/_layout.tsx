import React from 'react';
import { Stack } from 'expo-router';
import { theme } from '@/theme';

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.textPrimary,
        headerTitleStyle: {
          fontWeight: theme.typography.weights.bold,
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen 
        name="languages" 
        options={{ 
          title: 'Languages',
          headerShown: false // Custom header in screen
        }} 
      />
      <Stack.Screen 
        name="chat/[id]" 
        options={{ 
          headerShown: false // Custom header inside screen
        }} 
      />
    </Stack>
  );
}
