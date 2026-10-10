import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Screen, Stack, Box } from '@/components/layout';
import { Text, Button } from '@/components/ui';
import { theme } from '@/theme';
import { SymbolView } from 'expo-symbols';

const SUPPORTED_LANGUAGES = [
  { id: 'es', name: 'Spanish', flag: '🇪🇸' },
  { id: 'fr', name: 'French', flag: '🇫🇷' },
  { id: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { id: 'de', name: 'German', flag: '🇩🇪' },
  { id: 'it', name: 'Italian', flag: '🇮🇹' },
  { id: 'pt', name: 'Portuguese', flag: '🇵🇹' },
];

export default function LanguageSelectionScreen() {
  const [selectedLang, setSelectedLang] = useState<string | null>('es'); // Pre-select a default
  const [isSaving, setIsSaving] = useState(false);
  
  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [slideAnim] = useState(() => new Animated.Value(12));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate a local save delay
    setTimeout(() => {
      setIsSaving(false);
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(tabs)');
      }
    }, 400);
  };

  return (
    <Screen bg="background" edges={['top', 'bottom', 'left', 'right']}>
      <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        
        {/* Custom Header */}
        <Box direction="row" align="center" style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            activeOpacity={0.7}
          >
            <SymbolView name="chevron.left" size={24} tintColor={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text variant="heading" color="textPrimary" style={styles.headerTitle}>
            Choose your language
          </Text>
          <View style={styles.headerPlaceholder} />
        </Box>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text variant="body" color="textSecondary" style={styles.subtitle}>
            Select the language you want to focus on. You can change this at any time in your settings.
          </Text>

          <Stack gap="md" style={styles.list}>
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = selectedLang === lang.id;
              
              return (
                <TouchableOpacity
                  key={lang.id}
                  activeOpacity={0.7}
                  onPress={() => setSelectedLang(lang.id)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: isSelected }}
                  style={[
                    styles.langCard,
                    isSelected && styles.langCardSelected
                  ]}
                >
                  <Box direction="row" align="center" justify="space-between">
                    <Box direction="row" align="center" gap="md">
                      <View style={[styles.flagContainer, isSelected && styles.flagContainerSelected]}>
                        <Text variant="heading" style={styles.flagText}>{lang.flag}</Text>
                      </View>
                      <Text 
                        variant="title" 
                        weight={isSelected ? 'bold' : 'medium'}
                        color={isSelected ? 'primary' : 'textPrimary'}
                      >
                        {lang.name}
                      </Text>
                    </Box>
                    
                    {isSelected && (
                      <View style={styles.checkIcon}>
                        <SymbolView name="checkmark.circle.fill" size={24} tintColor={theme.colors.primary} />
                      </View>
                    )}
                  </Box>
                </TouchableOpacity>
              );
            })}
          </Stack>
        </ScrollView>

        <Box style={styles.footer}>
          <Button 
            label="Save Language" 
            variant="primary" 
            size="lg"
            onPress={handleSave}
            loading={isSaving}
            disabled={!selectedLang}
          />
        </Box>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    maxWidth: theme.layout.contentMaxWidth,
    alignSelf: 'center',
  },
  header: {
    paddingHorizontal: theme.layout.screenPadding,
    paddingVertical: theme.spacing.md,
  },
  backButton: {
    padding: theme.spacing.xs,
    marginLeft: -theme.spacing.xs,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  headerPlaceholder: {
    width: 32, // Matches back button width approximately to center title
  },
  scrollContent: {
    paddingHorizontal: theme.layout.screenPadding,
    paddingBottom: theme.spacing.xxl,
  },
  subtitle: {
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  list: {
    width: '100%',
  },
  langCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 16,
    padding: theme.spacing.md,
  },
  langCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(6, 182, 212, 0.05)', // Subtle cyan tint
  },
  flagContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flagContainerSelected: {
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
  },
  flagText: {
    fontSize: 24,
    lineHeight: 32,
  },
  checkIcon: {
    marginRight: theme.spacing.xs,
  },
  footer: {
    paddingHorizontal: theme.layout.screenPadding,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
});
