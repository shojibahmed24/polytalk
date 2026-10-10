import React from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Platform,
  SafeAreaView
} from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/components/ui';
import { ThemeContext } from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ConversationSummaryScreen() {
  const { isDark: isSystemDark } = React.useContext(ThemeContext);
  
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
    primaryFixedDim: isSystemDark ? '#4CD7F6' : '#06B6D4',
    secondary: isSystemDark ? '#D0BCFF' : '#8B5CF6',
    secondaryContainer: isSystemDark ? '#4A3382' : '#EDE9FE',
    onSecondaryContainer: isSystemDark ? '#C4ABFF' : '#4A3382',
    tertiary: isSystemDark ? '#FFB599' : '#E11D48',
    tertiaryContainer: isSystemDark ? '#FA8657' : '#FFE4E6',
    error: isSystemDark ? '#FFB4AB' : '#EF4444',
    outline: isSystemDark ? '#869397' : '#9CA3AF',
    divider: isSystemDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: st.surface }}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isSystemDark ? 'rgba(14,19,32,0.85)' : 'rgba(248,249,252,0.85)' }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
              <MaterialIcons name="arrow-back" size={24} color={st.onSurface} />
            </TouchableOpacity>
            
            <View style={{ justifyContent: 'center', marginLeft: 4 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: st.onSurface, letterSpacing: -0.5 }}>Conversation Summary</Text>
            </View>
          </View>
          
          <View style={styles.headerRight}>
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
        {/* Session Completion Hero Card */}
        <View style={styles.heroCard}>
          <LinearGradient
            colors={[st.surfaceContainerHigh, st.surfaceContainer, st.surfaceContainerLow]}
            style={styles.heroGradient}
          >
            {/* Ambient Glows */}
            <View style={[styles.glow1, { backgroundColor: isSystemDark ? 'rgba(76,215,246,0.2)' : 'rgba(6,182,212,0.1)' }]} />
            <View style={[styles.glow2, { backgroundColor: isSystemDark ? 'rgba(74,51,130,0.4)' : 'rgba(139,92,246,0.2)' }]} />
            
            <View style={{ alignItems: 'center', zIndex: 2 }}>
              {/* Orb Badge */}
              <View style={styles.orbBadgeWrap}>
                <LinearGradient colors={[st.primary, st.secondary]} style={styles.orbBadgeGlow} />
                <View style={[styles.orbBadgeInner, { backgroundColor: st.surfaceContainerHighest }]}>
                  <LinearGradient colors={[st.primaryContainer, st.secondaryContainer]} style={styles.orbBadgeIconWrap}>
                    <MaterialIcons name="auto-awesome" size={28} color={st.surfaceContainerLowest} />
                  </LinearGradient>
                </View>
                <MaterialIcons name="arrow-back-ios" size={18} color={st.primary} style={styles.orbDeco1} />
                <MaterialIcons name="brightness-auto" size={16} color={st.secondary} style={styles.orbDeco2} />
              </View>

              <View style={[styles.levelChip, { backgroundColor: isSystemDark ? 'rgba(48,52,67,0.8)' : 'rgba(209,213,219,0.8)' }]}>
                <View style={[styles.dot, { backgroundColor: st.primary }]} />
                <Text style={{ fontSize: 10, fontWeight: '700', color: st.primary, textTransform: 'uppercase', letterSpacing: 0.5, marginLeft: 6 }}>English Practice • B2</Text>
              </View>

              <Text style={{ fontSize: 26, fontWeight: '700', color: st.onSurface, letterSpacing: -0.5, marginBottom: 4 }}>Great work!</Text>
              <Text style={{ fontSize: 15, color: st.onSurfaceVariant, textAlign: 'center', maxWidth: 280, marginBottom: 16 }}>
                Every conversation makes you more confident and fluent.
              </Text>

              <View style={styles.metaRow}>
                <View style={[styles.metaPill, { backgroundColor: isSystemDark ? 'rgba(9,14,27,0.8)' : 'rgba(255,255,255,0.8)' }]}>
                  <MaterialIcons name="schedule" size={16} color={st.primary} />
                  <Text style={{ fontSize: 12, fontWeight: '600', color: st.onSurface, marginLeft: 6 }}>12 min duration</Text>
                </View>
                <View style={[styles.metaPill, { backgroundColor: isSystemDark ? 'rgba(9,14,27,0.8)' : 'rgba(255,255,255,0.8)' }]}>
                  <MaterialIcons name="mic" size={16} color={st.secondary} />
                  <Text style={{ fontSize: 12, fontWeight: '600', color: st.onSurface, marginLeft: 6 }}>AI Voice Conversation</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Key Performance Metrics */}
        <View style={styles.sectionWrap}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: st.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Session Impact</Text>
          <View style={styles.metricsGrid}>
            <View style={[styles.metricCard, { backgroundColor: st.surfaceContainer }]}>
              <View style={styles.metricHeader}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: st.onSurfaceVariant }}>Duration</Text>
                <View style={[styles.metricIconWrap, { backgroundColor: st.surfaceContainerHigh }]}>
                  <MaterialIcons name="schedule" size={18} color={st.primary} />
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
                <Text style={{ fontSize: 22, fontWeight: '700', color: st.onSurface }}>12</Text>
                <Text style={{ fontSize: 12, fontWeight: '600', color: st.primary }}>min</Text>
              </View>
              <Text style={{ fontSize: 10, fontWeight: '700', color: st.outline, marginTop: 4 }}>+4 min vs avg</Text>
            </View>

            <View style={[styles.metricCard, { backgroundColor: st.surfaceContainer }]}>
              <View style={styles.metricHeader}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: st.onSurfaceVariant }}>Words Learned</Text>
                <View style={[styles.metricIconWrap, { backgroundColor: st.surfaceContainerHigh }]}>
                  <MaterialIcons name="menu-book" size={18} color={st.secondary} />
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
                <Text style={{ fontSize: 22, fontWeight: '700', color: st.onSurface }}>6</Text>
                <Text style={{ fontSize: 12, fontWeight: '600', color: st.secondary }}>new</Text>
              </View>
              <Text style={{ fontSize: 10, fontWeight: '700', color: st.outline, marginTop: 4 }}>Acquired actively</Text>
            </View>

            <View style={[styles.metricCard, { backgroundColor: st.surfaceContainer }]}>
              <View style={styles.metricHeader}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: st.onSurfaceVariant }}>Corrections</Text>
                <View style={[styles.metricIconWrap, { backgroundColor: st.surfaceContainerHigh }]}>
                  <MaterialIcons name="check-circle" size={18} color={st.tertiary} />
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
                <Text style={{ fontSize: 22, fontWeight: '700', color: st.onSurface }}>3</Text>
                <Text style={{ fontSize: 12, fontWeight: '600', color: st.tertiary }}>reviewed</Text>
              </View>
              <Text style={{ fontSize: 10, fontWeight: '700', color: st.outline, marginTop: 4 }}>100% understood</Text>
            </View>

            <View style={[styles.metricCard, { backgroundColor: st.surfaceContainer }]}>
              <View style={styles.metricHeader}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: st.onSurfaceVariant }}>Completion</Text>
                <View style={[styles.metricIconWrap, { backgroundColor: st.surfaceContainerHigh }]}>
                  <MaterialIcons name="emoji-events" size={18} color={st.primaryFixedDim} />
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
                <Text style={{ fontSize: 22, fontWeight: '700', color: st.onSurface }}>100</Text>
                <Text style={{ fontSize: 12, fontWeight: '600', color: st.primaryFixedDim }}>%</Text>
              </View>
              <Text style={{ fontSize: 10, fontWeight: '700', color: st.outline, marginTop: 4 }}>Goal completed</Text>
            </View>
          </View>
        </View>

        {/* Speaking Performance */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionTitleRow}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: st.onSurface }}>Your speaking performance</Text>
            <MaterialIcons name="insights" size={20} color={st.primary} />
          </View>

          <View style={[styles.cadenceCard, { backgroundColor: st.surfaceContainer }]}>
            <View style={styles.cadenceHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={[styles.iconCircle, { backgroundColor: isSystemDark ? 'rgba(76,215,246,0.1)' : 'rgba(6,182,212,0.1)' }]}>
                  <MaterialIcons name="speed" size={16} color={st.primary} />
                </View>
                <Text style={{ fontSize: 14, fontWeight: '600', color: st.onSurface }}>Natural Cadence</Text>
              </View>
              <Text style={{ fontSize: 18, fontWeight: '700', color: st.primary }}>88%</Text>
            </View>
            <View style={[styles.cadenceTrack, { backgroundColor: st.surfaceContainerLowest }]}>
              <LinearGradient colors={[st.primary, st.secondary]} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={[styles.cadenceFill, { width: '88%' }]} />
            </View>
            <View style={styles.cadenceLabels}>
              <Text style={{ fontSize: 10, fontWeight: '700', color: st.outline }}>Hesitant</Text>
              <Text style={{ fontSize: 10, fontWeight: '700', color: st.primary }}>Conversational Flow</Text>
              <Text style={{ fontSize: 10, fontWeight: '700', color: st.outline }}>Native</Text>
            </View>
          </View>

          <View style={[styles.obsCard, { backgroundColor: st.surfaceContainer }]}>
            <View style={[styles.obsIconWrap, { backgroundColor: isSystemDark ? 'rgba(76,215,246,0.2)' : 'rgba(6,182,212,0.1)' }]}>
              <MaterialIcons name="task-alt" size={20} color={st.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: st.primary, marginBottom: 2 }}>Strong Natural Response</Text>
              <Text style={{ fontSize: 15, color: st.onSurface, lineHeight: 24 }}>You communicated your ideas clearly and asked follow-up questions naturally throughout the dialog.</Text>
            </View>
          </View>

          <View style={[styles.obsCard, { backgroundColor: st.surfaceContainer }]}>
            <View style={[styles.obsIconWrap, { backgroundColor: isSystemDark ? 'rgba(250,134,87,0.3)' : 'rgba(225,29,72,0.1)' }]}>
              <MaterialIcons name="lightbulb" size={20} color={st.tertiary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: st.tertiary, marginBottom: 2 }}>Politeness Nuance</Text>
              <Text style={{ fontSize: 15, color: st.onSurface, lineHeight: 24 }}>
                Next, practice using polite expressions (<Text style={{ fontWeight: '600', color: st.primary }}>"I'd like"</Text> instead of "I want") in hospitality situations.
              </Text>
            </View>
          </View>
        </View>

        {/* Grammar to Remember */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionTitleRow}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: st.onSurface }}>Grammar to remember</Text>
            <Text style={{ fontSize: 12, fontWeight: '600', color: st.onSurfaceVariant }}>1 correction</Text>
          </View>
          
          <View style={[styles.grammarCard, { backgroundColor: st.surfaceContainer }]}>
            <View style={[styles.grammarBlock, { backgroundColor: st.surfaceContainerLow }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <View style={[styles.dot, { backgroundColor: st.error }]} />
                <Text style={{ fontSize: 10, fontWeight: '700', color: st.error, textTransform: 'uppercase' }}>What you said</Text>
              </View>
              <Text style={{ fontSize: 15, color: st.onSurfaceVariant, textDecorationLine: 'line-through', textDecorationColor: st.error }}>
                "She go to school every morning."
              </Text>
            </View>

            <View style={[styles.grammarBlock, { backgroundColor: st.surfaceContainerHigh }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <View style={[styles.dot, { backgroundColor: st.primary }]} />
                <Text style={{ fontSize: 10, fontWeight: '700', color: st.primary, textTransform: 'uppercase' }}>Recommended phrase</Text>
              </View>
              <Text style={{ fontSize: 15, fontWeight: '600', color: st.onSurface }}>
                "She <Text style={{ color: st.primary, textDecorationLine: 'underline' }}>goes</Text> to school every morning."
              </Text>
            </View>

            <View style={styles.grammarTip}>
              <MaterialIcons name="info" size={18} color={st.secondary} style={{ marginTop: 2 }} />
              <Text style={{ fontSize: 13, color: st.onSurfaceVariant, flex: 1, lineHeight: 20 }}>
                Use 'goes' with he, she, and it in the present simple tense (3rd person singular agreement).
              </Text>
            </View>

            <TouchableOpacity style={[styles.reviewBtn, { backgroundColor: st.surfaceContainerHighest }]}>
              <MaterialIcons name="spellcheck" size={18} color={st.secondary} />
              <Text style={{ fontSize: 14, fontWeight: '600', color: st.onSurface, marginLeft: 8 }}>Review Grammar Rules</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Words you learned */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionTitleRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: st.onSurface }}>Words you learned</Text>
              <View style={[styles.wordBadge, { backgroundColor: st.surfaceContainerHighest }]}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: st.primary }}>3 Words</Text>
              </View>
            </View>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: st.primary }}>View All</Text>
              <MaterialIcons name="arrow-forward" size={14} color={st.primary} />
            </TouchableOpacity>
          </View>

          {[
            { word: 'reservation', type: 'noun', pron: '/ˌrez.ɚˈveɪ.ʃən/', def: 'An arrangement to secure a table in advance', icon: 'bookmark', color: st.primary },
            { word: 'recommend', type: 'verb', pron: '/ˌrek.əˈmend/', def: 'To suggest something as good or suitable', icon: 'thumb-up', color: st.secondary },
            { word: 'delicious', type: 'adj', pron: '/dɪˈlɪʃ.əs/', def: 'Highly pleasant to the taste or senses', icon: 'restaurant', color: st.tertiary },
          ].map((item, idx) => (
            <View key={idx} style={[styles.vocabCard, { backgroundColor: st.surfaceContainer }]}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 16, flex: 1 }}>
                <View style={[styles.vocabIcon, { backgroundColor: st.surfaceContainerHigh }]}>
                  <MaterialIcons name={item.icon as any} size={20} color={item.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: st.onSurface }}>{item.word}</Text>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: st.outline }}>{item.type}</Text>
                  </View>
                  <Text style={{ fontSize: 13, color: st.secondary, marginTop: 2 }}>{item.pron}</Text>
                  <Text style={{ fontSize: 13, color: st.onSurfaceVariant, marginTop: 4 }} numberOfLines={1}>{item.def}</Text>
                </View>
              </View>
              <TouchableOpacity style={[styles.listenBtn, { backgroundColor: st.surfaceContainerHigh }]}>
                <MaterialIcons name="volume-up" size={18} color={st.onSurface} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Recommended Next Step */}
        <View style={styles.roleplayWrap}>
          <LinearGradient
            colors={[st.surfaceContainerHigh, st.surfaceContainer]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.roleplayGradient}
          >
            <View style={[styles.roleplayGlow, { backgroundColor: isSystemDark ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.1)' }]} />
            
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <MaterialIcons name="explore" size={20} color={st.secondary} />
                <Text style={{ fontSize: 10, fontWeight: '700', color: st.secondary, textTransform: 'uppercase', letterSpacing: 1 }}>Recommended Next Step</Text>
              </View>
              <View style={[styles.durationBadge, { backgroundColor: st.surfaceContainerLowest }]}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: st.onSurfaceVariant }}>5 mins</Text>
              </View>
            </View>
            
            <Text style={{ fontSize: 18, fontWeight: '700', color: st.onSurface, marginBottom: 8 }}>Roleplay: Ordering dinner & drinks at a Madrid Bistro</Text>
            <Text style={{ fontSize: 15, color: st.onSurfaceVariant, lineHeight: 24, marginBottom: 16 }}>
              Reinforce polite phrasing ("I'd like...") and food vocabulary in an authentic restaurant scenario.
            </Text>
            
            <TouchableOpacity activeOpacity={0.8}>
              <LinearGradient 
                colors={[st.primary, st.secondary]} 
                start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                style={styles.startBtn}
              >
                <MaterialIcons name="play-arrow" size={20} color={st.surfaceContainerLowest} />
                <Text style={{ fontSize: 14, fontWeight: '700', color: st.surfaceContainerLowest, marginLeft: 8 }}>Start Roleplay Practice</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity activeOpacity={0.8}>
            <LinearGradient 
              colors={[st.primaryContainer, st.primary, st.secondary]} 
              start={{x: 0, y: 0}} end={{x: 1, y: 0}}
              style={styles.continueBtn}
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: st.surfaceContainerLowest }}>Continue Learning Path</Text>
              <MaterialIcons name="arrow-forward" size={20} color={st.surfaceContainerLowest} style={{ marginLeft: 8 }} />
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.backBtn}
            onPress={() => router.navigate('/(tabs)/' as never)}
          >
            <MaterialIcons name="dashboard" size={18} color={st.onSurfaceVariant} />
            <Text style={{ fontSize: 14, fontWeight: '600', color: st.onSurfaceVariant, marginLeft: 6 }}>Back to Dashboard</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
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
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 24,
  },
  heroCard: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  heroGradient: {
    padding: 24,
    position: 'relative',
  },
  glow1: {
    position: 'absolute',
    top: -64,
    right: -64,
    width: 176,
    height: 176,
    borderRadius: 88,
  },
  glow2: {
    position: 'absolute',
    bottom: -64,
    left: -64,
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  orbBadgeWrap: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  orbBadgeGlow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 40,
    opacity: 0.3,
  },
  orbBadgeInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbBadgeIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbDeco1: { position: 'absolute', top: -4, right: -4 },
  orbDeco2: { position: 'absolute', bottom: -4, left: -4 },
  levelChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  sectionWrap: {
    gap: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metricCard: {
    width: '48.5%',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metricIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cadenceCard: {
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  cadenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cadenceTrack: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 4,
  },
  cadenceFill: {
    height: '100%',
    borderRadius: 5,
  },
  cadenceLabels: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  obsCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    padding: 16,
    borderRadius: 12,
  },
  obsIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  grammarCard: {
    padding: 16,
    borderRadius: 12,
    gap: 16,
  },
  grammarBlock: {
    padding: 8,
    borderRadius: 8,
  },
  grammarTip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 4,
  },
  reviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  wordBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  vocabCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
  },
  vocabIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listenBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleplayWrap: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  roleplayGradient: {
    padding: 16,
    position: 'relative',
  },
  roleplayGlow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 112,
    height: 112,
    borderRadius: 56,
  },
  durationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  bottomActions: {
    gap: 8,
    marginTop: 4,
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  }
});
