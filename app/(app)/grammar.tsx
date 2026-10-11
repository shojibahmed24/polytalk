import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  ScrollView, 
  TextInput as RNTextInput,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ImageBackground
} from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/components/ui';
import { ThemeContext } from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { requestGrammarCorrection, GrammarCorrectionResult } from '@/services/ai';
import { PuterConnectModal } from '@/components/PuterConnectModal';
import { getStoredPuterToken } from '@/services/puter';
import { supabase } from '@/utils/supabase';

export default function GrammarScreen() {
  const { isDark: isSystemDark } = React.useContext(ThemeContext);
  const [inputText, setInputText] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isPuterConnected, setIsPuterConnected] = useState(false);
  const [isPuterModalOpen, setIsPuterModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [correctionResult, setCorrectionResult] = useState<GrammarCorrectionResult | null>(null);

  useEffect(() => {
    async function checkPuter() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const uid = user?.id || null;
        setCurrentUserId(uid);
        const token = await getStoredPuterToken(uid);
        setIsPuterConnected(!!token);
      } catch {}
    }
    checkPuter();
  }, []);
  
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Animations
  const [pulseAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.3, duration: 1000, useNativeDriver: true })
      ])
    ).start();
  }, [pulseAnim]);

  const handleCheck = async () => {
    if (!inputText.trim() || isChecking) return;
    if (!isPuterConnected) {
      setIsPuterModalOpen(true);
      return;
    }
    Keyboard.dismiss();
    setIsChecking(true);

    try {
      const res = await requestGrammarCorrection(inputText.trim(), {
        targetLanguage: 'English',
        interfaceLanguage: 'English',
        userId: currentUserId,
      });

      if (res.needsPuterAuth) {
        setIsPuterConnected(false);
        setIsPuterModalOpen(true);
      } else {
        setCorrectionResult(res);
        setShowFeedback(true);
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 150);
      }
    } catch (e) {
      console.warn('Grammar check failed:', e);
    } finally {
      setIsChecking(false);
    }
  };

  const handleInsert = (phrase: string) => {
    setInputText(prev => prev + phrase);
  };

  const st = {
    surface: isSystemDark ? '#0E1320' : '#F8F9FC',
    surfaceContainerLowest: isSystemDark ? '#090E1B' : '#FFFFFF',
    surfaceContainerLow: isSystemDark ? '#161B29' : '#F9FAFB',
    surfaceContainer: isSystemDark ? '#1A1F2D' : '#F3F4F6',
    surfaceContainerHigh: isSystemDark ? '#252A38' : '#E5E7EB',
    surfaceContainerHighest: isSystemDark ? '#303443' : '#D1D5DB',
    surfaceVariant: isSystemDark ? '#303443' : '#E2E8F0',
    onSurface: isSystemDark ? '#DEE2F5' : '#111827',
    onSurfaceVariant: isSystemDark ? '#BCC9CD' : '#6B7280',
    primary: isSystemDark ? '#4CD7F6' : '#06B6D4',
    primaryContainer: isSystemDark ? '#003640' : '#E0F2FE', 
    onPrimaryContainer: isSystemDark ? '#4CD7F6' : '#0369A1',
    secondary: isSystemDark ? '#D0BCFF' : '#8B5CF6',
    secondaryContainer: isSystemDark ? '#4A3382' : '#EDE9FE',
    tertiary: isSystemDark ? '#F2B8B5' : '#E11D48',
    tertiaryContainer: isSystemDark ? '#93000A' : '#FFE4E6',
    onTertiaryContainer: isSystemDark ? '#F2B8B5' : '#BE123C',
    outline: isSystemDark ? '#869397' : '#9CA3AF',
    divider: isSystemDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: st.surface }}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isSystemDark ? 'rgba(14,19,32,0.85)' : 'rgba(248,249,252,0.85)', borderBottomColor: st.divider }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
              <MaterialIcons name="arrow-back" size={24} color={st.onSurfaceVariant} />
            </TouchableOpacity>
            
            <View style={{ justifyContent: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: st.onSurface, letterSpacing: -0.5 }}>S007 Grammar Correction</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2, gap: 6 }}>
                <Animated.View style={[styles.pulseDot, { backgroundColor: st.primary, opacity: pulseAnim }]} />
                <Text style={{ fontSize: 11, fontWeight: '700', color: st.primary, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  B2 Upper Intermediate
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.headerRight}>
            <View style={[styles.langToggle, { backgroundColor: st.surfaceContainerHigh }]}>
              <Text style={{ fontSize: 10, fontWeight: '600', color: st.onSurfaceVariant }}>ES</Text>
              <MaterialIcons name="sync-alt" size={14} color={st.primary} style={{ marginHorizontal: 4 }} />
              <Text style={{ fontSize: 10, fontWeight: '700', color: st.onSurface }}>EN</Text>
            </View>
            <View style={[styles.userAvatar, { backgroundColor: st.primary }]}>
              <MaterialIcons name="person" size={18} color={isSystemDark ? '#003640' : '#FFFFFF'} />
            </View>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Context & Quick Actions Banner */}
          <View style={styles.topContextRow}>
            <View style={[styles.contextBadge, { backgroundColor: st.surfaceContainerHigh }]}>
              <Animated.View style={[styles.pulseDot, { backgroundColor: st.primary, opacity: pulseAnim }]} />
              <Text style={{ fontSize: 12, fontWeight: '600', color: st.onSurface, marginLeft: 6 }}>Practicing English</Text>
              <View style={[styles.microBadge, { backgroundColor: st.surfaceContainerHighest }]}>
                <Text style={{ fontSize: 9, fontWeight: '700', color: st.primary }}>US/UK</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <TouchableOpacity style={[styles.circleBtn, { backgroundColor: st.surfaceContainerHigh }]}>
                <MaterialIcons name="history" size={20} color={st.onSurfaceVariant} />
              </TouchableOpacity>
              <View style={[styles.liveCoachBadge, { backgroundColor: isSystemDark ? 'rgba(74,51,130,0.3)' : 'rgba(139,92,246,0.1)' }]}>
                <MaterialIcons name="auto-awesome" size={14} color={st.secondary} />
                <Text style={{ fontSize: 11, fontWeight: '600', color: st.secondary, marginLeft: 4 }}>Coach Live</Text>
              </View>
            </View>
          </View>

          {/* Daily Learning Summary Metrics Card */}
          <View style={[styles.metricsCard, { backgroundColor: st.surfaceContainerLow }]}>
            <View style={styles.metricCol}>
              <View style={[styles.metricIconWrap, { backgroundColor: isSystemDark ? 'rgba(76,215,246,0.1)' : 'rgba(6,182,212,0.1)' }]}>
                <MaterialIcons name="spellcheck" size={20} color={st.primary} />
              </View>
              <Text style={{ fontSize: 24, fontWeight: '700', color: st.onSurface }}>8</Text>
              <Text style={{ fontSize: 12, color: st.onSurfaceVariant }}>Reviewed</Text>
            </View>
            <View style={[styles.metricDivider, { backgroundColor: st.surfaceContainerHighest }]} />
            
            <View style={styles.metricCol}>
              <View style={[styles.metricIconWrap, { backgroundColor: isSystemDark ? 'rgba(0,54,64,0.5)' : '#E0F2FE' }]}>
                <MaterialIcons name="verified" size={20} color={st.primaryContainer} />
              </View>
              <Text style={{ fontSize: 24, fontWeight: '700', color: st.onSurface }}>85%</Text>
              <Text style={{ fontSize: 12, color: st.onSurfaceVariant }}>Accuracy</Text>
            </View>
            <View style={[styles.metricDivider, { backgroundColor: st.surfaceContainerHighest }]} />
            
            <View style={styles.metricCol}>
              <View style={[styles.metricIconWrap, { backgroundColor: isSystemDark ? 'rgba(242,184,181,0.2)' : 'rgba(225,29,72,0.1)' }]}>
                <MaterialIcons name="local-fire-department" size={20} color={st.tertiary} />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 2 }}>
                <Text style={{ fontSize: 24, fontWeight: '700', color: st.onSurface }}>3</Text>
                <Text style={{ fontSize: 12, fontWeight: '600', color: st.tertiary }}>days</Text>
              </View>
              <Text style={{ fontSize: 12, color: st.onSurfaceVariant }}>Streak</Text>
            </View>
          </View>

          {/* Main Correction Card (Hero Focus) */}
          <View style={[styles.card, { backgroundColor: st.surfaceContainer }]}>
            <View style={styles.cardHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <MaterialIcons name="psychology" size={20} color={st.primary} />
                <Text style={{ fontSize: 18, fontWeight: '700', color: st.onSurface }}>Sentence Polishing</Text>
              </View>
              <View style={[styles.recentBadge, { backgroundColor: st.surfaceContainerHigh }]}>
                <Text style={{ fontSize: 10, fontWeight: '600', color: st.onSurfaceVariant }}>Recent Dialogue</Text>
              </View>
            </View>

            {/* Context Scene Micro-Banner */}
            <View style={styles.sceneBanner}>
              <ImageBackground 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOiTF6oAn_TzgEr7ckxH07p45nO-4jCS693KuIdA0iVMPp0tDcfrKRQ_YyXrLrgH4aPcQt5uWeDBFPj3gbKLYvzV3DElDec_B5PMi6MmZU-gxjF2YVyOBwN-Y5SFU92QyetVuzMT2TqSxFzT5jYV8BDHMHjO0OA-DyGXqfiG1Ewtj2tVCpj-epvi--VQnzdox5F9feCfgliS021ybE_hxvcSpupVArDo4-VkDyHLEyBLqcX5cSayCt' }} 
                style={styles.sceneImg}
              >
                <LinearGradient 
                  colors={[isSystemDark ? 'rgba(9,14,27,0.9)' : 'rgba(255,255,255,0.9)', 'transparent']} 
                  start={{x: 0, y: 0}} end={{x: 1, y: 0}} 
                  style={styles.sceneGradient}
                >
                  <Text style={{ fontSize: 10, fontWeight: '700', color: st.primary, textTransform: 'uppercase' }}>Cafe Scenario</Text>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: st.onSurface }}>Ordering lunch courteously</Text>
                </LinearGradient>
              </ImageBackground>
            </View>

            {/* Original Sentence */}
            <View style={[styles.sentenceBox, { backgroundColor: st.surfaceContainerLow }]}>
              <View style={styles.sentenceHeader}>
                <View style={[styles.flagBadge, { backgroundColor: isSystemDark ? 'rgba(147,0,10,0.3)' : 'rgba(225,29,72,0.1)' }]}>
                  <MaterialIcons name="flag" size={12} color={st.tertiary} />
                  <Text style={{ fontSize: 10, fontWeight: '700', color: st.tertiary, marginLeft: 4 }}>NEEDS CORRECTION</Text>
                </View>
                <TouchableOpacity>
                  <MaterialIcons name="volume-down" size={20} color={st.onSurfaceVariant} />
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
                <Text style={{ fontSize: 16, color: st.onSurface, lineHeight: 24 }}>
                  "{correctionResult ? correctionResult.original : 'I want a chicken burger and a orange juice.'}"
                </Text>
              </View>
            </View>

            {/* Arrow */}
            <View style={styles.arrowWrap}>
              <View style={[styles.arrowCircle, { backgroundColor: st.surfaceContainerHigh }]}>
                <MaterialIcons name="arrow-downward" size={18} color={st.primary} />
              </View>
            </View>

            {/* Corrected Sentence */}
            <View style={[styles.sentenceBox, { backgroundColor: st.surfaceContainerHighest }]}>
              <View style={styles.sentenceHeader}>
                <View style={[styles.flagBadge, { backgroundColor: isSystemDark ? 'rgba(76,215,246,0.15)' : 'rgba(6,182,212,0.15)' }]}>
                  <MaterialIcons name="check-circle" size={13} color={st.primary} />
                  <Text style={{ fontSize: 10, fontWeight: '700', color: st.primary, marginLeft: 4 }}>CORRECTED & NATURAL</Text>
                </View>
                <Text style={{ fontSize: 11, fontWeight: '600', color: st.secondary }}>Level B2+</Text>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: st.primary, lineHeight: 24 }}>
                  "{correctionResult ? correctionResult.better : 'I\'d like a chicken burger and an orange juice, please.'}"
                </Text>
              </View>
            </View>

            {/* Action Bar */}
            <View style={styles.actionBar}>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: st.surfaceContainerHigh }]}>
                <MaterialIcons name="volume-up" size={18} color={st.primary} />
                <Text style={{ fontSize: 12, fontWeight: '600', color: st.primary, marginLeft: 4 }}>Hear Audio</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: st.surfaceContainerHigh }]}>
                <MaterialIcons name="bookmark-border" size={18} color={st.secondary} />
                <Text style={{ fontSize: 12, fontWeight: '600', color: st.secondary, marginLeft: 4 }}>Save Word</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: st.surfaceContainerHigh }]}>
                <MaterialIcons name="auto-awesome" size={18} color={st.tertiary} />
                <Text style={{ fontSize: 12, fontWeight: '600', color: st.tertiary, marginLeft: 4 }}>Ask AI Why</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Grammar Explanation Card */}
          <View style={[styles.card, { backgroundColor: st.surfaceContainer }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <MaterialIcons name="lightbulb" size={22} color={st.primary} />
              <Text style={{ fontSize: 18, fontWeight: '700', color: st.onSurface }}>Why is this better?</Text>
            </View>
            
            {correctionResult && correctionResult.explanations.length > 0 ? (
              correctionResult.explanations.map((exp, index) => (
                <View key={index} style={[styles.explanationBullet, { backgroundColor: st.surfaceContainerLow, marginTop: index > 0 ? 12 : 0 }]}>
                  <View style={[styles.bulletIcon, { backgroundColor: isSystemDark ? 'rgba(76,215,246,0.1)' : 'rgba(6,182,212,0.1)' }]}>
                    <MaterialIcons name="auto-awesome" size={16} color={st.primary} />
                  </View>
                  <Text style={{ flex: 1, fontSize: 14, color: st.onSurface, lineHeight: 22 }}>{exp}</Text>
                </View>
              ))
            ) : (
              <>
                <View style={[styles.explanationBullet, { backgroundColor: st.surfaceContainerLow }]}>
                  <View style={[styles.bulletIcon, { backgroundColor: isSystemDark ? 'rgba(76,215,246,0.1)' : 'rgba(6,182,212,0.1)' }]}>
                    <MaterialIcons name="record-voice-over" size={16} color={st.primary} />
                  </View>
                  <Text style={{ flex: 1, fontSize: 14, color: st.onSurface, lineHeight: 22 }}>
                    <Text style={{ fontWeight: '700', color: st.primary }}>"I'd like"</Text> sounds significantly more courteous in hospitality settings compared to the demanding nuance of <Text style={{ textDecorationLine: 'line-through', color: st.onSurfaceVariant }}>"I want"</Text>.
                  </Text>
                </View>

                <View style={[styles.explanationBullet, { backgroundColor: st.surfaceContainerLow, marginTop: 12 }]}>
                  <View style={[styles.bulletIcon, { backgroundColor: isSystemDark ? 'rgba(74,51,130,0.3)' : 'rgba(139,92,246,0.1)' }]}>
                    <MaterialIcons name="phonelink-ring" size={16} color={st.secondary} />
                  </View>
                  <Text style={{ flex: 1, fontSize: 14, color: st.onSurface, lineHeight: 22 }}>
                    Use <Text style={{ fontWeight: '700', color: st.secondary }}>"an"</Text> before words starting with vowel sounds. Saying <Text style={{ fontWeight: '700', color: st.primary }}>"an orange"</Text> allows effortless phonetic transition.
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* Try These Examples */}
          <View style={[styles.card, { backgroundColor: st.surfaceContainer }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <MaterialIcons name="sync" size={20} color={st.secondary} />
                <Text style={{ fontSize: 18, fontWeight: '700', color: st.onSurface }}>Try these examples</Text>
              </View>
              <Text style={{ fontSize: 11, color: st.onSurfaceVariant }}>Tap to listen</Text>
            </View>
            
            <TouchableOpacity style={[styles.exampleRow, { backgroundColor: st.surfaceContainerLow }]}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{ fontSize: 13, color: st.onSurfaceVariant, textDecorationLine: 'line-through' }}>"I want some water."</Text>
                  <MaterialIcons name="arrow-forward" size={14} color={st.primary} />
                </View>
                <Text style={{ fontSize: 15, fontWeight: '600', color: st.primary, marginTop: 2 }}>"I'd like some water, please."</Text>
              </View>
              <View style={[styles.volIconWrap, { backgroundColor: st.surfaceContainerHighest }]}>
                <MaterialIcons name="volume-up" size={18} color={st.onSurfaceVariant} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.exampleRow, { backgroundColor: st.surfaceContainerLow, marginTop: 8 }]}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{ fontSize: 13, color: st.onSurfaceVariant, textDecorationLine: 'line-through' }}>"She go to school."</Text>
                  <MaterialIcons name="arrow-forward" size={14} color={st.primary} />
                </View>
                <Text style={{ fontSize: 15, fontWeight: '600', color: st.secondary, marginTop: 2 }}>"She goes to school."</Text>
              </View>
              <View style={[styles.volIconWrap, { backgroundColor: st.surfaceContainerHighest }]}>
                <MaterialIcons name="volume-up" size={18} color={st.onSurfaceVariant} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Interactive Practice Section ("Your Turn") */}
          <View style={[styles.card, { backgroundColor: st.surfaceContainer, shadowColor: st.primary, shadowOffset: {width: 0, height: 8}, shadowOpacity: 0.1, shadowRadius: 24, elevation: 6 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={[styles.iconWrap, { backgroundColor: isSystemDark ? 'rgba(76,215,246,0.1)' : 'rgba(6,182,212,0.1)' }]}>
                  <MaterialIcons name="edit-note" size={18} color={st.primary} />
                </View>
                <Text style={{ fontSize: 18, fontWeight: '700', color: st.onSurface }}>Your turn</Text>
              </View>
              <View style={[styles.xpBadge, { backgroundColor: isSystemDark ? 'rgba(76,215,246,0.1)' : '#E0F2FE' }]}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: st.primary }}>+20 XP</Text>
              </View>
            </View>
            
            <Text style={{ fontSize: 14, color: st.onSurface, marginTop: 8, lineHeight: 22 }}>
              Write a more polite way to order a coffee.
            </Text>

            <View style={{ marginTop: 12 }}>
              <RNTextInput
                style={[styles.practiceInput, { backgroundColor: st.surfaceContainerLowest, color: st.onSurface }]}
                placeholder="e.g. I'd like a hot cappuccino, please..."
                placeholderTextColor={isSystemDark ? 'rgba(188,201,205,0.5)' : 'rgba(107,114,128,0.5)'}
                multiline
                numberOfLines={3}
                value={inputText}
                onChangeText={setInputText}
              />
              <TouchableOpacity style={[styles.micBtnAbsolute, { backgroundColor: st.surfaceContainerHigh }]}>
                <MaterialIcons name="mic" size={18} color={st.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            <View style={styles.chipsRow}>
              <Text style={{ fontSize: 11, color: st.onSurfaceVariant, marginRight: 4 }}>Tap helper:</Text>
              <TouchableOpacity onPress={() => handleInsert("I'd like a ")} style={[styles.chipBtn, { backgroundColor: st.surfaceContainerHigh }]}>
                <Text style={{ fontSize: 11, color: st.onSurface }}>+ "I'd like a..."</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleInsert(", please.")} style={[styles.chipBtn, { backgroundColor: st.surfaceContainerHigh }]}>
                <Text style={{ fontSize: 11, color: st.onSurface }}>+ ", please."</Text>
              </TouchableOpacity>
            </View>

            {showFeedback && (
              <View style={[styles.feedbackWrap, { backgroundColor: isSystemDark ? 'rgba(0,54,64,0.3)' : '#E0F2FE' }]}>
                <MaterialIcons name="task-alt" size={20} color={st.primary} />
                <Text style={{ fontSize: 13, color: st.onSurface, marginLeft: 8 }}>Excellent! Natural phrasing and polite demeanor.</Text>
              </View>
            )}

            <TouchableOpacity onPress={handleCheck} disabled={isChecking} style={{ marginTop: 16 }}>
              <LinearGradient 
                colors={[st.primaryContainer, st.secondaryContainer]} 
                start={{x: 0, y: 0}} end={{x: 1, y: 0}} 
                style={styles.checkBtn}
              >
                <MaterialIcons name="bolt" size={20} color={st.onPrimaryContainer} />
                <Text style={{ fontSize: 16, fontWeight: '700', color: st.onPrimaryContainer, marginLeft: 8 }}>Check My Answer</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
        </ScrollView>
      </KeyboardAvoidingView>

      <PuterConnectModal
        visible={isPuterModalOpen}
        onClose={() => setIsPuterModalOpen(false)}
        onConnected={() => {
          setIsPuterConnected(true);
        }}
        userId={currentUserId}
        isDark={isSystemDark}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'ios' ? 44 : 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 64,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  langToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 24,
  },
  topContextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contextBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  microBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveCoachBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  metricsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
  },
  metricCol: {
    flex: 1,
    alignItems: 'center',
  },
  metricIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  metricDivider: {
    width: 1,
    height: 32,
  },
  card: {
    padding: 16,
    borderRadius: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  recentBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sceneBanner: {
    width: '100%',
    height: 96,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  sceneImg: {
    width: '100%',
    height: '100%',
  },
  sceneGradient: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  sentenceBox: {
    padding: 16,
    borderRadius: 12,
  },
  sentenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  errorHighlight: {
    paddingHorizontal: 4,
    borderBottomWidth: 2,
    marginHorizontal: 2,
  },
  arrowWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -14,
    marginBottom: -14,
    zIndex: 10,
  },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  explanationBullet: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 12,
  },
  bulletIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  exampleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
  },
  volIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  xpBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  practiceInput: {
    minHeight: 100,
    borderRadius: 12,
    padding: 16,
    paddingTop: 16,
    fontSize: 15,
    textAlignVertical: 'top',
  },
  micBtnAbsolute: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 6,
  },
  chipBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  feedbackWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginTop: 16,
  },
  checkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  }
});

