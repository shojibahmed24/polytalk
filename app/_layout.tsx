import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { theme } from '@/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
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
        }}>
        <Stack.Screen name="index" options={{ title: 'PolyTalk' }} />
      </Stack>
    </>
  );
}
