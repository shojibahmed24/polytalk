import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Keyboard } from 'react-native';
import { router } from 'expo-router';
import { Screen, Stack, Box } from '@/components/layout';
import { Text, Card, Button, TextInput } from '@/components/ui';
import { useAppColors } from '@/theme/colors';
import { theme } from '@/theme';
import { SymbolView } from 'expo-symbols';

export default function GrammarScreen() {
  const colors = useAppColors();
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    original: string;
    corrected: string;
    explanation: string;
  } | null>(null);

  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [slideAnim] = useState(() => new Animated.Value(12));

  // Glow animation for the analyze button
  const [glowAnim] = useState(() => new Animated.Value(0));

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

    // Subtle pulsing glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [fadeAnim, slideAnim, glowAnim]);

  const handleAnalyze = () => {
    if (!inputText.trim()) return;
    
    Keyboard.dismiss();
    setIsAnalyzing(true);
    setResult(null);

    // Honest local mock delay
    setTimeout(() => {
      setIsAnalyzing(false);
      setResult({
        original: inputText,
        corrected: "This is a local demonstration. AI NLP is not yet connected.",
        explanation: "In upcoming phases, Puter.js will provide real-time grammatical corrections, part-of-speech breakdowns, and native-sounding alternatives here.",
      });
    }, 1200);
  };

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.4],
  });

  return (
    <Screen bg="background" edges={['top', 'bottom', 'left', 'right']} keyboardAware>
      <Animated.ScrollView 
        contentContainerStyle={styles.scrollContent}
        style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        showsVerticalScrollIndicator={false}
      >
        <Stack gap="xl" style={styles.container}>
          
          {/* Header */}
          <Box direction="row" align="center" style={styles.header}>
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              activeOpacity={0.7}
            >
              <SymbolView name="chevron.left" size={24} tintColor={colors.textPrimary} />
            </TouchableOpacity>
            <Text variant="heading" color="textPrimary" style={styles.headerTitle}>
              Grammar Analysis
            </Text>
            <View style={styles.headerPlaceholder} />
          </Box>

          <Text variant="body" color="textSecondary" align="center">
            Type a phrase below. The AI will analyze its structure and suggest native improvements.
          </Text>

          {/* Input Area */}
          <Card variant="elevated" padding="lg" style={{ borderColor: colors.border }}>
            <Stack gap="md">
              <TextInput
                placeholder="E.g., I goes to the store yesterday..."
                value={inputText}
                onChangeText={setInputText}
                multiline
                style={styles.inputArea}
              />
              
              <View style={styles.analyzeButtonContainer}>
                <Animated.View 
                  style={[
                    styles.glowBackdrop, 
                    { 
                      backgroundColor: colors.primary, 
                      opacity: inputText.trim() ? glowOpacity : 0 
                    }
                  ]} 
                />
                <Button 
                  label="Analyze Grammar" 
                  variant="primary" 
                  onPress={handleAnalyze}
                  loading={isAnalyzing}
                  disabled={!inputText.trim()}
                />
              </View>
            </Stack>
          </Card>

          {/* Result Area */}
          {result && (
            <Card variant="default" style={[styles.resultCard, { borderColor: colors.primary }]}>
              <Stack gap="md">
                <Box direction="row" align="center" gap="sm">
                  <SymbolView name="sparkles" size={20} tintColor={colors.primary} />
                  <Text variant="title" color="primary">Analysis Complete</Text>
                </Box>
                
                <View style={[styles.resultBlock, { backgroundColor: colors.surfaceElevated }]}>
                  <Text variant="label" color="textSecondary">Original</Text>
                  <Text variant="body" color="textPrimary" style={styles.resultText}>
                    "{result.original}"
                  </Text>
                </View>

                <View style={[styles.resultBlock, { backgroundColor: 'rgba(52, 211, 153, 0.1)' }]}>
                  <Text variant="label" color="success">Correction</Text>
                  <Text variant="body" color="textPrimary" style={styles.resultText}>
                    {result.corrected}
                  </Text>
                </View>

                <Stack gap="sm">
                  <Text variant="label" color="textSecondary">Explanation</Text>
                  <Text variant="bodySmall" color="textPrimary">
                    {result.explanation}
                  </Text>
                </Stack>
              </Stack>
            </Card>
          )}

        </Stack>
      </Animated.ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: theme.layout.screenPadding,
    paddingBottom: theme.spacing.xxl,
  },
  container: {
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
  },
  header: {
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
    width: 32,
  },
  inputArea: {
    minHeight: 100,
    maxHeight: 200,
  },
  analyzeButtonContainer: {
    position: 'relative',
    marginTop: theme.spacing.sm,
  },
  glowBackdrop: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: theme.radii.lg,
    filter: 'blur(8px)', // Web/iOS blur effect fallback for glow
  },
  resultCard: {
    borderWidth: 1,
  },
  resultBlock: {
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
  },
  resultText: {
    marginTop: theme.spacing.xs,
  },
});
