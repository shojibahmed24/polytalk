import React from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Platform,
  Image,
  SafeAreaView
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Text } from '@/components/ui';
import { ThemeContext } from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getCurrentUserProfile, UserProfileData } from '@/utils/userProfile';
import { supabase } from '@/utils/supabase';
import { clearPuterToken } from '@/services/puter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTargetLanguage, getInterfaceLanguage } from '@/utils/languageStorage';
import { TARGET_LANGUAGES } from '@/constants/languages';

export default function ProfileScreen() {
  const { isDark: isSystemDark } = React.useContext(ThemeContext);
  const [profile, setProfile] = React.useState<UserProfileData | null>(null);
  const [targetLangId, setTargetLangId] = React.useState('es');
  const [interfaceLang, setInterfaceLang] = React.useState('English (US)');

  useFocusEffect(
    React.useCallback(() => {
      getCurrentUserProfile().then(setProfile);
      getTargetLanguage().then(setTargetLangId);
      getInterfaceLanguage().then(setInterfaceLang);
    }, [])
  );

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    await clearPuterToken();
    await AsyncStorage.removeItem('@polytalk_current_user_profile');
    router.replace('/(auth)/login');
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
    primaryFixedDim: isSystemDark ? '#4CD7F6' : '#06B6D4',
    secondary: isSystemDark ? '#D0BCFF' : '#8B5CF6',
    secondaryContainer: isSystemDark ? '#4A3382' : '#EDE9FE',
    tertiary: isSystemDark ? '#FFB599' : '#E11D48',
    tertiaryContainer: isSystemDark ? '#FA8657' : '#FFE4E6',
    outline: isSystemDark ? '#869397' : '#9CA3AF',
    divider: isSystemDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: st.surface }}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isSystemDark ? 'rgba(14,19,32,0.85)' : 'rgba(248,249,252,0.85)' }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={[styles.headerIconWrap, { backgroundColor: st.surfaceContainerHigh }]}>
              <MaterialIcons name="translate" size={20} color={st.primary} />
            </View>
            <Text style={{ fontSize: 18, fontWeight: '700', color: st.onSurface, letterSpacing: -0.5, marginLeft: 12 }}>User Profile</Text>
          </View>
          
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => router.push('/(app)/settings' as never)} style={styles.iconBtn}>
              <MaterialIcons name="settings" size={24} color={st.onSurfaceVariant} />
            </TouchableOpacity>
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
        {/* Top Profile Identity Module */}
        <View style={[styles.identityCard, { backgroundColor: st.surfaceContainerLow }]}>
          <View style={[styles.glowTop, { backgroundColor: isSystemDark ? 'rgba(76,215,246,0.1)' : 'rgba(6,182,212,0.05)' }]} />
          <View style={[styles.glowBottom, { backgroundColor: isSystemDark ? 'rgba(74,51,130,0.2)' : 'rgba(139,92,246,0.1)' }]} />
          
          <View style={{ alignItems: 'center', zIndex: 2 }}>
            <View style={styles.avatarWrap}>
              <LinearGradient colors={[st.primary, st.secondary]} style={styles.avatarGradient}>
                <View style={[styles.avatarInner, { backgroundColor: st.surfaceContainerHigh, overflow: 'hidden' }]}>
                  {profile?.avatarUrl ? (
                    <Image source={{ uri: profile.avatarUrl }} style={{ width: '100%', height: '100%' }} />
                  ) : (
                    <MaterialIcons name="person" size={48} color={st.onSurfaceVariant} style={{ marginTop: 12 }} />
                  )}
                </View>
              </LinearGradient>
              <View style={[styles.statusIndicator, { backgroundColor: st.surfaceContainerLow }]}>
                <View style={[styles.statusDot, { backgroundColor: st.primary }]} />
              </View>
            </View>

            <Text style={{ fontSize: 22, fontWeight: '700', color: st.onSurface, letterSpacing: -0.5 }}>
              {profile?.name || 'Alex Morgan'}
            </Text>
            <Text style={{ fontSize: 13, color: st.onSurfaceVariant, marginTop: 4, marginBottom: 12 }}>
              {profile?.email || 'alex.morgan@example.com'}
            </Text>

            <View style={[styles.proBadge, { backgroundColor: st.surfaceContainerHigh }]}>
              <MaterialIcons name={profile?.isPuterUser ? "auto-awesome" : "verified"} size={16} color={st.primary} />
              <Text style={{ fontSize: 10, fontWeight: '700', color: st.primary, textTransform: 'uppercase', letterSpacing: 0.5, marginLeft: 6 }}>
                {profile?.isPuterUser ? 'Puter AI Connected' : 'PolyTalk Member'}
              </Text>
            </View>

            <TouchableOpacity style={[styles.editBtn, { backgroundColor: st.surfaceContainerHigh }]}>
              <MaterialIcons name="edit" size={18} color={st.primary} />
              <Text style={{ fontSize: 14, fontWeight: '700', color: st.onSurface, marginLeft: 8 }}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Learning Overview Stats Grid */}
        <View style={styles.statsGrid}>
          {/* Stat 1 */}
          <View style={[styles.statCard, { backgroundColor: st.surfaceContainerLow }]}>
            <View style={styles.statHeader}>
              <Text style={{ fontSize: 10, fontWeight: '700', color: st.onSurfaceVariant, textTransform: 'uppercase' }}>Streak</Text>
              <View style={[styles.statIconWrap, { backgroundColor: isSystemDark ? 'rgba(250,134,87,0.2)' : 'rgba(225,29,72,0.1)' }]}>
                <MaterialIcons name="local-fire-department" size={18} color={st.tertiary} />
              </View>
            </View>
            <View>
              <Text style={{ fontSize: 18, fontWeight: '700', color: st.onSurface }}>3-day</Text>
              <Text style={{ fontSize: 13, color: st.tertiary, marginTop: 2 }}>Active streak</Text>
            </View>
          </View>

          {/* Stat 2 */}
          <View style={[styles.statCard, { backgroundColor: st.surfaceContainerLow }]}>
            <View style={styles.statHeader}>
              <Text style={{ fontSize: 10, fontWeight: '700', color: st.onSurfaceVariant, textTransform: 'uppercase' }}>Time</Text>
              <View style={[styles.statIconWrap, { backgroundColor: isSystemDark ? 'rgba(76,215,246,0.2)' : 'rgba(6,182,212,0.1)' }]}>
                <MaterialIcons name="schedule" size={18} color={st.primary} />
              </View>
            </View>
            <View>
              <Text style={{ fontSize: 18, fontWeight: '700', color: st.onSurface }}>4.5 hrs</Text>
              <Text style={{ fontSize: 13, color: st.onSurfaceVariant, marginTop: 2 }}>Speaking practice</Text>
            </View>
          </View>

          {/* Stat 3 */}
          <View style={[styles.statCard, { backgroundColor: st.surfaceContainerLow }]}>
            <View style={styles.statHeader}>
              <Text style={{ fontSize: 10, fontWeight: '700', color: st.onSurfaceVariant, textTransform: 'uppercase' }}>Sessions</Text>
              <View style={[styles.statIconWrap, { backgroundColor: isSystemDark ? 'rgba(208,188,255,0.2)' : 'rgba(139,92,246,0.1)' }]}>
                <MaterialIcons name="forum" size={18} color={st.secondary} />
              </View>
            </View>
            <View>
              <Text style={{ fontSize: 18, fontWeight: '700', color: st.onSurface }}>24</Text>
              <Text style={{ fontSize: 13, color: st.onSurfaceVariant, marginTop: 2 }}>Completed turns</Text>
            </View>
          </View>

          {/* Stat 4 */}
          <View style={[styles.statCard, { backgroundColor: st.surfaceContainerLow }]}>
            <View style={styles.statHeader}>
              <Text style={{ fontSize: 10, fontWeight: '700', color: st.onSurfaceVariant, textTransform: 'uppercase' }}>Lexicon</Text>
              <View style={[styles.statIconWrap, { backgroundColor: isSystemDark ? 'rgba(76,215,246,0.2)' : 'rgba(6,182,212,0.1)' }]}>
                <MaterialIcons name="auto-awesome" size={18} color={st.primaryFixedDim} />
              </View>
            </View>
            <View>
              <Text style={{ fontSize: 18, fontWeight: '700', color: st.onSurface }}>86</Text>
              <Text style={{ fontSize: 13, color: st.onSurfaceVariant, marginTop: 2 }}>Words mastered</Text>
            </View>
          </View>
        </View>

        {/* Weekly Learning Goal */}
        <View style={[styles.goalCard, { backgroundColor: st.surfaceContainerLow }]}>
          <View style={styles.goalHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <MaterialIcons name="flag" size={20} color={st.primary} />
              <Text style={{ fontSize: 18, fontWeight: '700', color: st.onSurface }}>Weekly Goal</Text>
            </View>
            <View style={[styles.goalPercentBadge, { backgroundColor: isSystemDark ? 'rgba(76,215,246,0.1)' : 'rgba(6,182,212,0.1)' }]}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: st.primary }}>50%</Text>
            </View>
          </View>

          <View style={[styles.goalTrack, { backgroundColor: st.surfaceContainerHighest }]}>
            <LinearGradient colors={[st.primary, st.secondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.goalFill, { width: '50%' }]} />
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: st.onSurface }}>60 mins completed</Text>
            <Text style={{ fontSize: 10, fontWeight: '700', color: st.onSurfaceVariant }}>120 mins target</Text>
          </View>
          <Text style={{ fontSize: 13, color: st.onSurfaceVariant }}>60 minutes left to hit your goal this week! Keep it up.</Text>
        </View>

        {/* My Languages */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionTitleRow}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: st.onSurface }}>My Languages</Text>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }} onPress={() => router.push('/(app)/languages')}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: st.primary }}>Manage</Text>
              <MaterialIcons name="chevron-right" size={16} color={st.primary} />
            </TouchableOpacity>
          </View>

          {/* Active Target Language */}
          {(() => {
            const activeLang = TARGET_LANGUAGES.find(l => l.id === targetLangId) || TARGET_LANGUAGES[0];
            return (
              <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/(app)/languages' as never)} style={[styles.langCard, { backgroundColor: st.surfaceContainerLow }]}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                  <View style={[styles.langIconWrap, { backgroundColor: st.surfaceContainerHigh }]}>
                    <Text style={{ fontSize: 18 }}>{activeLang.flag}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: st.onSurface }}>Learning {activeLang.name || activeLang.englishName}</Text>
                      <View style={[styles.activeBadge, { backgroundColor: isSystemDark ? 'rgba(76,215,246,0.15)' : 'rgba(6,182,212,0.1)' }]}>
                        <Text style={{ fontSize: 10, fontWeight: '700', color: st.primary }}>Active</Text>
                      </View>
                    </View>
                    <Text style={{ fontSize: 13, color: st.onSurfaceVariant, marginTop: 2 }}>{activeLang.englishName} • {activeLang.dialect || 'Standard'}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12, paddingTop: 8, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: st.divider }}>
                  <MaterialIcons name="work-outline" size={16} color={st.primary} />
                  <Text style={{ fontSize: 13, color: st.onSurfaceVariant }}>Goal: Speak confidently in {activeLang.name || activeLang.englishName}</Text>
                </View>
              </TouchableOpacity>
            );
          })()}

          {/* App Interface Language */}
          <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/(app)/languages' as never)} style={[styles.interfaceLangCard, { backgroundColor: st.surfaceContainerLow }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={[styles.interfaceLangIcon, { backgroundColor: st.surfaceContainerHigh }]}>
                <MaterialIcons name="translate" size={18} color={st.onSurfaceVariant} />
              </View>
              <View>
                <Text style={{ fontSize: 12, fontWeight: '700', color: st.onSurface }}>App Interface Language</Text>
                <Text style={{ fontSize: 13, color: st.onSurfaceVariant, marginTop: 2 }}>{interfaceLang}</Text>
              </View>
            </View>
            <MaterialIcons name="swap-horiz" size={20} color={st.onSurfaceVariant} />
          </TouchableOpacity>
        </View>

        {/* Achievements */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionTitleRow}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: st.onSurface }}>Achievements</Text>
            <Text style={{ fontSize: 10, fontWeight: '700', color: st.onSurfaceVariant }}>3 unlocked</Text>
          </View>

          <View style={{ gap: 8 }}>
            {[
              { title: 'First Conversation', desc: 'Completed 1st AI roleplay session', icon: 'smart-toy', color: st.primary },
              { title: '3-Day Streak', desc: 'Practiced 3 days in a row', icon: 'bolt', color: st.tertiary },
              { title: 'Vocabulary Explorer', desc: 'Saved 50+ new vocabulary words', icon: 'menu-book', color: st.secondary },
            ].map((achv, idx) => (
              <View key={idx} style={[styles.achvCard, { backgroundColor: st.surfaceContainerLow }]}>
                <View style={[styles.achvIconWrap, { backgroundColor: isSystemDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
                  <MaterialIcons name={achv.icon as any} size={20} color={achv.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: st.onSurface }}>{achv.title}</Text>
                  <Text style={{ fontSize: 13, color: st.onSurfaceVariant, marginTop: 2 }}>{achv.desc}</Text>
                </View>
                <MaterialIcons name="verified" size={18} color={st.primary} />
              </View>
            ))}
          </View>
        </View>

        {/* Preferences & Account Navigation */}
        <View style={styles.sectionWrap}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: st.onSurface, marginBottom: 8 }}>Preferences & Account</Text>
          <View style={{ gap: 6 }}>
            {[
              { title: 'Language Preferences', desc: 'Accent, speed, and targets', icon: 'language', color: st.primary, action: () => router.push('/(app)/languages') },
              { title: 'Learning Goals & Reminders', desc: 'Daily schedule and milestones', icon: 'alarm', color: st.secondary },
              { title: 'Notifications', desc: 'Push alerts, streak nudges', icon: 'notifications', color: st.primaryFixedDim },
              { title: 'Privacy & Security', desc: 'Microphone permissions & data', icon: 'shield', color: st.onSurfaceVariant },
            ].map((pref, idx) => (
              <TouchableOpacity key={idx} activeOpacity={0.8} style={[styles.prefCard, { backgroundColor: st.surfaceContainerLow }]} onPress={pref.action}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                  <View style={[styles.prefIconWrap, { backgroundColor: st.surfaceContainerHigh }]}>
                    <MaterialIcons name={pref.icon as any} size={20} color={pref.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: st.onSurface }}>{pref.title}</Text>
                    <Text style={{ fontSize: 13, color: st.onSurfaceVariant, marginTop: 2 }} numberOfLines={1}>{pref.desc}</Text>
                  </View>
                </View>
                <MaterialIcons name="chevron-right" size={20} color={st.onSurfaceVariant} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sign Out Button */}
        <View style={{ marginTop: 24, marginBottom: 12 }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSignOut}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 14,
              borderRadius: 12,
              backgroundColor: isSystemDark ? 'rgba(239, 68, 68, 0.12)' : '#FEE2E2',
              gap: 8,
            }}
          >
            <MaterialIcons name="logout" size={18} color="#EF4444" />
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#EF4444' }}>
              Sign Out
            </Text>
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
    paddingHorizontal: 20,
    height: 64,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  scrollContent: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 24,
  },
  identityCard: {
    borderRadius: 12,
    padding: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    position: 'relative',
  },
  glowTop: {
    position: 'absolute',
    top: -48,
    right: -48,
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  glowBottom: {
    position: 'absolute',
    bottom: -40,
    left: -40,
    width: 144,
    height: 144,
    borderRadius: 72,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    padding: 2,
  },
  avatarInner: {
    flex: 1,
    borderRadius: 40,
    overflow: 'hidden',
    alignItems: 'center',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 16,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 10,
    borderRadius: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    justifyContent: 'space-between',
    minHeight: 110,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalCard: {
    padding: 16,
    borderRadius: 12,
  },
  goalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  goalPercentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  goalTrack: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  goalFill: {
    height: '100%',
    borderRadius: 5,
  },
  sectionWrap: {
    gap: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  langCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 4,
  },
  langIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  interfaceLangCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  interfaceLangIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achvCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  achvIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prefCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
  },
  prefIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
