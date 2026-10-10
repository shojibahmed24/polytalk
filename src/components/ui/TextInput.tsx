import React, { useState } from 'react';
import { 
  TextInput as RNTextInput, 
  TextInputProps as RNTextInputProps, 
  StyleSheet,
  View
} from 'react-native';
import { theme } from '@/theme';
import { Text } from './Text';

export interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  rightAccessory?: React.ReactNode;
}

export function TextInput({
  label,
  error,
  helperText,
  rightAccessory,
  style,
  onFocus,
  onBlur,
  ...props
}: TextInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = () => {
    if (error) return theme.colors.error;
    if (isFocused) return theme.colors.primary;
    return theme.colors.border;
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text variant="label" color="textSecondary" style={styles.label}>
          {label}
        </Text>
      )}
      <View style={styles.inputWrapper}>
        <RNTextInput
          accessibilityLabel={label}
          aria-invalid={!!error}
          accessibilityState={{ disabled: props.editable === false }}
          style={[
            styles.input,
            {
              borderColor: getBorderColor(),
              color: theme.colors.textPrimary,
              paddingRight: rightAccessory ? 48 : theme.spacing.md,
            },
            props.editable === false && styles.disabled,
            style,
          ]}
          placeholderTextColor={theme.colors.textSecondary}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
        {rightAccessory && (
          <View style={styles.rightAccessory}>
            {rightAccessory}
          </View>
        )}
      </View>
      {error ? (
        <Text variant="caption" color="error" style={styles.footerText}>
          {error}
        </Text>
      ) : helperText ? (
        <Text variant="caption" color="textSecondary" style={styles.footerText}>
          {helperText}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  label: {
    marginBottom: theme.spacing.xs,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    height: theme.layout.touchTargetMinHeight,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.sizes.md,
  },
  rightAccessory: {
    position: 'absolute',
    right: theme.spacing.md,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  footerText: {
    marginTop: theme.spacing.xs,
  },
});
