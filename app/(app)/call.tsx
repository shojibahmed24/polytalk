import React, { useState, useEffect } from 'react';
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
import Svg, { Circle } from 'react-native-svg';

export default function LiveCallScreen() {
  const { isDark: isSystemDark } = React.useContext(ThemeContext);
  
  const [secondsElapsed, setSecondsElapsed] = useState(154);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [showCaptions, setShowCaptions] = useState(true);
  
  // Animations
  const [pulseAnim] = useState(() => new Animated.Value(0));
  const [orbPulse] = useState(() => new Animated.Value(0));
  const [pingAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.3, duration: 1000, useNativeDriver: true })
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pingAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(pingAnim, { toValue: 0, duration: 1500, useNativeDriver: true })
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(orbPulse, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(orbPulse, { toValue: 0.4, duration: 2000, useNativeDriver: true })
      ])
    ).start();
  }, [pulseAnim, pingAnim, orbPulse]);

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
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
    onSecondaryContainer: isSystemDark ? '#D0BCFF' : '#4A3382',
    tertiary: isSystemDark ? '#F2B8B5' : '#E11D48',
    tertiaryContainer: isSystemDark ? '#93000A' : '#FFE4E6',
    tertiaryFixed: isSystemDark ? '#FFB4AB' : '#93000A',
    error: isSystemDark ? '#FFB4AB' : '#EF4444',
    errorContainer: isSystemDark ? '#93000A' : '#FEE2E2',
    onErrorContainer: isSystemDark ? '#FFB4AB' : '#B91C1C',
    outline: isSystemDark ? '#869397' : '#9CA3AF',
    divider: isSystemDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: st.surface }}>
      {/* Absolute Ambient Glows */}
      <View style={[styles.ambientGlow1, { backgroundColor: isSystemDark ? 'rgba(76,215,246,0.1)' : 'rgba(6,182,212,0.1)' }]} />
      <View style={[styles.ambientGlow2, { backgroundColor: isSystemDark ? 'rgba(74,51,130,0.2)' : 'rgba(139,92,246,0.1)' }]} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: isSystemDark ? 'rgba(14,19,32,0.85)' : 'rgba(248,249,252,0.85)' }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
              <MaterialIcons name="close" size={24} color={st.onSurfaceVariant} />
            </TouchableOpacity>
            
            <View style={{ justifyContent: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: st.onSurface, letterSpacing: -0.5 }}>S009 Live AI Voice Call</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2, gap: 6 }}>
                <Animated.View style={[styles.pulseDot, { backgroundColor: st.primary, opacity: pulseAnim }]} />
                <Text style={{ fontSize: 11, color: st.primary }}>Live AI Session</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.headerRight}>
            <View style={[styles.langToggle, { backgroundColor: st.surfaceContainerHigh }]}>
              <Text style={{ fontSize: 10, fontWeight: '600', color: st.onSurfaceVariant }}>TARGET</Text>
              <Text style={{ fontSize: 10, fontWeight: '700', color: st.primary, marginLeft: 4 }}>ES (Castilian)</Text>
            </View>
            <View style={[styles.userAvatar, { backgroundColor: st.primary }]}>
              <MaterialIcons name="person" size={18} color={isSystemDark ? '#003640' : '#FFFFFF'} />
            </View>
          </View>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Sub-Header / Session Context Bar */}
          <View style={styles.topContextRow}>
            <View style={[styles.contextBadge, { backgroundColor: st.surfaceContainerHigh }]}>
              <Animated.View style={[styles.pulseDot, { backgroundColor: st.primary, opacity: pulseAnim }]} />
              <Text style={{ fontSize: 12, fontWeight: '700', color: st.primary, marginHorizontal: 6 }}>Connected</Text>
              <Text style={{ fontSize: 11, color: st.onSurfaceVariant, marginRight: 6 }}>â€¢</Text>
              <Text style={{ fontSize: 13, color: st.onSurface, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' }}>{formatTime(secondsElapsed)}</Text>
            </View>
            
            <TouchableOpacity style={[styles.topicBadgeBtn, { backgroundColor: st.surfaceContainerHigh }]}>
              <MaterialIcons name="restaurant" size={16} color={st.primary} />
              <Text style={{ fontSize: 11, color: st.onSurface, marginHorizontal: 4 }} numberOfLines={1}>Ordering Food</Text>
              <MaterialIcons name="expand-more" size={16} color={st.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          {/* Real-Time Activity State Indicator */}
          <View style={{ alignItems: 'center', marginTop: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Animated.View style={[styles.pulseDot, { backgroundColor: st.primary, opacity: pulseAnim }]} />
              <Text style={{ fontSize: 16, fontWeight: '600', color: st.primary, letterSpacing: 0.5 }}>AI is listening...</Text>
            </View>
            <Text style={{ fontSize: 11, color: st.onSurfaceVariant, marginTop: 4 }}>Natural Castilian Accent Enabled</Text>
          </View>

          {/* Central AI Dynamic Visual Presence */}
          <View style={styles.orbContainer}>
            {/* Outer rings */}
            <Animated.View style={[styles.orbRing1, { borderColor: st.primary, opacity: pulseAnim }]} />
            <Animated.View style={[styles.orbRing2, { borderColor: st.secondary, opacity: orbPulse }]} />
            
            {/* Core Orb */}
            <TouchableOpacity activeOpacity={0.9} style={styles.orbCoreWrap}>
              <LinearGradient 
                colors={[st.primary, st.secondaryContainer, st.primaryContainer]} 
                style={styles.orbGradientOuter}
              >
                <View style={[styles.orbInnerSurface, { backgroundColor: st.surfaceContainer }]}>
                  <LinearGradient 
                    colors={['rgba(255,255,255,0.1)', 'transparent']} 
                    style={styles.orbInnerGlow} 
                  />
                  
                  <View style={[styles.orbPupil, { backgroundColor: isSystemDark ? 'rgba(9,14,27,0.7)' : 'rgba(255,255,255,0.7)' }]}>
                    <View style={styles.waveformInner}>
                      {[12, 24, 16, 28, 12].map((h, i) => (
                        <Animated.View 
                          key={i} 
                          style={[
                            styles.waveLine, 
                            { 
                              height: h, 
                              backgroundColor: i % 2 === 0 ? st.primary : st.secondary,
                              opacity: orbPulse
                            }
                          ]} 
                        />
                      ))}
                    </View>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: st.primary, letterSpacing: 1, marginTop: 4 }}>POLYTALK</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Active Scenario Strip */}
          <View style={[styles.scenarioStrip, { backgroundColor: st.surfaceContainerLow }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <MaterialIcons name="menu-book" size={16} color={st.tertiaryContainer} />
                <Text style={{ fontSize: 11, fontWeight: '700', color: st.tertiaryContainer, textTransform: 'uppercase', letterSpacing: 0.5 }}>Active Scenario</Text>
              </View>
              <TouchableOpacity>
                <Text style={{ fontSize: 11, fontWeight: '600', color: st.primary }}>Change Topic</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={[styles.scenarioIconWrap, { backgroundColor: st.surfaceContainerHigh }]}>
                  <MaterialIcons name="dinner-dining" size={18} color={st.primary} />
                </View>
                <Text style={{ fontSize: 15, color: st.onSurface }}>Ordering Tapas at a Madrid Bistro</Text>
              </View>
              <View style={[styles.levelBadge, { backgroundColor: st.surfaceContainerHigh }]}>
                <Text style={{ fontSize: 11, color: st.onSurfaceVariant }}>B1 Inter</Text>
              </View>
            </View>
          </View>

          {/* Live Transcripts / Captions Container */}
          <View style={[styles.captionsContainer, { backgroundColor: st.surfaceContainer }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <MaterialIcons name="closed-caption" size={18} color={st.onSurfaceVariant} />
                <Text style={{ fontSize: 11, fontWeight: '700', color: st.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: 0.5 }}>Live Synchronized Captions</Text>
              </View>
              <TouchableOpacity onPress={() => setShowCaptions(!showCaptions)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={{ fontSize: 11, color: st.primary }}>{showCaptions ? 'Hide Captions' : 'Show Captions'}</Text>
                <MaterialIcons name={showCaptions ? "visibility-off" : "visibility"} size={16} color={st.primary} />
              </TouchableOpacity>
            </View>

            {showCaptions && (
              <View style={{ gap: 12 }}>
                {/* AI Bubble */}
                <View style={styles.aiBubbleRow}>
                  <View style={[styles.aiMiniAvatar, { backgroundColor: st.secondaryContainer }]}>
                    <MaterialIcons name="auto-awesome" size={14} color={st.onSecondaryContainer} />
                  </View>
                  <View style={[styles.aiBubbleContent, { backgroundColor: st.surfaceContainerHigh }]}>
                    <Text style={{ fontSize: 13, color: st.onSurface, lineHeight: 20 }}>
                      "Â¡Buenas tardes! Â¿Mesa para dos adentro o prefieren sentarse en la terraza soleada?"
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                      <Text style={{ fontSize: 11, color: st.secondary }}>Good afternoon! Table for two inside or terrace?</Text>
                      <TouchableOpacity>
                        <MaterialIcons name="volume-up" size={14} color={st.onSurfaceVariant} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* User Bubble */}
                <View style={styles.userBubbleRow}>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <View style={[styles.userBubbleContent, { backgroundColor: st.surfaceContainerHighest }]}>
                      <Text style={{ fontSize: 13, color: st.primary, lineHeight: 20 }}>
                        "Nos gustarÃ­a una mesa en la terraza, por favor."
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 4 }}>
                        <Text style={{ fontSize: 11, color: st.onSurfaceVariant }}>Pronunciation:</Text>
                        <Text style={{ fontSize: 11, fontWeight: '700', color: st.primary }}>96%</Text>
                        <MaterialIcons name="check-circle" size={14} color={st.primary} />
                      </View>
                    </View>
                  </View>
                  <View style={[styles.userMiniAvatar, { backgroundColor: st.primaryContainer }]}>
                    <MaterialIcons name="person" size={14} color={st.onPrimaryContainer} />
                  </View>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      {/* Bottom Call Controls Floating Island */}
      <View style={[styles.callControlsRow, { backgroundColor: isSystemDark ? 'rgba(37,42,56,0.95)' : 'rgba(229,231,235,0.95)' }]}>
        <TouchableOpacity style={styles.controlBtn} onPress={() => setIsMuted(!isMuted)}>
          <View style={[styles.controlIconWrap, { backgroundColor: isMuted ? st.errorContainer : st.surfaceContainerHighest }]}>
            <MaterialIcons name={isMuted ? "mic-off" : "mic"} size={22} color={isMuted ? st.error : st.onSurface} />
          </View>
          <Text style={{ fontSize: 11, color: st.onSurfaceVariant, marginTop: 4 }}>{isMuted ? 'Unmute' : 'Mute'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlBtn} onPress={() => setIsSpeaker(!isSpeaker)}>
          <View style={[styles.controlIconWrap, { backgroundColor: st.surfaceContainerHighest }]}>
            <MaterialIcons name={isSpeaker ? "volume-up" : "hearing"} size={22} color={st.onSurface} />
          </View>
          <Text style={{ fontSize: 11, color: st.onSurfaceVariant, marginTop: 4 }}>{isSpeaker ? 'Speaker' : 'Earpiece'}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.endCallBtn} 
          onPress={() => router.push('/(app)/summary' as never)}
        >
          <View style={[styles.endCallIconWrap, { backgroundColor: st.errorContainer }]}>
            <MaterialIcons name="call-end" size={28} color={st.onErrorContainer} />
          </View>
          <Text style={{ fontSize: 11, fontWeight: '700', color: st.error, marginTop: 4 }}>End Call</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlBtn}>
          <View style={[styles.controlIconWrap, { backgroundColor: st.surfaceContainerHighest }]}>
            <MaterialIcons name="lightbulb" size={22} color={st.onSurface} />
          </View>
          <Text style={{ fontSize: 11, color: st.onSurfaceVariant, marginTop: 4 }}>Tip</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlBtn}>
          <View style={[styles.controlIconWrap, { backgroundColor: st.surfaceContainerHighest }]}>
            <MaterialIcons name="more-horiz" size={22} color={st.onSurface} />
          </View>
          <Text style={{ fontSize: 11, color: st.onSurfaceVariant, marginTop: 4 }}>Options</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footnote}>
        <MaterialIcons name="history-edu" size={14} color={st.onSurfaceVariant} />
        <Text style={{ fontSize: 11, color: st.onSurfaceVariant, marginLeft: 6 }}>Session will automatically save into S010 AI Call Report</Text>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ambientGlow1: {
    position: 'absolute',
    top: -50,
    left: '50%',
    marginLeft: -160,
    width: 320,
    height: 320,
    borderRadius: 160,
    transform: [{ scaleX: 1.5 }],
    opacity: 0.5,
  },
  ambientGlow2: {
    position: 'absolute',
    top: 150,
    left: '50%',
    marginLeft: -120,
    width: 240,
    height: 240,
    borderRadius: 120,
    transform: [{ scaleX: 1.5 }],
    opacity: 0.5,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 44 : 24,
    borderBottomWidth: 0,
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
  topicBadgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  orbContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
    height: 260,
  },
  orbRing1: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 2,
  },
  orbRing2: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
  },
  orbCoreWrap: {
    width: 190,
    height: 190,
    borderRadius: 95,
    elevation: 20,
    shadowColor: '#4CD7F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
  },
  orbGradientOuter: {
    flex: 1,
    borderRadius: 95,
    padding: 2,
  },
  orbInnerSurface: {
    flex: 1,
    borderRadius: 95,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  orbInnerGlow: {
    ...StyleSheet.absoluteFill,
    opacity: 0.5,
  },
  orbPupil: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  waveformInner: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 4,
    height: 28,
  },
  waveLine: {
    width: 4,
    borderRadius: 2,
  },
  scenarioStrip: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  scenarioIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  captionsContainer: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  aiBubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  aiMiniAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  aiBubbleContent: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderTopLeftRadius: 4,
  },
  userBubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  userMiniAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  userBubbleContent: {
    padding: 12,
    borderRadius: 12,
    borderTopRightRadius: 4,
    maxWidth: '90%',
  },
  callControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 40,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  controlBtn: {
    alignItems: 'center',
    width: 56,
  },
  controlIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endCallBtn: {
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  endCallIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  footnote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
  }
});

