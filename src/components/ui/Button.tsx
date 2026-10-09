import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, ActivityIndicator, StyleSheet } from 'react-native';
import { theme } from '@/theme';
import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  ...props
}: ButtonProps) {
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';
  
  const getBackgroundColor = () => {
    if (isOutline || isGhost) return 'transparent';
    if (variant === 'destructive') return theme.colors.error;
    if (variant === 'secondary') return theme.colors.secondary;
    return theme.colors.primary;
  };

  const getBorderColor = () => {
    if (isOutline) return theme.colors.border;
    return 'transparent';
  };

  const getTextColor = () => {
    if (isOutline || isGhost) {
      return 'primary';
    }
    return 'textInverse';
  };

  const getHeight = () => {
    if (size === 'sm') return 36;
    if (size === 'lg') return 56;
    return theme.layout.touchTargetMinHeight; // 48
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: isOutline ? 1 : 0,
          height: getHeight(),
          opacity: isDisabled ? 0.5 : 1,
        },
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors[getTextColor()]} />
      ) : (
        <Text 
          variant={size === 'sm' ? 'label' : 'body'} 
          color={getTextColor()}
          weight="semibold"
          align="center"
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.lg,
  },
});
