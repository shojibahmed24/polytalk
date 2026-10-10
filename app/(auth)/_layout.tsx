import React from 'react';
import { Stack } from 'expo-router';
import { theme } from '@/theme';

export default function AuthLayout() {
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
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
}
