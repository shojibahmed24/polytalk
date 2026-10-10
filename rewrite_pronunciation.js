const fs = require('fs');
const content = `import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  ScrollView, 
  Platform,
  SafeAreaView
} from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/components/ui';
import { ThemeContext } from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';

export default function PronunciationScreen() {
  const { isDark: isSystemDark } = React.useContext(ThemeContext);
  
  const [showTranslation, setShowTranslation] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  
  // Animations
  const [pulseAnim] = useState(() => new Animated.Value(0));
  const [micGlow] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.3, duration: 1000, useNativeDriver: true })
      ])
    ).start();
  }, [pulseAnim]);

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(micGlow, { toValue: 1, duration: 1200, useNativeDriver: true }),
          Animated.timing(micGlow, { toValue: 0, duration: 1200, useNativeDriver: true })
        ])
      ).start();
    } else {
      micGlow.stopAnimation();
      micGlow.setValue(0);
    }
  }, [isRecording, micGlow]);

  const handleMicPress = () => {
    if (hasResult) {
      setHasResult(false);
    }
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setHasResult(true);
    }, 2500);
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
    tertiaryFixed: isSystemDark ? '#FFB4AB' : '#93000A',
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
              <Text style={{ fontSize: 16, fontWeight: '700', color: st.onSurface, letterSpacing: -0.5 }}>S008 Pronunciation Practice</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2, gap: 6 }}>
                <Animated.View style={[styles.pulseDot, { backgroundColor: st.primary, opacity: pulseAnim }]} />
                <Text style={{ fontSize: 10, fontWeight: '700', color: st.primary, textTransform: 'uppercase', letterSpacing: 0.5 }}>
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

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Context Info */}
        <View style={styles.topContextRow}>
          <View style={[styles.contextBadge, { backgroundColor: isSystemDark ? 'rgba(37,42,56,0.8)' : 'rgba(229,231,235,0.8)' }]}>
            <Animated.View style={[styles.pulseDot, { backgroundColor: st.primary, opacity: pulseAnim }]} />
            <Text style={{ fontSize: 11, fontWeight: '700', color: st.primary, marginLeft: 6, textTransform: 'uppercase' }}>Practicing English</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <TouchableOpacity style={[styles.circleBtn, { backgroundColor: st.surfaceContainerHigh }]}>
              <MaterialIcons name="info" size={18} color={st.onSurfaceVariant} />
            </TouchableOpacity>
            <View style={[styles.streakBadge, { backgroundColor: st.surfaceContainerHigh }]}>
              <MaterialIcons name="local-fire-department" size={16} color={st.tertiary} />
              <Text style={{ fontSize: 12, fontWeight: '700', color: st.tertiary, marginLeft: 4 }}>3 days</Text>
            </View>
          </View>
        </View>

        {/* Progress Tracker */}
        <View style={[styles.progressCard, { backgroundColor: st.surfaceContainerLow }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: st.onSurface }}>Daily pronunciation</Text>
            <Text style={{ fontSize: 13, fontWeight: '700', color: st.primary }}>4 of 10 exercises</Text>
          </View>
          <View style={[styles.progressBarBg, { backgroundColor: st.surfaceContainerHighest }]}>
            <LinearGradient 
              colors={[st.primary, st.secondaryContainer]} 
              start={{x: 0, y: 0}} end={{x: 1, y: 0}}
              style={[styles.progressBarFill, { width: '40%' }]}
            />
          </View>
        </View>

        {/* Main Practice Target Card */}
        <View style={[styles.targetCard, { backgroundColor: st.surfaceContainer }]}>
          <View style={styles.glowOrb} />
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: st.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: 0.5 }}>Say this sentence</Text>
            <View style={[styles.tagBadge, { backgroundColor: st.surfaceContainerHighest }]}>
              <Text style={{ fontSize: 11, color: st.secondary }}>Conversation</Text>
              <View style={[styles.tagDot, { backgroundColor: st.secondary }]} />
              <Text style={{ fontSize: 11, color: st.secondary }}>A2-B1</Text>
            </View>
          </View>

          <View style={{ paddingVertical: 12 }}>
            <Text style={{ fontSize: 24, fontWeight: '500', color: st.onSurface, lineHeight: 32 }}>
              "Could you please help me find the <Text style={{ fontWeight: '700', color: st.primary, textDecorationLine: 'underline', textDecorationColor: isSystemDark ? 'rgba(76,215,246,0.4)' : 'rgba(6,182,212,0.4)' }}>station</Text>?"
            </Text>
          </View>

          <View style={styles.audioControlsRow}>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: st.surfaceContainerHigh }]}>
              <MaterialIcons name="volume-up" size={18} color={st.primary} />
              <Text style={{ fontSize: 13, fontWeight: '600', color: st.primary, marginLeft: 6 }}>Listen Audio</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionBtn, { backgroundColor: st.surfaceContainerHigh }]}
              onPress={() => setShowTranslation(!showTranslation)}
            >
              <MaterialIcons name="translate" size={18} color={st.onSurfaceVariant} />
              <Text style={{ fontSize: 13, fontWeight: '600', color: st.onSurfaceVariant, marginLeft: 6 }}>
                {showTranslation ? 'Hide translation' : 'Show translation'}
              </Text>
            </TouchableOpacity>
          </View>

          {showTranslation && (
            <View style={[styles.translationDrawer, { backgroundColor: isSystemDark ? 'rgba(9,14,27,0.8)' : 'rgba(255,255,255,0.8)', borderLeftColor: st.tertiary }]}>
              <Text style={{ fontSize: 14, fontStyle: 'italic', color: st.tertiaryFixed }}>
                "আপনি কি দয়া করে আমাকে স্টেশনটি খুঁজে পেতে সাহায্য করতে পারবেন?"
              </Text>
              <Text style={{ fontSize: 11, color: st.onSurfaceVariant, marginTop: 4 }}>
                Bengali Translation • Polite Inquiry
              </Text>
            </View>
          )}
        </View>

        {/* Real-Time Voice Visualizer & Tactile Mic Station */}
        <View style={[styles.micCard, { backgroundColor: st.surfaceContainerLow }]}>
          {/* Visualizer Mock */}
          <View style={styles.visualizerRow}>
            {[3, 6, 10, 8, 11, 7, 9, 5, 2].map((h, i) => (
              <Animated.View 
                key={i} 
                style={[
                  styles.visBar, 
                  { 
                    height: isRecording ? h * 4 : h * 1.5, 
                    backgroundColor: i % 2 === 0 ? st.primary : st.secondaryContainer,
                    opacity: isRecording ? 1 : 0.4
                  }
                ]} 
              />
            ))}
          </View>

          {/* Mic Button */}
          <View style={styles.micCenter}>
            <Animated.View style={[styles.micGlowRing1, { opacity: micGlow, backgroundColor: st.primary }]} />
            <Animated.View style={[styles.micGlowRing2, { opacity: micGlow, backgroundColor: st.secondaryContainer }]} />
            
            <TouchableOpacity onPress={handleMicPress} activeOpacity={0.8}>
              <LinearGradient 
                colors={[st.primary, st.secondaryContainer]} 
                start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                style={styles.micBtnOuter}
              >
                <View style={[styles.micBtnInner, { backgroundColor: isRecording ? 'transparent' : 'rgba(255,255,255,0.1)' }]}>
                  <MaterialIcons name="mic" size={36} color="#FFFFFF" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={{ alignItems: 'center', marginTop: 8 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: st.onSurface }}>
              {isRecording ? 'Listening...' : 'Tap to start speaking'}
            </Text>
            <Text style={{ fontSize: 13, color: st.onSurfaceVariant, marginTop: 2 }}>
              Speak naturally and at a conversational pace
            </Text>
          </View>
          
          <View style={[styles.modeBadge, { backgroundColor: isSystemDark ? 'rgba(48,52,67,0.6)' : 'rgba(209,213,219,0.6)' }]}>
            <View style={[styles.pulseDot, { backgroundColor: st.tertiaryContainer }]} />
            <Text style={{ fontSize: 11, color: st.onSurfaceVariant, marginLeft: 6 }}>Live AI Voice Engine Ready</Text>
          </View>
        </View>

        {/* AI Evaluation Card */}
        {hasResult && (
          <>
            <View style={[styles.evalCard, { backgroundColor: st.surfaceContainer }]}>
              {/* Score Header */}
              <View style={styles.evalHeader}>
                <View>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: st.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: 0.5 }}>Analysis Outcome</Text>
                  <Text style={{ fontSize: 20, fontWeight: '700', color: st.onSurface, marginTop: 2 }}>Pronunciation Score</Text>
                </View>
                <View style={[styles.scoreDial, { backgroundColor: st.surfaceContainerLow }]}>
                  <Svg width="56" height="56" viewBox="0 0 36 36" style={{ transform: [{ rotate: '-90deg' }] }}>
                    <Path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={st.surfaceContainerHighest}
                      strokeWidth="3.5"
                    />
                    <Path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={st.primary}
                      strokeWidth="3.5"
                      strokeDasharray="86, 100"
                      strokeLinecap="round"
                    />
                  </Svg>
                  <View style={styles.scoreTextAbs}>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: st.primary }}>86</Text>
                  </View>
                </View>
              </View>

              {/* Coach Summary */}
              <View style={[styles.coachSummary, { backgroundColor: isSystemDark ? 'rgba(37,42,56,0.6)' : 'rgba(229,231,235,0.6)' }]}>
                <MaterialIcons name="sentiment-satisfied" size={20} color={st.primary} style={{ marginTop: 2 }} />
                <Text style={{ flex: 1, fontSize: 14, color: st.onSurface, lineHeight: 20 }}>
                  <Text style={{ fontWeight: '600' }}>Great clarity! </Text>
                  Focus on softening the final vowel and smoothing the "sh" sound in <Text style={{ fontWeight: '600', color: st.primary }}>"station"</Text>.
                </Text>
              </View>

              {/* Micro Metrics */}
              <View style={styles.microMetricsRow}>
                <View style={[styles.microMetricBox, { backgroundColor: st.surfaceContainerLow }]}>
                  <Text style={{ fontSize: 11, color: st.onSurfaceVariant }}>Clarity</Text>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: st.primary, marginTop: 2 }}>92%</Text>
                </View>
                <View style={[styles.microMetricBox, { backgroundColor: st.surfaceContainerLow }]}>
                  <Text style={{ fontSize: 11, color: st.onSurfaceVariant }}>Accuracy</Text>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: st.primary, marginTop: 2 }}>88%</Text>
                </View>
                <View style={[styles.microMetricBox, { backgroundColor: st.surfaceContainerLow }]}>
                  <Text style={{ fontSize: 11, color: st.onSurfaceVariant }}>Rhythm</Text>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: st.secondary, marginTop: 2 }}>78%</Text>
                </View>
              </View>

              {/* Phonetic Improvement */}
              <View style={{ marginTop: 16 }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: st.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Targeted Phonetic Improvement</Text>
                <View style={[styles.phoneticBox, { backgroundColor: st.surfaceContainerLow }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <TouchableOpacity style={[styles.iconBtn2, { backgroundColor: st.surfaceContainerHigh }]}>
                      <MaterialIcons name="volume-up" size={20} color={st.primary} />
                    </TouchableOpacity>
                    <View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={{ fontSize: 16, fontWeight: '700', color: st.onSurface }}>sta•tion</Text>
                        <View style={[styles.errBadge, { backgroundColor: isSystemDark ? 'rgba(147,0,10,0.2)' : 'rgba(255,228,230,0.6)' }]}>
                          <Text style={{ fontSize: 11, fontWeight: '700', color: st.tertiaryFixed }}>Missed /eɪ/</Text>
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                        <Text style={{ fontSize: 13, color: st.onSurfaceVariant, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' }}>/'steɪ.</Text>
                        <View style={[styles.errBadgeInline, { backgroundColor: isSystemDark ? 'rgba(147,0,10,0.3)' : 'rgba(255,228,230,0.8)' }]}>
                          <Text style={{ fontSize: 13, fontWeight: '700', color: st.tertiaryFixed, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' }}>eɪʃn</Text>
                        </View>
                        <Text style={{ fontSize: 13, color: st.onSurfaceVariant, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' }}>/</Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity style={[styles.isolateBtn, { backgroundColor: st.surfaceContainerHigh }]}>
                    <MaterialIcons name="replay" size={16} color={st.primary} />
                    <Text style={{ fontSize: 13, fontWeight: '600', color: st.primary, marginLeft: 4 }}>Isolate</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Bottom Actions */}
            <View style={{ marginTop: 8, paddingBottom: 24 }}>
              <TouchableOpacity style={styles.primaryActionWrap} onPress={() => setHasResult(false)}>
                <LinearGradient 
                  colors={[st.primary, st.secondaryContainer]} 
                  start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                  style={styles.primaryAction}
                >
                  <MaterialIcons name="mic" size={22} color="#FFFFFF" />
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginLeft: 8 }}>Record Again</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <View style={styles.secondaryActionRow}>
                <TouchableOpacity style={[styles.secBtn, { backgroundColor: st.surfaceContainerHigh }]}>
                  <MaterialIcons name="replay" size={18} color={st.onSurface} />
                  <Text style={{ fontSize: 14, fontWeight: '600', color: st.onSurface, marginLeft: 6 }}>Listen Again</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.secBtn, { backgroundColor: st.surfaceContainerHigh }]}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: st.primary, marginRight: 6 }}>Continue</Text>
                  <MaterialIcons name="arrow-forward" size={18} color={st.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ScrollView>
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
    gap: 16,
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
  circleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  progressCard: {
    padding: 16,
    borderRadius: 12,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    padding: 2,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  targetCard: {
    padding: 20,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  glowOrb: {
    position: 'absolute',
    top: -48,
    right: -48,
    width: 144,
    height: 144,
    borderRadius: 72,
    backgroundColor: 'rgba(6,182,212,0.1)',
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  tagDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  audioControlsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  translationDrawer: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 2,
  },
  micCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    overflow: 'hidden',
  },
  visualizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 48,
    width: '100%',
  },
  visBar: {
    width: 6,
    borderRadius: 3,
  },
  micCenter: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  micGlowRing1: {
    position: 'absolute',
    width: 112,
    height: 112,
    borderRadius: 56,
  },
  micGlowRing2: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  micBtnOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    padding: 2,
    elevation: 8,
    shadowColor: '#06B6D4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 32,
  },
  micBtnInner: {
    flex: 1,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 16,
  },
  evalCard: {
    padding: 16,
    borderRadius: 16,
  },
  evalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
  scoreDial: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  scoreTextAbs: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coachSummary: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 10,
    gap: 12,
    marginTop: 8,
  },
  microMetricsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  microMetricBox: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
  },
  phoneticBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
  },
  iconBtn2: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  errBadgeInline: {
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  isolateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  primaryActionWrap: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#06B6D4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
  },
  primaryAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
  },
  secondaryActionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  secBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
`;

fs.writeFileSync('app/(app)/pronunciation.tsx', content, 'utf8');
