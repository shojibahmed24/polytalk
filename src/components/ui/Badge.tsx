import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { theme } from '@/theme';
import { Text } from './Text';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

export interface BadgeProps extends ViewProps {
  label?: string;
  variant?: BadgeVariant;
  dotOnly?: boolean;
}

export function Badge({
  label,
  variant = 'default',
  dotOnly = false,
  style,
  ...props
}: BadgeProps) {
  const getBackgroundColor = () => {
    if (variant === 'default') return theme.colors.surfaceElevated;
    return theme.colors[variant];
  };

  const getTextColor = () => {
    if (variant === 'default') return 'textPrimary';
    // When using semantic accents as background, textInverse works best for contrast
    return 'textInverse';
  };

  if (dotOnly) {
    return (
      <View
        accessible={true}
        accessibilityLabel={props.accessibilityLabel || `Status: ${variant}`}
        style={[
          styles.dot,
          { backgroundColor: getBackgroundColor() },
          style,
        ]}
        {...props}
      />
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: getBackgroundColor() },
        style,
      ]}
      {...props}
    >
      <Text variant="caption" color={getTextColor()} weight="semibold">
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.radii.full,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
