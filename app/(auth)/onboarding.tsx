import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Stack as LayoutStack, Box } from '@/components/layout';
import { Text, Button } from '@/components/ui';
import { theme } from '@/theme';
import { useAppColors } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { bootState } from '../index';
import { LinearGradient } from 'expo-linear-gradient';

const SUPPORTED_LANGUAGES = [
  { id: 'es', code: 'ES', name: 'Spanish', flag: '🇪🇸' },
  { id: 'fr', code: 'FR', name: 'French', flag: '🇫🇷' },
  { id: 'ja', code: 'JA', name: 'Japanese', flag: '🇯🇵' },
  { id: 'de', code: 'DE', name: 'German', flag: '🇩🇪' },
];

export default function OnboardingFlow() {
  const colors = useAppColors();
  const router = useRouter();
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

  const isLight = colors.background === '#FFFFFF' || colors.background === '#F8FAFC';

  // Step 1: Welcome & Value Prop (S013)
  const renderStep1 = () => (
    <View style={styles.step1Container}>
      
      {/* Mascot / Visual Composition */}
      <View style={styles.visualContainerWrapper}>
        <View style={styles.visualContainer}>
          {/* Decorative elements */}
          <View style={[styles.floatingIcon, { top: '5%', left: '15%', backgroundColor: isLight ? 'rgba(255,255,255,0.7)' : colors.surfaceElevated }]}>
             <Text style={{ fontSize: 16 }}>🇪🇸</Text>
          </View>
          <View style={[styles.floatingIcon, { top: '0%', right: '20%', backgroundColor: isLight ? 'rgba(255,255,255,0.7)' : colors.surfaceElevated }]}>
             <Text style={{ fontSize: 16 }}>🇫🇷</Text>
          </View>
          <View style={[styles.floatingIcon, { bottom: '25%', left: '10%', backgroundColor: isLight ? 'rgba(255,255,255,0.7)' : colors.surfaceElevated }]}>
             <Text style={{ fontSize: 16 }}>🇬🇧</Text>
          </View>
          <View style={[styles.floatingIcon, { bottom: '15%', right: '15%', backgroundColor: isLight ? 'rgba(255,255,255,0.7)' : colors.surfaceElevated }]}>
             <Text style={{ fontSize: 16 }}>🇩🇪</Text>
          </View>
          <View style={[styles.floatingIcon, { top: '35%', right: '5%', backgroundColor: isLight ? 'rgba(255,255,255,0.7)' : colors.surfaceElevated }]}>
             <Text style={{ fontSize: 16 }}>🇯🇵</Text>
          </View>
          
          {/* Waveforms */}
          <View style={[styles.waveform, { left: '5%', top: '40%' }]}>
            <Ionicons name="stats-chart" size={24} color={colors.primary} style={{ transform: [{ rotate: '90deg' }] }} />
          </View>
          <View style={[styles.waveform, { right: '5%', top: '50%' }]}>
            <Ionicons name="stats-chart" size={24} color={colors.secondary} style={{ transform: [{ rotate: '90deg' }] }} />
          </View>

          {/* Back Bubbles */}
          <View style={[styles.heroBubble, { backgroundColor: '#06B6D4', left: '12%', top: '15%', transform: [{ rotate: '-10deg' }] }]}>
            <Text style={styles.bubbleTextLarge}>A</Text>
          </View>
          <View style={[styles.heroBubble, { backgroundColor: '#8B5CF6', right: '12%', top: '25%', transform: [{ rotate: '10deg' }] }]}>
            <Text style={styles.bubbleTextLarge}>文</Text>
          </View>

          {/* Mascot Center */}
          <View style={[styles.mascotBase, { backgroundColor: colors.surface, borderColor: isLight ? '#FFFFFF' : colors.border, shadowColor: colors.primary }]}>
            <LinearGradient
              colors={[isLight ? '#F0F9FF' : colors.surfaceElevated, isLight ? '#E0F2FE' : colors.surface]}
              style={StyleSheet.absoluteFill}
            />
            <View style={[styles.mascotFace, { backgroundColor: isLight ? '#0F172A' : '#000000' }]}>
               {/* Eyes */}
               <View style={styles.mascotEye} />
               <View style={styles.mascotEye} />
            </View>
            <Ionicons name="headset" size={120} color={isLight ? '#CBD5E1' : '#475569'} style={styles.mascotHeadset} />
          </View>
        </View>
      </View>

      {/* Typography */}
      <LayoutStack gap="xs" align="center" style={styles.textContainer}>
        <Text variant="display" color="textPrimary" align="center" style={styles.titleText}>
          Speak a new language
        </Text>
        <Text variant="display" color="primary" align="center" style={styles.titleText}>
          with confidence.
        </Text>
        <View style={{ marginTop: theme.spacing.sm }}>
          <Text variant="body" color="textSecondary" align="center">
            Practice naturally with your personal AI language coach.
          </Text>
        </View>
      </LayoutStack>

      {/* Feature Cards */}
      <Box direction="row" justify="space-between" align="stretch" style={styles.featuresRow}>
        <View style={[styles.featureCard, { backgroundColor: colors.surface, shadowColor: isLight ? '#94A3B8' : 'transparent', borderWidth: isLight ? 0 : 1, borderColor: colors.border }]}>
          <View style={[styles.featureIconWrap, { backgroundColor: isLight ? '#E0F2FE' : 'rgba(6,182,212,0.1)' }]}>
            <Ionicons name="language" size={24} color="#06B6D4" />
          </View>
          <Text variant="caption" weight="bold" color="textPrimary" align="center">Live{"\n"}translation</Text>
        </View>
        <View style={[styles.featureCard, { backgroundColor: colors.surface, shadowColor: isLight ? '#94A3B8' : 'transparent', borderWidth: isLight ? 0 : 1, borderColor: colors.border }]}>
          <View style={[styles.featureIconWrap, { backgroundColor: isLight ? '#F3E8FF' : 'rgba(139,92,246,0.1)' }]}>
            <Ionicons name="mic" size={24} color="#8B5CF6" />
          </View>
          <Text variant="caption" weight="bold" color="textPrimary" align="center">Speaking{"\n"}practice</Text>
        </View>
        <View style={[styles.featureCard, { backgroundColor: colors.surface, shadowColor: isLight ? '#94A3B8' : 'transparent', borderWidth: isLight ? 0 : 1, borderColor: colors.border }]}>
          <View style={[styles.featureIconWrap, { backgroundColor: isLight ? '#FFEDD5' : 'rgba(249,115,22,0.1)' }]}>
            <Ionicons name="book" size={24} color="#F97316" />
          </View>
          <Text variant="caption" weight="bold" color="textPrimary" align="center">Grammar{"\n"}tips</Text>
        </View>
      </Box>

    </View>
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
    <Screen bg="background" edges={['top', 'bottom', 'left', 'right']} padded={false}>
      {/* Background Gradient for Step 1 Light Mode */}
      {step === 1 && isLight && (
        <LinearGradient
          colors={['#F5F8FF', '#FFFFFF']}
          style={StyleSheet.absoluteFill}
        />
      )}
      
      <View style={[styles.container, { paddingHorizontal: theme.layout.screenPadding }]}>
        
        {/* Top Header / Logo / Navigation */}
        <Box direction="row" justify="space-between" align="center" style={styles.header}>
          {step > 1 ? (
            <Button variant="ghost" label="Back" size="sm" onPress={handleBack} />
          ) : (
            <View style={styles.spacer} />
          )}
          
          {/* Logo only on Step 1 */}
          {step === 1 && (
            <Box align="center">
              <Box direction="row" align="center" gap="xs">
                <Ionicons name="chatbubbles" size={24} color={colors.primary} />
                <Text variant="title" weight="bold" color="textPrimary">PolyTalk</Text>
              </Box>
              <Text variant="caption" color="textSecondary" style={styles.logoSub}>AI LANGUAGE COACH</Text>
            </Box>
          )}

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
          
          {/* Progress Dots */}
          <Box direction="row" justify="center" gap="sm" style={styles.dotsContainer}>
            {[1, 2, 3].map((idx) => {
              const isActive = step === idx;
              return (
                <View 
                  key={idx} 
                  style={[
                    styles.progressDot, 
                    { backgroundColor: isActive ? colors.primary : colors.disabled },
                    isActive && styles.progressDotActive
                  ]} 
                  importantForAccessibility="no"
                />
              );
            })}
          </Box>

          {step === 1 ? (
            <View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleNext}
                style={styles.gradientButtonWrap}
              >
                <LinearGradient
                  colors={['#06B6D4', '#8B5CF6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientButton}
                >
                  <Text variant="body" weight="bold" color="textInverse" style={{ marginRight: 8 }}>
                    Get started
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={handleComplete} style={styles.signInLink}>
                <Text variant="bodySmall" color="textSecondary" align="center">
                  Already have an account? <Text variant="bodySmall" weight="bold" color="primary">Sign in</Text>
                </Text>
              </TouchableOpacity>
            </View>
          ) : step === 2 ? (
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
              label="Start Learning" 
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
    minHeight: 60,
  },
  spacer: {
    width: 60,
    alignItems: 'flex-start',
  },
  spacerRight: {
    width: 60,
    alignItems: 'flex-end',
  },
  logoSub: {
    fontSize: 10,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  mainArea: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    paddingVertical: theme.spacing.xl,
  },
  footer: {
    paddingBottom: theme.layout.screenPadding + 20,
  },
  dotsContainer: {
    marginBottom: theme.spacing.xl,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  progressDotActive: {
    width: 16,
  },
  
  // Existing Step styles
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

  // New Step 1 Styles
  step1Container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  visualContainerWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  visualContainer: {
    width: '100%',
    maxWidth: 400,
    height: 260,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingIcon: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waveform: {
    position: 'absolute',
    opacity: 0.6,
  },
  heroBubble: {
    position: 'absolute',
    width: 96,
    height: 84,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  bubbleTextLarge: {
    color: '#FFF',
    fontSize: 36,
    fontWeight: 'bold',
  },
  mascotBase: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
    zIndex: 10,
    overflow: 'hidden',
  },
  mascotFace: {
    width: 72,
    height: 48,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    zIndex: 2,
  },
  mascotEye: {
    width: 14,
    height: 7,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderBottomWidth: 0,
    borderWidth: 3,
    borderColor: '#06B6D4',
    borderBottomColor: 'transparent',
  },
  mascotHeadset: {
    position: 'absolute',
    top: 6,
    zIndex: 3,
  },
  textContainer: {
    marginVertical: theme.spacing.lg,
  },
  titleText: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
  },
  featuresRow: {
    width: '100%',
    paddingHorizontal: 0,
    marginTop: theme.spacing.md,
  },
  featureCard: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 16,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  featureIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  gradientButtonWrap: {
    width: '100%',
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  gradientButton: {
    flexDirection: 'row',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  signInLink: {
    marginTop: theme.spacing.lg,
    padding: theme.spacing.sm,
  },
});
