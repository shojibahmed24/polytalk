import React from 'react';
import { Modal, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { theme } from '@/theme';
import { Text, Button } from '@/components/ui';
import { Box } from '@/components/layout';

export interface DialogProps {
  visible: boolean;
  title: string;
  message?: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  destructiveActionLabel?: string;
  onDestructiveAction?: () => void;
  onDismiss: () => void;
  isActionLoading?: boolean;
  children?: React.ReactNode;
}

export function Dialog({
  visible,
  title,
  message,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  destructiveActionLabel,
  onDestructiveAction,
  onDismiss,
  isActionLoading = false,
  children,
}: DialogProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <TouchableWithoutFeedback onPress={isActionLoading ? undefined : onDismiss}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.dialogContainer}>
              <Text variant="title" color="textPrimary" style={styles.title}>
                {title}
              </Text>
              
              {message && (
                <Text variant="body" color="textSecondary" style={styles.message}>
                  {message}
                </Text>
              )}
              
              {children}

              <Box direction="row" justify="flex-end" gap="sm" style={styles.actions}>
                {secondaryActionLabel && onSecondaryAction && (
                  <Button 
                    variant="ghost" 
                    label={secondaryActionLabel} 
                    onPress={onSecondaryAction} 
                    disabled={isActionLoading}
                  />
                )}
                {destructiveActionLabel && onDestructiveAction && (
                  <Button 
                    variant="destructive" 
                    label={destructiveActionLabel} 
                    onPress={onDestructiveAction} 
                    loading={isActionLoading}
                  />
                )}
                {primaryActionLabel && onPrimaryAction && !destructiveActionLabel && (
                  <Button 
                    variant="primary" 
                    label={primaryActionLabel} 
                    onPress={onPrimaryAction} 
                    loading={isActionLoading}
                  />
                )}
              </Box>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.layout.screenPadding,
  },
  dialogContainer: {
    width: '100%',
    maxWidth: theme.layout.maxWidth,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    marginBottom: theme.spacing.sm,
  },
  message: {
    marginBottom: theme.spacing.lg,
  },
  actions: {
    marginTop: theme.spacing.md,
  },
});
