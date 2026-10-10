import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Stack as LayoutStack, Box } from '@/components/layout';
import { Text, Button } from '@/components/ui';
import { theme } from '@/theme';
import { useAppColors, ThemeContext } from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { bootState } from '../index';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, Defs, LinearGradient as SvgLinearGradient, Stop, Ellipse, Polygon } from 'react-native-svg';


const MULTILINGUAL_PHRASES = [
  { text: "Hello! Learn a new language.", lang: "en" },
  { text: "à¦¸à§à¦¬à¦¾à¦—à¦¤à¦®! à¦¨à¦¤à§à¦¨ à¦­à¦¾à¦·à¦¾ à¦¶à¦¿à¦–à§à¦¨à¥¤", lang: "bn" },
  { text: "à¤¨à¤®à¤¸à¥à¤¤à¥‡! à¤à¤• à¤¨à¤ˆ à¤­à¤¾à¤·à¤¾ à¤¸à¥€à¤–à¥‡à¤‚à¥¤", lang: "hi" },
  { text: "ã“ã‚“ã«ã¡ã¯ï¼æ–°ã—ã„è¨€èªžã‚’å­¦ã³ã¾ã—ã‚‡ã†ã€‚", lang: "ja" },
  { text: "ä½ å¥½ï¼å­¦ä¹ ä¸€é—¨æ–°è¯­è¨€ã€‚", lang: "zh" },
  { text: "Â¡Hola! Aprende un nuevo idioma.", lang: "es" }
];

