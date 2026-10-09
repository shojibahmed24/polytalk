import React from 'react';
import { Modal, View, StyleSheet, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/theme';

export interface BottomSheetProps {
  visible: boolean;
  onDismiss: () => void;
  scrollable?: boolean;
  children: React.ReactNode;
}

export function BottomSheet({
  visible,
  onDismiss,
  scrollable = false,
  children,
}: BottomSheetProps) {
  const content = scrollable ? (
    <ScrollView style={styles.scrollArea}>
      {children}
    </ScrollView>
  ) : (
    <View style={styles.contentArea}>
      {children}
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onDismiss}
    >
      <TouchableWithoutFeedback onPress={onDismiss}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheetContainer}>
              <SafeAreaView edges={['bottom']} style={styles.safeArea}>
                <View style={styles.dragHandle} />
                {content}
              </SafeAreaView>
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
    backgroundColor: 'rgba(2, 6, 23, 0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radii.xl,
    borderTopRightRadius: theme.radii.xl,
    paddingTop: theme.spacing.sm,
    paddingHorizontal: theme.layout.screenPadding,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  safeArea: {
    width: '100%',
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
  },
  scrollArea: {
    paddingBottom: theme.spacing.xl,
  },
  contentArea: {
    paddingBottom: theme.spacing.xl,
  },
});
