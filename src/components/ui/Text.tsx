import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet, TextStyle } from 'react-native';
import { theme } from '@/theme';

export type TextVariant = 
  | 'display'
  | 'heading'
  | 'title'
  | 'body'
  | 'bodySmall'
  | 'label'
  | 'caption';

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: keyof typeof theme.colors;
  align?: TextStyle['textAlign'];
  weight?: keyof typeof theme.typography.weights;
}

export function Text({ 
  variant = 'body', 
  color = 'textPrimary', 
  align = 'auto', 
  weight,
  style, 
  ...props 
}: TextProps) {
  const variantStyle = variantStyles[variant];
  const fontWeight = weight ? theme.typography.weights[weight] : variantStyle.fontWeight;

  return (
    <RNText 
      style={[
        variantStyle,
        { 
          color: theme.colors[color],
          textAlign: align,
          fontWeight,
        },
        style,
      ]} 
      {...props} 
    />
  );
}

const variantStyles = StyleSheet.create({
  display: {
    fontSize: theme.typography.sizes.display,
    fontWeight: theme.typography.weights.bold,
    lineHeight: theme.typography.sizes.display * theme.typography.lineHeights.tight,
  },
  heading: {
    fontSize: theme.typography.sizes.xxxl,
    fontWeight: theme.typography.weights.bold,
    lineHeight: theme.typography.sizes.xxxl * theme.typography.lineHeights.tight,
  },
  title: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.semibold,
    lineHeight: theme.typography.sizes.xl * theme.typography.lineHeights.tight,
  },
  body: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.regular,
    lineHeight: theme.typography.sizes.md * theme.typography.lineHeights.normal,
  },
  bodySmall: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.regular,
    lineHeight: theme.typography.sizes.sm * theme.typography.lineHeights.normal,
  },
  label: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    lineHeight: theme.typography.sizes.sm * theme.typography.lineHeights.normal,
  },
  caption: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.regular,
    lineHeight: theme.typography.sizes.xs * theme.typography.lineHeights.normal,
  },
});
