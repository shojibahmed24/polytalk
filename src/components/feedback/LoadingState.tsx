import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { theme } from '@/theme';
import { Text } from '@/components/ui';
import { Stack } from '@/components/layout';

export interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message }: LoadingStateProps) {
  return (
    <Stack align="center" justify="center" gap="md" style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      {message && (
        <Text variant="body" color="textSecondary" align="center">
          {message}
        </Text>
      )}
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.xl,
    width: '100%',
  },
});
