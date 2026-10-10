import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Screen, Stack as LayoutStack, Box } from '@/components/layout';
import { Text, Button } from '@/components/ui';
import { theme } from '@/theme';
import { useAppColors } from '@/theme/colors';
import { bootState } from '../index';
import { Ionicons } from '@expo/vector-icons';

// Mock data for Language Selection (S014)
const SUPPORTED_LANGUAGES = [
  { id: 'es', code: 'ES', name: 'Spanish', flag: '🇪🇸' },
  { id: 'fr', code: 'FR', name: 'French', flag: '🇫🇷' },
  { id: 'ja', code: 'JA', name: 'Japanese', flag: '🇯🇵' },
  { id: 'de', code: 'DE', name: 'German', flag: '🇩🇪' },
];

export default function OnboardingFlow() {
  const colors = useAppColors();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const handleNext = () => {
    if (step < 3) setStep((prev) => (prev + 1) as 1 | 2 | 3);
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => (prev - 1) as 1 | 2 | 3);
  };

  const handleComplete = () => {
    bootState.hasCompletedOnboarding = true;
    router.replace('/(auth)/login');
  };

  // Step 1: Welcome & Value Prop (S013)
  const renderStep1 = () => (
    <LayoutStack gap="xl" align="center" style={styles.content}>
      <Box marginVertical="xl" align="center">
        <View style={{ position: 'relative' }}>
          <View style={[styles.iconCircle, { backgroundColor: colors.surface, borderColor: colors.border }]} importantForAccessibility="no">
            <Ionicons name="chatbubbles" size={44} color={colors.primary} />
          </View>
          <View style={[styles.sparkleBadge, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
            <Ionicons name="sparkles" size={20} color={colors.secondary} />
          </View>
        </View>
      </Box>
      <LayoutStack gap="sm" align="center">
        <Text variant="display" color="primary" align="center">PolyTalk</Text>
        <Text variant="title" color="textPrimary" align="center">Speak with Confidence</Text>
      </LayoutStack>
      <Text variant="body" color="textSecondary" align="center">
        Master a new language through real-time AI conversations, instant translation, and personalized grammar feedback.
      </Text>
    </LayoutStack>
  );

  // Step 2: Goal/Language Selection (S014)
  const renderStep2 = () => (
    <LayoutStack gap="lg" style={styles.content}>
      <LayoutStack gap="sm">
        <Text variant="title" color="textPrimary">What do you want to learn?</Text>
        <Text variant="body" color="textSecondary">
          Choose a language to begin your journey. You can always add more later.
        </Text>
      </LayoutStack>

      <View style={styles.grid}>
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = selectedLanguage === lang.id;
          return (
            <TouchableOpacity
              key={lang.id}
              activeOpacity={0.7}
              onPress={() => setSelectedLanguage(lang.id)}
              style={[
                styles.languageCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
                isSelected && { borderColor: colors.primary, backgroundColor: 'rgba(6, 182, 212, 0.05)' },
              ]}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              accessibilityLabel={`Learn ${lang.name}`}
            >
              <Box direction="row" align="center" justify="space-between" style={{ width: '100%' }}>
                <Box direction="row" align="center" gap="sm">
                  <View style={[styles.flagContainer, { backgroundColor: colors.surfaceElevated }]}>
                    <Text variant="heading" style={styles.flagText}>{lang.flag}</Text>
                  </View>
                  <View>
                    <Text 
                      variant="body" 
                      weight={isSelected ? 'bold' : 'medium'}
                      color={isSelected ? 'primary' : 'textPrimary'}
                    >
                      {lang.name}
                    </Text>
                    <Text variant="caption" color="textSecondary">{lang.code}</Text>
                  </View>
                </Box>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                )}
              </Box>
            </TouchableOpacity>
          );
        })}
      </View>
    </LayoutStack>
  );

  // Step 3: Final confirmation (S015)
  const renderStep3 = () => (
    <LayoutStack gap="xl" align="center" style={styles.content}>
      <Box marginVertical="xl" align="center">
        <View style={[styles.iconCircle, { backgroundColor: colors.surface, borderColor: colors.border }]} importantForAccessibility="no">
          <Ionicons name="checkmark-circle" size={48} color={colors.primaryBright} />
        </View>
      </Box>
      <LayoutStack gap="sm" align="center">
        <Text variant="title" color="textPrimary" align="center">You're All Set!</Text>
        <Text variant="body" color="textSecondary" align="center">
          Your AI tutor is ready. Start speaking naturally and get instant pronunciation and grammar tips.
        </Text>
      </LayoutStack>
    </LayoutStack>
  );

  const isNextDisabled = step === 2 && !selectedLanguage;

  return (
    <Screen bg="background" padded>
      <View style={styles.container}>
        
        {/* Top Navigation / Progress */}
        <Box direction="row" justify="space-between" align="center" style={styles.header}>
          {step > 1 ? (
            <Button variant="ghost" label="Back" size="sm" onPress={handleBack} />
          ) : (
            <View style={styles.spacer} />
          )}
          <Box direction="row" gap="xs">
            {[1, 2, 3].map((idx) => (
              <View 
                key={idx} 
                style={[
                  styles.progressDot, 
                  { backgroundColor: colors.disabled },
                  step >= idx && { backgroundColor: colors.primary }
                ]} 
                importantForAccessibility="no"
              />
            ))}
          </Box>
          <View style={styles.spacerRight}>
             {step < 3 && (
               <Button variant="ghost" label="Skip" size="sm" onPress={handleComplete} />
             )}
          </View>
        </Box>

        {/* Scrollable Content Area */}
        <View style={styles.mainArea}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </View>

        {/* Bottom Actions */}
        <Box style={styles.footer}>
          {step < 3 ? (
            <Button 
              variant="primary" 
              label="Continue" 
              size="lg" 
              onPress={handleNext} 
              disabled={isNextDisabled}
            />
          ) : (
            <Button 
              variant="primary" 
              label="Get Started" 
              size="lg" 
              onPress={handleComplete} 
            />
          )}
        </Box>
      </View>
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
    paddingVertical: theme.spacing.md,
    height: 60,
  },
  spacer: {
    width: 60,
    alignItems: 'flex-start',
  },
  spacerRight: {
    width: 60,
    alignItems: 'flex-end',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  mainArea: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    paddingVertical: theme.spacing.xl,
  },
  footer: {
    paddingVertical: theme.spacing.xl,
    paddingBottom: theme.layout.screenPadding,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  sparkleBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
  },
  grid: {
    flexDirection: 'column',
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  languageCard: {
    width: '100%',
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    padding: theme.spacing.md,
  },
  flagContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flagText: {
    fontSize: 24,
    lineHeight: 32,
  },
});
