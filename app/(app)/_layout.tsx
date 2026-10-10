import React from 'react';
import { Stack } from 'expo-router';
import { theme } from '@/theme';
import { useAppColors } from '@/theme/colors';

export default function AppLayout() {
  const colors = useAppColors();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: theme.typography.weights.bold,
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: colors.background,
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
      <Stack.Screen 
        name="grammar" 
        options={{ 
          headerShown: false // Custom header inside screen
        }} 
      />
    </Stack>
  );
}