export default function OnboardingFlow() {
  const colors = useAppColors();
  const { isDark: isSystemDark, themeMode, setThemeMode } = React.useContext(ThemeContext);
  const toggleTheme = () => setThemeMode(themeMode === 'light' ? 'dark' : themeMode === 'dark' ? 'light' : isSystemDark ? 'light' : 'dark');
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % MULTILINGUAL_PHRASES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);


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

  const isLight = colors.background === '#FFFFFF' || colors.background === '#F8FAFC' || colors.background === '#F5F8FF' || colors.background === '#F5F7FF';

  // Step 1: Welcome & Value Prop (S013)
  const renderStep1 = () => (
    <View style={styles.step1Container}>
      
      {/* Mascot / Visual Composition */}
      <View style={styles.visualContainerWrapper}>
        <View style={styles.visualContainer}>
          {/* Decorative background blurs (approximated with large gradients) */}
          {isLight && (
            <>
              <View style={[styles.blurBlob, { left: -20, top: 20, backgroundColor: 'rgba(6,182,212,0.15)' }]} />
              <View style={[styles.blurBlob, { right: -20, bottom: 20, backgroundColor: 'rgba(139,92,246,0.15)' }]} />
            </>
          )}

          {/* Floating Language Badges */}
          <View style={[styles.badge, { top: 16, left: 24 }]}>
            <Text style={styles.badgeText}>A</Text>
            <Text style={styles.badgeCode}>EN</Text>
          </View>
          <View style={[styles.badge, { top: 24, right: 24 }]}>
            <Text style={[styles.badgeText, { color: '#8B5CF6' }]}>Ã£Ââ€š</Text>
            <Text style={styles.badgeCode}>JA</Text>
          </View>
          <View style={[styles.badge, { bottom: 20, left: 32 }]}>
            <Text style={[styles.badgeText, { color: '#F97316' }]}>Ã¦â€“â€¡</Text>
            <Text style={styles.badgeCode}>ZH</Text>
          </View>
          <View style={[styles.badge, { bottom: 16, right: 28 }]}>
            <Text style={[styles.badgeText, { color: '#06B6D4' }]}>Ã‚Â¡Hola!</Text>
            <Text style={styles.badgeCode}>ES</Text>
          </View>
          {/* Orbital Rings */}
          <View style={[styles.orbitalRing, { width: 250, height: 250, borderColor: 'rgba(6,182,212,0.2)' }]} />
          <View style={[styles.orbitalRing, { width: 210, height: 210, borderColor: 'rgba(139,92,246,0.2)' }]} />

          {/* Mascot Center using SVG */}
          <View style={styles.mascotGlowWrap}>
            <LinearGradient
              colors={['#06B6D4', '#571BC1', '#8B5CF6']}
              style={styles.mascotSpinRing}
            />
            <View style={styles.mascotInnerBg}>
              <View style={styles.mascotFaceGradientWrap}>
                <LinearGradient
                  colors={['#06B6D4', '#8B5CF6']}
                  style={styles.mascotFaceGradient}
                >
                  <Svg width={64} height={64} viewBox="0 0 80 80">
                    <Ellipse cx={40} cy={38} fill="#FFFFFF" rx={28} ry={24} />
                    <Polygon fill="#FFFFFF" points="32,54 44,52 35,62" />
                    <Circle cx={33} cy={38} fill="#06B6D4" r={4.5} />
                    <Circle cx={47} cy={38} fill="#8B5CF6" r={4.5} />
                    <Path d="M37 45 Q40 48 43 45" stroke="#1A2438" strokeLinecap="round" strokeWidth={2} />
                  </Svg>
                </LinearGradient>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Typography */}
      <LayoutStack gap="xs" align="center" style={styles.textContainer}>
        <Text variant="display" color="textPrimary" align="center" style={styles.titleText}>
          Speak a new language{'\n'}with <Text style={{ color: colors.primary }}>confidence.</Text>
        </Text>
        <View style={{ marginTop: theme.spacing.sm }}>
          <Text variant="body" color="textSecondary" align="center" style={{ maxWidth: 300, fontSize: 15, lineHeight: 24 }}>
            Practice naturally with your personal AI language coach.
          </Text>
        </View>
      </LayoutStack>

      {/* Feature Cards */}
      <Box direction="row" justify="space-between" align="stretch" style={styles.featuresRow}>
        <View style={[styles.featureCard, { backgroundColor: isLight ? '#F8FAFC' : colors.surfaceElevated }]}>
          <View style={[styles.featureIconWrap, { backgroundColor: 'rgba(6,182,212,0.15)' }]}>
            <MaterialIcons name="swap-calls" size={24} color="#06B6D4" />
          </View>
          <Text variant="caption" weight="semibold" color="textPrimary" align="center">Live{"\n"}Translation</Text>
        </View>
        <View style={[styles.featureCard, { backgroundColor: isLight ? '#F8FAFC' : colors.surfaceElevated }]}>
          <View style={[styles.featureIconWrap, { backgroundColor: 'rgba(139,92,246,0.15)' }]}>
            <MaterialIcons name="mic" size={24} color="#8B5CF6" />
          </View>
          <Text variant="caption" weight="semibold" color="textPrimary" align="center">Speaking{"\n"}Practice</Text>
        </View>
        <View style={[styles.featureCard, { backgroundColor: isLight ? '#F8FAFC' : colors.surfaceElevated }]}>
          <View style={[styles.featureIconWrap, { backgroundColor: 'rgba(250,134,87,0.15)' }]}>
            <MaterialIcons name="auto-awesome" size={22} color="#FA8657" />
          </View>
          <Text variant="caption" weight="semibold" color="textPrimary" align="center">Grammar{"\n"}Tips</Text>
        </View>
      </Box>

    </View>
  );

  // Step 2: AI Coach Intro (S014)
  const renderStep2 = () => (
    <View style={{ width: '100%', paddingVertical: 16 }}>
      <View style={styles.orbVisualContainer}>
        {isLight && (
          <>
            <View style={[styles.blurBlob, { left: -20, top: 20, backgroundColor: 'rgba(6,182,212,0.15)' }]} />
            <View style={[styles.blurBlob, { right: -20, bottom: 20, backgroundColor: 'rgba(139,92,246,0.15)' }]} />
          </>
        )}

        <View style={[styles.floatingBubble, { top: 10, left: -10, backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
          <MaterialIcons name="person" size={14} color="#06B6D4" />
          <Text style={[styles.bubbleText, { color: colors.textPrimary }]}>{`"${MULTILINGUAL_PHRASES[phraseIndex].text}"`}</Text>
        </View>
        <View style={[styles.floatingBubble, { bottom: 15, right: -10, backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
          <MaterialIcons name="smart-toy" size={14} color="#8B5CF6" />
          <Text style={[styles.bubbleText, { color: colors.textPrimary }]}>"I'm doing great!"</Text>
        </View>

        <View style={styles.orbShadow}>
          <LinearGradient colors={['#06B6D4', '#571BC1', '#8B5CF6']} style={styles.orbRing}>
            <View style={[styles.orbInner, { backgroundColor: isLight ? '#FFFFFF' : '#111A2B' }]}>
              <LinearGradient colors={['#06B6D4', '#8B5CF6']} style={styles.orbCore}>
                <Svg width="56" height="56" viewBox="0 0 80 80">
                  <Ellipse cx="40" cy="38" fill="#FFFFFF" rx="28" ry="24" />
                  <Polygon fill="#FFFFFF" points="32,54 44,52 35,62" />
                  <Circle cx="33" cy="38" fill="#06B6D4" r="4.5" />
                  <Circle cx="47" cy="38" fill="#8B5CF6" r="4.5" />
                  <Path d="M37 45 Q40 48 43 45" stroke="#1A2438" strokeLinecap="round" strokeWidth="2" />
                </Svg>
              </LinearGradient>
            </View>
          </LinearGradient>
        </View>
      </View>

      <LayoutStack gap="sm" align="center" style={{ marginTop: 20, marginBottom: 20 }}>
        <Text variant="display" color="textPrimary" align="center" style={{ fontSize: 26, lineHeight: 32 }}>
          Your personal{'\n'}
          <Text style={{ color: colors.primary }}>AI language coach</Text>
        </Text>
        <Text variant="body" color="textSecondary" align="center" style={{ fontSize: 13, lineHeight: 20, maxWidth: 300 }}>
          Practice real conversations, improve your pronunciation, and speak with confidence - anytime, anywhere.
        </Text>
      </LayoutStack>

      <LayoutStack gap="sm">
        <View style={[styles.featureCardRow, { backgroundColor: colors.surfaceElevated, borderColor: 'rgba(6,182,212,0.2)' }]}>
          <View style={[styles.featureIconWrapLarge, { backgroundColor: 'rgba(6,182,212,0.15)' }]}>
            <MaterialIcons name="chat" size={20} color="#06B6D4" />
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="heading" color="textPrimary" style={{ fontSize: 14 }}>Speak Naturally</Text>
            <Text variant="caption" color="textSecondary">Practice everyday conversations with AI.</Text>
          </View>
        </View>

        <View style={[styles.featureCardRow, { backgroundColor: colors.surfaceElevated, borderColor: 'rgba(139,92,246,0.2)' }]}>
          <View style={[styles.featureIconWrapLarge, { backgroundColor: 'rgba(139,92,246,0.15)' }]}>
            <MaterialIcons name="graphic-eq" size={20} color="#8B5CF6" />
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="heading" color="textPrimary" style={{ fontSize: 14 }}>Instant Feedback</Text>
            <Text variant="caption" color="textSecondary">Improve pronunciation and grammar as you learn.</Text>
          </View>
        </View>

        <View style={[styles.featureCardRow, { backgroundColor: colors.surfaceElevated, borderColor: 'rgba(250,134,87,0.2)' }]}>
          <View style={[styles.featureIconWrapLarge, { backgroundColor: 'rgba(250,134,87,0.15)' }]}>
            <MaterialIcons name="bolt" size={20} color="#FA8657" />
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="heading" color="textPrimary" style={{ fontSize: 14 }}>Learn at Your Pace</Text>
            <Text variant="caption" color="textSecondary">Build confidence through personalized practice.</Text>
          </View>
        </View>
      </LayoutStack>
    </View>
  );

  // Step 3: Final confirmation (S015)
  const renderStep3 = () => (
    <View style={{ width: '100%', paddingVertical: 16 }}>
      {/* Hero Celebratory Orb Container */}
      <View style={styles.s015OrbContainer}>
        {/* Concentric Rings */}
        <View style={[StyleSheet.absoluteFill, styles.s015Ring1, { backgroundColor: 'rgba(6,182,212,0.05)' }]} />
        <View style={[styles.s015Ring2, { backgroundColor: (isSystemDark ? '#161b29' : 'rgba(0,0,0,0.02)'), opacity: 0.4 }]} />
        <View style={[styles.s015Ring3, { backgroundColor: (isSystemDark ? '#252a38' : 'rgba(0,0,0,0.06)'), opacity: 0.3 }]} />
        <View style={[styles.s015CoreGlow, { backgroundColor: 'rgba(6,182,212,0.2)' }]} />

        {/* Floating Greeting Chips */}
        <View style={[styles.s015Chip, { top: 10, left: 0, transform: [{ rotate: '-6deg' }], backgroundColor: (isSystemDark ? '#252a38' : 'rgba(0,0,0,0.06)') }]}>
          <View style={[styles.s015ChipDot, { backgroundColor: '#06B6D4' }]} />
          <Text style={[styles.bubbleText, { color: colors.textPrimary }]}>Hello!</Text>
        </View>
        <View style={[styles.s015Chip, { top: 20, right: 0, transform: [{ rotate: '6deg' }], backgroundColor: (isSystemDark ? '#252a38' : 'rgba(0,0,0,0.06)') }]}>
          <View style={[styles.s015ChipDot, { backgroundColor: '#FA8657' }]} />
          <Text style={[styles.bubbleText, { color: colors.textPrimary }]}>à¦¸à§à¦¬à¦¾à¦—à¦¤à¦®!</Text>
        </View>
        <View style={[styles.s015Chip, { top: 120, right: -10, transform: [{ rotate: '-3deg' }], backgroundColor: (isSystemDark ? '#252a38' : 'rgba(0,0,0,0.06)') }]}>
          <View style={[styles.s015ChipDot, { backgroundColor: '#8B5CF6' }]} />
          <Text style={[styles.bubbleText, { color: colors.textPrimary }]}>ã“ã‚“ã«ã¡ã¯!</Text>
        </View>
        <View style={[styles.s015Chip, { bottom: 20, left: 10, transform: [{ rotate: '4deg' }], backgroundColor: (isSystemDark ? '#252a38' : 'rgba(0,0,0,0.06)') }]}>
          <View style={[styles.s015ChipDot, { backgroundColor: '#06B6D4' }]} />
          <Text style={[styles.bubbleText, { color: colors.textPrimary }]}>Â¡Hola!</Text>
        </View>
        <View style={[styles.s015Chip, { bottom: 25, right: 15, transform: [{ rotate: '-6deg' }], backgroundColor: (isSystemDark ? '#252a38' : 'rgba(0,0,0,0.06)') }]}>
          <View style={[styles.s015ChipDot, { backgroundColor: '#FFB599' }]} />
          <Text style={[styles.bubbleText, { color: colors.textPrimary }]}>à¤¨à¤®à¤¸à¥à¤¤à¥‡!</Text>
        </View>

        {/* Luminous AI Mascot Orb */}
        <View style={styles.s015MascotWrap}>
          <LinearGradient colors={['#06B6D4', '#06B6D4', '#8B5CF6']} style={styles.s015MascotBorder}>
            <View style={[styles.s015MascotInner, { backgroundColor: isSystemDark ? 'rgba(9,14,27,0.8)' : 'rgba(255,255,255,0.9)' }]}>
              {/* Eyes */}
              <View style={{ flexDirection: 'row', gap: 16, zIndex: 10 }}>
                <View style={styles.s015Eye}>
                  <View style={styles.s015EyeGlint} />
                </View>
                <View style={styles.s015Eye}>
                  <View style={styles.s015EyeGlint} />
                </View>
              </View>
              {/* Smile */}
              <LinearGradient colors={['#06B6D4', '#8B5CF6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.s015Smile} />
              {/* Audio Bars */}
              <View style={{ flexDirection: 'row', gap: 4, marginTop: 8, alignItems: 'center', zIndex: 10 }}>
                <View style={[styles.s015AudioBar, { height: 6 }]} />
                <View style={[styles.s015AudioBar, { height: 12, backgroundColor: '#8B5CF6' }]} />
                <View style={[styles.s015AudioBar, { height: 4 }]} />
              </View>
            </View>
          </LinearGradient>
        </View>
      </View>

      {/* Main Heading Stack */}
      <LayoutStack gap="xs" align="center" style={{ marginTop: 20 }}>
        <Text variant="display" color="textPrimary" align="center" style={styles.titleText}>
          You're All Set!
        </Text>
        <Text variant="body" color="textSecondary" align="center" style={{ fontSize: 15, lineHeight: 24, maxWidth: 318, marginTop: 4 }}>
          Your personal AI language coach is ready. Start speaking, learning, and building confidence one conversation at a time.
        </Text>
      </LayoutStack>

      {/* Success Benefits */}
      <View style={{ flexDirection: 'column', gap: 12, marginTop: 24, width: '100%' }}>
        {/* Item 1 */}
        <View style={[styles.s015BenefitItem, { backgroundColor: colors.surfaceElevated }]}>
          <View style={[styles.s015BenefitIconWrap, { backgroundColor: (isSystemDark ? '#252a38' : 'rgba(0,0,0,0.06)') }]}>
            <MaterialIcons name="chat-bubble" size={24} color="#06B6D4" />
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="label" weight="semibold" color="textPrimary" style={{ fontSize: 14 }}>Speak with Confidence</Text>
            <Text variant="bodySmall" color="textSecondary" style={{ marginTop: 2 }}>Practice conversations at your own pace.</Text>
          </View>
        </View>
        {/* Item 2 */}
        <View style={[styles.s015BenefitItem, { backgroundColor: colors.surfaceElevated }]}>
          <View style={[styles.s015BenefitIconWrap, { backgroundColor: (isSystemDark ? '#252a38' : 'rgba(0,0,0,0.06)') }]}>
            <MaterialIcons name="auto-fix-high" size={24} color="#8B5CF6" />
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="label" weight="semibold" color="textPrimary" style={{ fontSize: 14 }}>Get Instant Feedback</Text>
            <Text variant="bodySmall" color="textSecondary" style={{ marginTop: 2 }}>Improve pronunciation and grammar as you learn.</Text>
          </View>
        </View>
        {/* Item 3 */}
        <View style={[styles.s015BenefitItem, { backgroundColor: colors.surfaceElevated }]}>
          <View style={[styles.s015BenefitIconWrap, { backgroundColor: (isSystemDark ? '#252a38' : 'rgba(0,0,0,0.06)') }]}>
            <MaterialIcons name="trending-up" size={24} color="#FA8657" />
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="label" weight="semibold" color="textPrimary" style={{ fontSize: 14 }}>Track Your Progress</Text>
            <Text variant="bodySmall" color="textSecondary" style={{ marginTop: 2 }}>Build better habits with every session.</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <Screen bg="background" edges={['top', 'bottom', 'left', 'right']} padded={false}>
      <View style={[styles.container, { paddingHorizontal: theme.layout.screenPadding }]}>
        
        {/* Top Header / Logo / Navigation */}
        <Box direction="row" justify="space-between" align="center" style={styles.header}>
          {step === 1 ? (
            <Box direction="row" align="center" gap="sm">
              {/* HTML-styled PolyTalk Logo SVG */}
              <View style={styles.logoWrap}>
                <View style={styles.logoInner}>
                  <Svg width={24} height={24} viewBox="0 0 100 100">
                    <Defs>
                      <SvgLinearGradient id="brandGrad" x1="0" x2="100" y1="0" y2="100">
                        <Stop offset="0" stopColor="#06B6D4" />
                        <Stop offset="1" stopColor="#8B5CF6" />
                      </SvgLinearGradient>
                    </Defs>
                    <Circle cx="50" cy="50" fill="url(#brandGrad)" r="42" />
                    <Circle cx="50" cy="50" fill="#1A2438" r="32" />
                    <Path d="M50 26C38 26 28 35 28 47C28 54 32 60 38 64V74L48 68C48.7 68 49.3 68 50 68C62 68 72 59 72 47C72 35 62 26 50 26Z" fill="#FFFFFF" />
                    <Circle cx="43" cy="46" fill="#06B6D4" r="4.5" />
                    <Circle cx="57" cy="46" fill="#8B5CF6" r="4.5" />
                  </Svg>
                </View>
              </View>
              <View>
                <Text variant="title" weight="bold" color="textPrimary" style={{ fontSize: 18, lineHeight: 22 }}>PolyTalk</Text>
                <Text variant="caption" color="primary" style={styles.logoSub}>AI LANGUAGE COACH</Text>
              </View>
            </Box>
          ) : (
            <Button variant="ghost" label="Back" size="sm" onPress={handleBack} />
          )}

          <Box direction="row" align="center" gap="sm">
            {step === 1 && (
              <TouchableOpacity onPress={toggleTheme} style={[styles.themeBtn, { backgroundColor: isLight ? '#F1F5F9' : '#1E293B' }]} activeOpacity={0.7}>
                <MaterialIcons name={isLight ? "dark-mode" : "light-mode"} size={18} color={colors.textPrimary} />
              </TouchableOpacity>
            )}
            {step < 3 && (
              <TouchableOpacity onPress={handleComplete} style={[styles.skipBtn, { backgroundColor: isLight ? '#F1F5F9' : '#1E293B' }]} activeOpacity={0.7}>
                <Text variant="label" color="textSecondary" weight="semibold">Skip</Text>
              </TouchableOpacity>
            )}
          </Box>
        </Box>

        {/* Scrollable Content Area */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingVertical: 20 }} showsVerticalScrollIndicator={false}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </ScrollView>

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
                    { backgroundColor: isActive ? 'transparent' : colors.disabled },
                    isActive && styles.progressDotActive
                  ]} 
                  importantForAccessibility="no"
                >
                  {isActive && (
                    <LinearGradient
                      colors={['#06B6D4', '#8B5CF6']}
                      style={StyleSheet.absoluteFill}
                    />
                  )}
                </View>
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
                  <Text variant="body" weight="bold" color="textInverse" style={{ marginRight: 8, fontSize: 16 }}>
                    Get Started
                  </Text>
                  <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={handleComplete} style={styles.signInLink}>
                <Text variant="bodySmall" color="textSecondary" align="center">
                  Already have an account? <Text variant="bodySmall" weight="semibold" color="primary">Sign in</Text>
                </Text>
              </TouchableOpacity>
            </View>
          ) : step === 2 ? (
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
                  <Text variant="body" weight="bold" color="textInverse" style={{ marginRight: 8, fontSize: 16 }}>
                    Continue
                  </Text>
                  <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
              <Box marginVertical="md">
                <Text variant="caption" color="textSecondary" align="center">
                  Step 2 of 3 Ã¢â‚¬Â¢ Personalized AI Curriculum
                </Text>
              </Box>
            </View>
          ) : (
            <View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleComplete}
                style={styles.gradientButtonWrap}
              >
                <LinearGradient
                  colors={['#06B6D4', '#06B6D4', '#8B5CF6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientButton}
                >
                  <Text variant="body" weight="bold" color="textInverse" style={{ marginRight: 8, fontSize: 16 }}>
                    Start Learning
                  </Text>
                  <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
              <View style={{ alignItems: 'center', marginTop: 12 }}>
                <Text variant="bodySmall" color="textSecondary" weight="medium">Your language journey starts here.</Text>
                <Text style={{ fontSize: 10, letterSpacing: 1.5, color: (isSystemDark ? '#869397' : '#707070'), textTransform: 'uppercase', marginTop: 4, fontWeight: 'bold' }}>Step 3 of 3 â€¢ Journey Begins</Text>
              </View>
            </View>
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
  logoWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#06B6D4',
    padding: 1.5,
    shadowColor: '#06B6D4',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  logoInner: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#0E1320',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoSub: {
    fontSize: 9,
    letterSpacing: 1.5,
    marginTop: 2,
    fontWeight: 'bold',
  },
  themeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  mainArea: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    paddingVertical: theme.spacing.xl,
  },
  footer: {
    paddingBottom: theme.layout.screenPadding,
  },
  dotsContainer: {
    marginBottom: theme.spacing.xl,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressDotActive: {
    width: 28,
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  visualContainerWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  visualContainer: {
    width: '100%',
    maxWidth: 360,
    height: 270,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: theme.spacing.sm,
  },
  orbVisualContainer: {
    width: '100%',
    height: 270,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: theme.spacing.sm,
  },
  floatingBubble: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  bubbleText: {
    fontSize: 11,
    fontWeight: '500',
  },
  orbShadow: {
    width: 128,
    height: 128,
    borderRadius: 64,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#06B6D4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 40,
    elevation: 10,
    zIndex: 10,
  },
  orbRing: {
    width: '100%',
    height: '100%',
    borderRadius: 64,
    padding: 4,
  },
  orbInner: {
    flex: 1,
    width: '100%',
    borderRadius: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbCore: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  featureCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
  },
  blurBlob: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  orbitalRing: {
    position: 'absolute',
    borderWidth: 1,
    borderRadius: 200,
  },
  mascotGlowWrap: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#06B6D4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 40,
    elevation: 10,
    zIndex: 10,
  },
  mascotSpinRing: {
    ...StyleSheet.absoluteFill,
    borderRadius: 70,
    opacity: 0.9,
  },
  mascotInnerBg: {
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: '#111A2B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mascotFaceGradientWrap: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  mascotFaceGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    zIndex: 20,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#06B6D4',
  },
  badgeCode: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  textContainer: {
    marginTop: 4,
    marginBottom: theme.spacing.lg,
  },
  titleText: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
  },
  featuresRow: {
    width: '100%',
    paddingHorizontal: 0,
    marginTop: theme.spacing.sm,
  },
  featureCard: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 16,
    alignItems: 'center',
  },
  featureIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureIconWrapLarge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureRowInfo: {
    paddingVertical: theme.spacing.sm,
  },
  gradientButtonWrap: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#06B6D4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 8,
  },
  gradientButton: {
    flexDirection: 'row',
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
  },
  s015OrbContainer: {
    width: '100%',
    maxWidth: 310,
    aspectRatio: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: theme.spacing.xs,
  },
  s015Ring1: {
    borderRadius: 200,
  },
  s015Ring2: {
    position: 'absolute',
    top: 16, bottom: 16, left: 16, right: 16,
    borderRadius: 200,
  },
  s015Ring3: {
    position: 'absolute',
    top: 36, bottom: 36, left: 36, right: 36,
    borderRadius: 200,
  },
  s015CoreGlow: {
    position: 'absolute',
    top: 56, bottom: 56, left: 56, right: 56,
    borderRadius: 200,
  },
  s015Chip: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 20,
  },
  s015ChipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  s015MascotWrap: {
    width: 144,
    height: 144,
    borderRadius: 72,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#06B6D4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 36,
    elevation: 10,
    zIndex: 10,
  },
  s015MascotBorder: {
    width: '100%',
    height: '100%',
    borderRadius: 72,
    padding: 4,
  },
  s015MascotInner: {
    flex: 1,
    width: '100%',
    borderRadius: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  s015Eye: {
    width: 14,
    height: 20,
    borderRadius: 7,
    backgroundColor: '#06B6D4',
    shadowColor: '#06B6D4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },
  s015EyeGlint: {
    width: 4,
    height: 6,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    marginTop: 2,
    marginLeft: 2,
  },
  s015Smile: {
    width: 28,
    height: 8,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    marginTop: 10,
    zIndex: 10,
  },
  s015AudioBar: {
    width: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(6,182,212,0.7)',
  },
  s015BenefitItem: {
    width: '100%',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  s015BenefitIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInLink: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.sm,
  },
});







