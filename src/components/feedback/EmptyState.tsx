import React from 'react';
import { StyleSheet } from 'react-native';
import { theme } from '@/theme';
import { Text, Button } from '@/components/ui';
import { Stack } from '@/components/layout';

export interface EmptyStateProps {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <Stack align="center" justify="center" gap="md" style={styles.container}>
      <Text variant="title" color="textPrimary" align="center">
        {title}
      </Text>
      {message && (
        <Text variant="body" color="textSecondary" align="center">
          {message}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button variant="outline" label={actionLabel} onPress={onAction} style={styles.action} />
      )}
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.xl,
    width: '100%',
  },
  action: {
    marginTop: theme.spacing.md,
  },
});
