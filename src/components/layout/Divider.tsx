import React from 'react';
import { View, ViewProps } from 'react-native';
import { useAppColors, Colors } from '@/theme/colors';

export interface DividerProps extends ViewProps {
  orientation?: 'horizontal' | 'vertical';
  thickness?: number;
  color?: keyof Colors;
}

export function Divider({
  orientation = 'horizontal',
  thickness = 1,
  color = 'border',
  style,
  ...props
}: DividerProps) {
  const colors = useAppColors();

  return (
    <View
      style={[
        {
          backgroundColor: colors[color],
          width: orientation === 'horizontal' ? '100%' : thickness,
          height: orientation === 'horizontal' ? thickness : '100%',
        },
        style,
      ]}
      {...props}
    />
  );
}
