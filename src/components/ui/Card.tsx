import React from 'react';
import { TouchableOpacity, View, ViewProps, TouchableOpacityProps } from 'react-native';
import { theme } from '@/theme';
import { useAppColors } from '@/theme/colors';

export type CardVariant = 'default' | 'elevated' | 'outlined';

export interface CardProps extends ViewProps {
  variant?: CardVariant;
  padding?: keyof typeof theme.spacing;
  onPress?: TouchableOpacityProps['onPress'];
  disabled?: boolean;
}

export function Card({
  variant = 'default',
  padding = 'lg',
  onPress,
  disabled,
  style,
  children,
  ...props
}: CardProps) {
  const colors = useAppColors();
  const isOutlined = variant === 'outlined';
  
  const getBackgroundColor = () => {
    if (isOutlined) return 'transparent';
    if (variant === 'elevated') return colors.surfaceElevated;
    return colors.surface;
  };

  const dynamicStyle = {
    backgroundColor: getBackgroundColor(),
    padding: theme.spacing[padding],
    borderRadius: theme.radii.lg,
    borderWidth: isOutlined ? 1 : 0,
    borderColor: isOutlined ? colors.border : 'transparent',
    opacity: disabled ? 0.6 : 1,
  };

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
        accessibilityRole="button"
        style={[dynamicStyle, style]}
      >
        <View {...props}>
          {children}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[dynamicStyle, style]} {...props}>
      {children}
    </View>
  );
}
