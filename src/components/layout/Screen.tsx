import React from 'react';
import { View, ScrollView, ViewProps, StyleSheet, ScrollViewProps, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { theme } from '@/theme';
import { useAppColors } from '@/theme/colors';

export interface ScreenProps extends ViewProps {
  scrollable?: boolean;
  keyboardAware?: boolean;
  edges?: Edge[];
  bg?: keyof typeof theme.colors;
  padded?: boolean;
  centerContent?: boolean;
  scrollViewProps?: ScrollViewProps;
}

export function Screen({
  scrollable = false,
  keyboardAware = false,
  edges = ['bottom', 'left', 'right'],
  bg = 'background',
  padded = true,
  centerContent = false,
  style,
  children,
  scrollViewProps,
  ...props
}: ScreenProps) {
  const colors = useAppColors();

  const containerStyle = [
    styles.container,
    { backgroundColor: colors[bg] },
    padded && { paddingHorizontal: theme.layout.screenPadding },
    centerContent && { justifyContent: 'center' as const, alignItems: 'center' as const },
    style,
  ];

  const content = scrollable ? (
    <ScrollView 
      contentContainerStyle={[
        padded && { paddingHorizontal: theme.layout.screenPadding, paddingBottom: theme.layout.screenPadding },
        centerContent && { flexGrow: 1, justifyContent: 'center', alignItems: 'center' }
      ]}
      style={[styles.container, { backgroundColor: colors[bg] }, style]}
      keyboardShouldPersistTaps="handled"
      {...scrollViewProps}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={containerStyle} {...props}>
      {children}
    </View>
  );

  let wrappedContent = content;

  if (keyboardAware) {
    wrappedContent = (
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {wrappedContent}
      </KeyboardAvoidingView>
    );
  }

  if (edges.length > 0) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors[bg] }]} edges={edges}>
        {wrappedContent}
      </SafeAreaView>
    );
  }

  return <>{wrappedContent}</>;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
});
