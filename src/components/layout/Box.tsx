import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';
import { theme } from '@/theme';

export interface BoxProps extends ViewProps {
  flex?: ViewStyle['flex'];
  direction?: ViewStyle['flexDirection'];
  align?: ViewStyle['alignItems'];
  justify?: ViewStyle['justifyContent'];
  gap?: keyof typeof theme.spacing;
  padding?: keyof typeof theme.spacing;
  paddingHorizontal?: keyof typeof theme.spacing;
  paddingVertical?: keyof typeof theme.spacing;
  margin?: keyof typeof theme.spacing;
  marginHorizontal?: keyof typeof theme.spacing;
  marginVertical?: keyof typeof theme.spacing;
  bg?: keyof typeof theme.colors;
  radius?: keyof typeof theme.radii;
  borderWidth?: number;
  borderColor?: keyof typeof theme.colors;
}

export function Box({
  flex,
  direction,
  align,
  justify,
  gap,
  padding,
  paddingHorizontal,
  paddingVertical,
  margin,
  marginHorizontal,
  marginVertical,
  bg,
  radius,
  borderWidth,
  borderColor,
  style,
  ...props
}: BoxProps) {
  const dynamicStyle: ViewStyle = {
    flex,
    flexDirection: direction,
    alignItems: align,
    justifyContent: justify,
    gap: gap ? theme.spacing[gap] : undefined,
    padding: padding ? theme.spacing[padding] : undefined,
    paddingHorizontal: paddingHorizontal ? theme.spacing[paddingHorizontal] : undefined,
    paddingVertical: paddingVertical ? theme.spacing[paddingVertical] : undefined,
    margin: margin ? theme.spacing[margin] : undefined,
    marginHorizontal: marginHorizontal ? theme.spacing[marginHorizontal] : undefined,
    marginVertical: marginVertical ? theme.spacing[marginVertical] : undefined,
    backgroundColor: bg ? theme.colors[bg] : undefined,
    borderRadius: radius ? theme.radii[radius] : undefined,
    borderWidth,
    borderColor: borderColor ? theme.colors[borderColor] : undefined,
  };

  return <View style={[dynamicStyle, style]} {...props} />;
}
