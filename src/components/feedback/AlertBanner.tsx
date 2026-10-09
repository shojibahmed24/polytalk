import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '@/theme';
import { Text } from '@/components/ui/Text';

export type AlertVariant = 'success' | 'warning' | 'error' | 'info';

export interface AlertBannerProps {
  variant?: AlertVariant;
  message: string;
}

export function AlertBanner({ variant = 'info', message }: AlertBannerProps) {
  return (
    <View style={[styles.container, { backgroundColor: theme.colors[variant] }]}>
      <Text variant="label" color="textPrimary">
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    width: '100%',
    marginBottom: theme.spacing.md,
  },
});
