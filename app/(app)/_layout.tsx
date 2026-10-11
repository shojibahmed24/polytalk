import React, { useEffect, useState } from 'react';
import { Stack, Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { theme } from '@/theme';
import { useAppColors } from '@/theme/colors';
import { getCurrentUserProfile } from '@/utils/userProfile';

export default function AppLayout() {
  const colors = useAppColors();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function checkAuth() {
      try {
        const profile = await getCurrentUserProfile();
        if (isMounted) {
          setIsAuthenticated(!!profile);
        }
      } catch {
        if (isMounted) {
          setIsAuthenticated(false);
        }
      }
    }
    checkAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  if (isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

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
