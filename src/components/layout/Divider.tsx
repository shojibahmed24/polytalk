import React from 'react';
import { View, ViewProps } from 'react-native';
import { theme } from '@/theme';

export interface DividerProps extends ViewProps {
  orientation?: 'horizontal' | 'vertical';
  thickness?: number;
  color?: keyof typeof theme.colors;
}

export function Divider({
  orientation = 'horizontal',
  thickness = 1,
  color = 'border',
  style,
  ...props
}: DividerProps) {
  return (
    <View
      style={[
        {
          backgroundColor: theme.colors[color],
          width: orientation === 'horizontal' ? '100%' : thickness,
          height: orientation === 'horizontal' ? thickness : '100%',
        },
        style,
      ]}
      {...props}
    />
  );
}
