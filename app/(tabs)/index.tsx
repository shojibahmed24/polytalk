import React, { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { View, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Image } from 'react-native';
import { router } from 'expo-router';

import { Text } from '@/components/ui';

import { ThemeContext } from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getTargetLanguage } from '@/utils/languageStorage';
import { useTranslation } from '@/utils/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PuterBillingNoticeModal } from '@/components/PuterBillingNoticeModal';

import { TARGET_LANGUAGES } from '@/constants/languages';
import Svg, { Path, Circle } from 'react-native-svg';



export default function HomeScreen() {
  const { isDark: isSystemDark } = React.useContext(ThemeContext);
  const [selectedTarget, setSelectedTarget] = useState('es');
  const [puterNoticeVisible, setPuterNoticeVisible] = useState(false);
  const [puterNoticeUsername, setPuterNoticeUsername] = useState('Puter User');
  const { t } = useTranslation();

  useFocusEffect(
    useCallback(() => {
      getTargetLanguage().then(setSelectedTarget);

      // Check if user should be shown the Puter connected notice
      AsyncStorage.getItem('@polytalk_show_puter_connected_notice').then((val) => {
        if (val) {
          try {
            const data = JSON.parse(val);
            if (data && data.shown === false) {
              setPuterNoticeUsername(data.username || 'Puter User');
              setPuterNoticeVisible(true);
              AsyncStorage.setItem(
                '@polytalk_show_puter_connected_notice',
                JSON.stringify({ ...data, shown: true })
              );
            }
          } catch {}
        }
      });
    }, [])
  );
  
  const activeLang = TARGET_LANGUAGES.find(l => l.id === selectedTarget) || TARGET_LANGUAGES[0];

  

  // Stitch Color Tokens Mapping
  const st = {
    surface: isSystemDark ? '#0E1320' : '#FFFFFF',
    surfaceContainerLowest: isSystemDark ? '#090E1B' : '#FFFFFF',
    surfaceContainerLow: isSystemDark ? '#161B29' : '#F9FAFB',
    surfaceContainer: isSystemDark ? '#1A1F2D' : '#F3F4F6',
    surfaceContainerHigh: isSystemDark ? '#252A38' : '#E5E7EB',
    surfaceContainerHighest: isSystemDark ? '#303443' : '#D1D5DB',
    onSurface: isSystemDark ? '#DEE2F5' : '#111827',
    onSurfaceVariant: isSystemDark ? '#BCC9CD' : '#6B7280',
    primary: isSystemDark ? '#4CD7F6' : '#06B6D4',
    secondary: isSystemDark ? '#D0BCFF' : '#8B5CF6',
    tertiary: isSystemDark ? '#FFB599' : '#F97316',
    tertiaryContainer: isSystemDark ? '#FA8657' : '#FFEDD5',
  };

  const handleStartConversation = () => {
    router.push({ pathname: '/(app)/chat/[id]', params: { id: activeLang.englishName.toLowerCase() } } as never);
  };

  const handleGrammar = () => {
    router.push('/(app)/grammar' as never);
  };
  
  const handleProfile = () => {
    router.push('/(tabs)/profile');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: st.surface }}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Section 1: Compact Top Greeting & Profile Header */}
        <View style={styles.headerSection}>
          <View style={styles.greetingCol}>
            <Text variant="bodySmall" weight="medium" style={{ color: st.onSurfaceVariant }}>{t('good_morning')}</Text>
            <Text style={{ fontSize: 28, fontWeight: '700', color: st.onSurface, marginTop: -2, letterSpacing: -0.5 }}>Shojib</Text>
            <Text variant="bodySmall" style={{ color: st.onSurfaceVariant, marginTop: 4, marginBottom: 8 }}>{t('ready_for_conversation')}</Text>
            
            <TouchableOpacity 
              activeOpacity={0.8} 
              onPress={() => router.push('/(app)/languages' as never)}
              style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', backgroundColor: st.surfaceContainerHigh, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 4 }}
            >
              <Text style={{ fontSize: 12 }}>{activeLang.flag}</Text>
              <Text variant="label" style={{ color: st.onSurface, fontSize: 12, fontWeight: '600' }}>{activeLang.englishName}</Text>
              <MaterialIcons name="edit" size={12} color={st.onSurfaceVariant} style={{ marginLeft: 2 }} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.headerRight}>
            {/* Notification Bell */}
            <TouchableOpacity activeOpacity={0.7} style={[styles.notifBtn, { backgroundColor: st.surfaceContainer }]}>
              <MaterialIcons name="notifications-none" size={20} color={st.onSurfaceVariant} />
              <View style={[styles.notifBadge, { backgroundColor: st.tertiaryContainer }]} />
            </TouchableOpacity>
            
            {/* Profile Avatar */}
            <TouchableOpacity activeOpacity={0.8} onPress={handleProfile}>
              <LinearGradient
                colors={[st.primary, st.secondary]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={styles.avatarBorder}
              >
                <View style={[styles.avatarInner, { backgroundColor: st.surfaceContainerHigh }]}>
                  {/* Using a placeholder avatar since local asset might not exist */}
                  <Image 
                    source={{ uri: 'https://i.pravatar.cc/150?img=11' }} 
                    style={styles.avatarImg} 
                  />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section 2: Signature AI Coach Card */}
        <View style={[styles.heroCard, { backgroundColor: st.surfaceContainerLow, overflow: 'hidden' }]}>
          {/* Ambient Glows */}
          <View style={[styles.heroGlow1, { backgroundColor: st.primary, opacity: isSystemDark ? 0.15 : 0.08 }]} />
          <View style={[styles.heroGlow2, { backgroundColor: st.secondary, opacity: isSystemDark ? 0.25 : 0.1 }]} />
          
          {/* Top Pill */}
          <View style={styles.heroTop}>
            <View style={[styles.aiCoachPill, { backgroundColor: st.surfaceContainerHigh }]}>
              <View style={[styles.pulseDot, { backgroundColor: st.primary }]} />
              <Text variant="caption" weight="bold" style={{ color: st.primary, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 10 }}>Your AI Coach</Text>
            </View>
            <View style={styles.onlineStatus}>
              <View style={[styles.onlineDot, { backgroundColor: st.primary }]} />
              <Text variant="label" weight="medium" style={{ color: st.onSurfaceVariant, fontSize: 12 }}>Online</Text>
            </View>
          </View>

          {/* Main Content */}
          <View style={styles.heroMain}>
            <View style={styles.heroTextCol}>
              <Text style={{ fontSize: 24, fontWeight: '700', color: st.onSurface, letterSpacing: -0.5 }}>Ready to speak?</Text>
              <Text variant="bodySmall" style={{ color: st.onSurfaceVariant, marginTop: 6, lineHeight: 20 }}>
                Practice real conversations and build confidence, one gentle session at a time.
              </Text>
            </View>
            
            {/* AI Voice Sphere */}
            <View style={styles.voiceSphereWrap}>
              <View style={[styles.voiceSphereGlow, { backgroundColor: st.primary }]} />
              <View style={[styles.voiceSphereInner, { backgroundColor: st.surfaceContainerLowest }]}>
                <Svg width="40" height="40" viewBox="0 0 48 48" fill="none">
                  <Circle cx="24" cy="24" r="18" stroke={st.primary} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                  <Circle cx="24" cy="24" r="12" stroke={st.secondary} strokeWidth="2" />
                  <Path d="M19 24C19 21.2386 21.2386 19 24 19C26.7614 19 29 21.2386 29 24V25C29 27.7614 26.7614 30 24 30C21.2386 30 19 27.7614 19 25V24Z" fill={st.primary} opacity="0.8" />
                  <Path d="M24 33V36M20 36H28" stroke={st.primary} strokeWidth="2" strokeLinecap="round" />
                </Svg>
              </View>
            </View>
          </View>

          {/* CTA */}
          <TouchableOpacity activeOpacity={0.8} onPress={handleStartConversation} style={{ marginTop: 24 }}>
            <LinearGradient
              colors={[st.primary, st.secondary]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.heroBtn}
            >
              <Text variant="body" weight="bold" style={{ color: '#FFFFFF' }}>Start a Conversation</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Section 3: Daily Learning Progress */}
        <View style={styles.sectionHeader}>
          <Text variant="title" weight="bold" style={{ color: st.onSurface }}>Your Progress</Text>
          <TouchableOpacity>
            <Text variant="label" weight="bold" style={{ color: st.primary }}>View details</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.progressCard, { backgroundColor: st.surfaceContainer }]}>
          <View style={styles.progressRow}>
            <View style={styles.progressLeft}>
              {/* Circular SVG Ring */}
              <View style={styles.progressRingWrap}>
                <Svg width="48" height="48" viewBox="0 0 36 36" style={{ transform: [{ rotate: '-90deg' }] }}>
                  <Path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={st.surfaceContainerHighest} strokeWidth="3.5" />
                  <Path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={st.primary} strokeWidth="3.5" strokeLinecap="round" strokeDasharray="53, 100" />
                </Svg>
                <View style={styles.progressPctWrap}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: st.onSurface }}>53%</Text>
                </View>
              </View>
              <View>
                <Text variant="label" weight="bold" style={{ color: st.onSurface, fontSize: 14 }}>15 min daily goal</Text>
                <Text variant="bodySmall" style={{ color: st.onSurfaceVariant, fontSize: 12 }}>8 of 15 min completed</Text>
              </View>
            </View>

            {/* Streak Badge */}
            <View style={[styles.streakBadge, { backgroundColor: isSystemDark ? 'rgba(250,134,87,0.15)' : '#FFEDD5' }]}>
              <MaterialIcons name="local-fire-department" size={16} color={st.tertiaryContainer} />
              <Text style={{ fontSize: 11, fontWeight: '700', color: st.tertiary, marginLeft: 4 }}>3-day streak</Text>
            </View>
          </View>
          
          {/* Linear Bar */}
          <View style={[styles.linearBarBg, { backgroundColor: st.surfaceContainerHighest }]}>
            <LinearGradient colors={[st.primary, st.secondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.linearBarFill, { width: '53%' }]} />
          </View>
        </View>

        {/* Section 4: Practice Modes (Vertical List) */}
        <View style={styles.sectionHeader}>
          <Text variant="title" weight="bold" style={{ color: st.onSurface }}>Choose Your Practice</Text>
          <Text variant="caption" weight="bold" style={{ color: st.onSurfaceVariant, textTransform: 'uppercase' }}>3 Modes</Text>
        </View>

        <View style={styles.modesList}>
          {/* Mode 1 */}
          <TouchableOpacity activeOpacity={0.8} onPress={handleStartConversation} style={[styles.modeCard, { backgroundColor: st.surfaceContainer }]}>
            <View style={styles.modeCardLeft}>
              <View style={[styles.modeIconWrap, { backgroundColor: isSystemDark ? 'rgba(76,215,246,0.1)' : '#E0F2FE' }]}>
                <MaterialIcons name="forum" size={24} color={st.primary} />
              </View>
              <View style={styles.modeTextCol}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text variant="label" weight="bold" style={{ color: st.onSurface, fontSize: 15 }}>AI Conversation</Text>
                  <View style={[styles.modeTag, { backgroundColor: st.surfaceContainerHighest }]}>
                    <Text style={{ fontSize: 9, fontWeight: '700', color: st.primary, textTransform: 'uppercase' }}>Interactive</Text>
                  </View>
                </View>
                <Text variant="bodySmall" style={{ color: st.onSurfaceVariant, marginTop: 2 }}>Speak naturally with your AI coach.</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={st.onSurfaceVariant} />
          </TouchableOpacity>

          {/* Mode 2 */}
          <TouchableOpacity activeOpacity={0.8} style={[styles.modeCard, { backgroundColor: st.surfaceContainer }]}>
            <View style={styles.modeCardLeft}>
              <View style={[styles.modeIconWrap, { backgroundColor: isSystemDark ? 'rgba(208,188,255,0.15)' : '#F3E8FF' }]}>
                <MaterialIcons name="graphic-eq" size={24} color={st.secondary} />
              </View>
              <View style={styles.modeTextCol}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text variant="label" weight="bold" style={{ color: st.onSurface, fontSize: 15 }}>Pronunciation</Text>
                </View>
                <Text variant="bodySmall" style={{ color: st.onSurfaceVariant, marginTop: 2 }}>Sound clearer and more confident.</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={st.onSurfaceVariant} />
          </TouchableOpacity>

          {/* Mode 3 */}
          <TouchableOpacity activeOpacity={0.8} onPress={handleGrammar} style={[styles.modeCard, { backgroundColor: st.surfaceContainer }]}>
            <View style={styles.modeCardLeft}>
              <View style={[styles.modeIconWrap, { backgroundColor: isSystemDark ? 'rgba(255,181,153,0.15)' : '#FFEDD5' }]}>
                <MaterialIcons name="school" size={24} color={st.tertiary} />
              </View>
              <View style={styles.modeTextCol}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text variant="label" weight="bold" style={{ color: st.onSurface, fontSize: 15 }}>Grammar & Vocab</Text>
                </View>
                <Text variant="bodySmall" style={{ color: st.onSurfaceVariant, marginTop: 2 }}>Expand your language foundation.</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={st.onSurfaceVariant} />
          </TouchableOpacity>
        </View>

      </ScrollView>
      <PuterBillingNoticeModal
        visible={puterNoticeVisible}
        username={puterNoticeUsername}
        onDismiss={() => setPuterNoticeVisible(false)}
        isDark={isSystemDark}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100, // accommodate bottom nav
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  greetingCol: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  avatarBorder: {
    padding: 2,
    borderRadius: 22,
  },
  avatarInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  heroCard: {
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  heroGlow1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    transform: [{ scale: 2 }],
  },
  heroGlow2: {
    position: 'absolute',
    bottom: -40,
    left: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    transform: [{ scale: 2 }],
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  aiCoachPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  heroMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    zIndex: 10,
  },
  heroTextCol: {
    flex: 1,
    paddingRight: 16,
  },
  voiceSphereWrap: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceSphereGlow: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    opacity: 0.2,
  },
  voiceSphereInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  heroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 26,
    zIndex: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 32,
    marginBottom: 16,
  },
  progressCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  progressLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressRingWrap: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPctWrap: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  linearBarBg: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  linearBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  modesList: {
    flexDirection: 'column',
    gap: 12,
  },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  modeCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  modeIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeTextCol: {
    flex: 1,
    paddingRight: 8,
  },
  modeTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  }
});



