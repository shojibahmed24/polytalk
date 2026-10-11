import React from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Platform,
  Switch,
  SafeAreaView
} from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/components/ui';
import { ThemeContext } from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '@/utils/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PuterConnectModal } from '@/components/PuterConnectModal';
import { PuterBillingNoticeModal } from '@/components/PuterBillingNoticeModal';
import { getCurrentUserProfile, UserProfileData } from '@/utils/userProfile';
import { 
  getStoredPuterToken, 
  verifyPuterToken, 
  disconnectPuter, 
  clearPuterToken,
  PuterProfile 
} from '@/services/puter';

export default function SettingsScreen() {
  const { isDark: isSystemDark } = React.useContext(ThemeContext);
  
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);
  const [userProfile, setUserProfile] = React.useState<UserProfileData | null>(null);
  const [isPuterConnected, setIsPuterConnected] = React.useState(false);
  const [puterProfile, setPuterProfile] = React.useState<PuterProfile | null>(null);
  const [isPuterModalOpen, setIsPuterModalOpen] = React.useState(false);
  const [showBillingNotice, setShowBillingNotice] = React.useState(false);

  React.useEffect(() => {
    async function loadData() {
      try {
        const uProfile = await getCurrentUserProfile();
        setUserProfile(uProfile);

        const { data: { user } } = await supabase.auth.getUser();
        const uid = user?.id || null;
        setCurrentUserId(uid);
        const token = await getStoredPuterToken(uid);
        if (token) {
          const profile = await verifyPuterToken(token);
          if (profile) {
            setPuterProfile(profile);
            setIsPuterConnected(true);
          } else {
            setIsPuterConnected(false);
          }
        }
      } catch (err) {
        console.warn('Failed to check Puter auth:', err);
      }
    }
    loadData();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    await clearPuterToken();
    await AsyncStorage.removeItem('@polytalk_current_user_profile');
    router.replace('/(auth)/login');
  };

  const handleDisconnectPuter = async () => {
    await disconnectPuter(currentUserId);
    setIsPuterConnected(false);
    setPuterProfile(null);
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
    secondary: isSystemDark ? '#D0BCFF' : '#8B5CF6',
    secondaryContainer: isSystemDark ? '#4A3382' : '#EDE9FE',
    tertiaryContainer: isSystemDark ? '#FA8657' : '#FFE4E6',
    error: isSystemDark ? '#FFB4AB' : '#EF4444',
    errorContainer: isSystemDark ? '#93000A' : '#FEE2E2',
    divider: isSystemDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
  };

  const [theme, setTheme] = React.useState('dark');
  const [playbackSpeed, setPlaybackSpeed] = React.useState('1.0x');
  const [notifDaily, setNotifDaily] = React.useState(true);
  const [notifStreak, setNotifStreak] = React.useState(true);
  const [notifWeekly, setNotifWeekly] = React.useState(true);
  const [autoPlay, setAutoPlay] = React.useState(true);
  const [noiseSuppression, setNoiseSuppression] = React.useState(true);

  const renderSectionHeader = (icon: any, title: string, color: string = st.primary) => (
    <View style={styles.sectionHeaderRow}>
      <MaterialIcons name={icon} size={20} color={color} />
      <Text style={{ fontSize: 14, fontWeight: '700', color: st.onSurface, textTransform: 'uppercase', letterSpacing: 1 }}>{title}</Text>
    </View>
  );

  const renderRow = (icon: any, title: string, subtitle?: string, right?: React.ReactNode, onPress?: () => void, color: string = st.primary) => {
    const Component = onPress ? TouchableOpacity : View;
    return (
      <Component style={[styles.row, { backgroundColor: st.surfaceContainer }]} onPress={onPress} activeOpacity={0.8}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, flex: 1 }}>
          <View style={[styles.rowIconWrap, { backgroundColor: st.surfaceContainerHigh }]}>
            <MaterialIcons name={icon} size={20} color={color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, color: st.onSurface, fontWeight: subtitle ? '500' : '400' }}>{title}</Text>
            {subtitle && <Text style={{ fontSize: 13, color: st.onSurfaceVariant, marginTop: 2 }}>{subtitle}</Text>}
          </View>
        </View>
        {right}
      </Component>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: st.surface }}>
      <View style={[styles.header, { backgroundColor: isSystemDark ? 'rgba(14,19,32,0.85)' : 'rgba(248,249,252,0.85)' }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
              <MaterialIcons name="arrow-back" size={24} color={st.onSurface} />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: '700', color: st.onSurface, letterSpacing: -0.5, marginLeft: 4 }}>Settings</Text>
          </View>
          <View style={[styles.userAvatar, { backgroundColor: st.primary }]}>
            <MaterialIcons name="person" size={18} color={isSystemDark ? '#003640' : '#FFFFFF'} />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: 15, color: st.onSurfaceVariant, marginBottom: 8 }}>Make PolyTalk work for you</Text>
        
        {/* Profile Quick Banner */}
        <View style={[styles.bannerCard, { backgroundColor: st.surfaceContainer }]}>
          <View style={[styles.bannerGlow, { backgroundColor: isSystemDark ? 'rgba(76,215,246,0.1)' : 'rgba(6,182,212,0.1)' }]} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, zIndex: 2 }}>
            <View style={[styles.bannerAvatar, { backgroundColor: st.surfaceContainerHigh }]}>
              <MaterialIcons name="person" size={32} color={st.onSurfaceVariant} />
              <View style={[styles.avatarBadge, { backgroundColor: st.primary, borderColor: st.surfaceContainer }]} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: st.onSurface }}>{userProfile?.name || 'PolyTalk User'}</Text>
                <MaterialIcons name="verified" size={18} color={st.primary} />
              </View>
              <Text style={{ fontSize: 12, fontWeight: '600', color: st.primary, marginTop: 2 }}>
                {userProfile?.isPuterUser ? 'Puter AI Member' : 'PolyTalk Member'}
              </Text>
              <Text style={{ fontSize: 13, color: st.onSurfaceVariant, marginTop: 2 }}>{userProfile?.email || 'user@polytalk.app'}</Text>
            </View>
          </View>
        </View>

        {/* Section 1: Appearance */}
        <View style={styles.section}>
          {renderSectionHeader('palette', 'Appearance')}
          <View style={[styles.card, { backgroundColor: st.surfaceContainer }]}>
            <View style={[styles.themeSelector, { backgroundColor: st.surfaceContainerLowest }]}>
              {['system', 'light', 'dark'].map((t) => {
                const isActive = theme === t;
                const icon = t === 'system' ? 'brightness-auto' : t === 'light' ? 'light-mode' : 'dark-mode';
                const label = t.charAt(0).toUpperCase() + t.slice(1);
                return (
                  <TouchableOpacity 
                    key={t}
                    style={[styles.themeBtn, isActive && { backgroundColor: st.surfaceContainerHigh }]}
                    onPress={() => setTheme(t)}
                  >
                    <MaterialIcons name={icon} size={20} color={isActive ? st.primary : st.onSurfaceVariant} />
                    <Text style={{ fontSize: 12, fontWeight: isActive ? '700' : '400', color: isActive ? st.primary : st.onSurfaceVariant, marginTop: 4 }}>{label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Section 2: Language Preferences */}
        <View style={styles.section}>
          {renderSectionHeader('translate', 'Language')}
          <View style={[styles.cardList, { backgroundColor: st.surfaceContainerHigh }]}>
            {renderRow('language', 'App Interface Language', 'System defaults & navigation', (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 12, fontWeight: '600', color: st.primary }}>English (US)</Text>
                <MaterialIcons name="chevron-right" size={20} color={st.onSurfaceVariant} />
              </View>
            ), () => router.push('/(app)/languages'))}
            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: st.divider }} />
            {renderRow('school', 'Target Learning Language', 'Active speech & feedback', (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 12, fontWeight: '600', color: st.secondary }}>Spanish (Español)</Text>
                <MaterialIcons name="chevron-right" size={20} color={st.onSurfaceVariant} />
              </View>
            ), () => router.push('/(app)/languages'))}
          </View>
        </View>

        {/* Section: AI Provider (Puter) */}
        <View style={styles.section}>
          {renderSectionHeader('smart-toy', 'AI Provider (Puter)')}
          <View style={[styles.cardList, { backgroundColor: st.surfaceContainerHigh }]}>
            {isPuterConnected ? (
              <>
                {renderRow(
                  'check-circle',
                  `Connected as @${puterProfile?.username || 'user'}`,
                  'User-owned AI active (GPT-4o-mini via Puter)',
                  (
                    <TouchableOpacity 
                      onPress={handleDisconnectPuter}
                      style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, backgroundColor: 'rgba(239, 68, 68, 0.12)' }}
                    >
                      <Text style={{ fontSize: 12, fontWeight: '700', color: st.error }}>Disconnect</Text>
                    </TouchableOpacity>
                  ),
                  undefined,
                  '#10B981'
                )}
                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: st.divider }} />
                {renderRow(
                  'credit-card',
                  'AI Billing & Credits',
                  'Billed to your Puter account (Tap to view details)',
                  <MaterialIcons name="chevron-right" size={20} color={st.onSurfaceVariant} />,
                  () => setShowBillingNotice(true)
                )}
              </>
            ) : (
              renderRow(
                'cloud-queue',
                'Connect Puter Account',
                'Unlock real-time AI conversation and coaching',
                (
                  <TouchableOpacity 
                    onPress={() => setIsPuterModalOpen(true)}
                    style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8, backgroundColor: st.primary }}
                  >
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#003640' }}>Connect</Text>
                  </TouchableOpacity>
                ),
                () => setIsPuterModalOpen(true)
              )
            )}
          </View>
        </View>

        {/* Section 3: Learning Preferences */}
        <View style={styles.section}>
          {renderSectionHeader('psychology', 'Learning')}
          <View style={[styles.cardList, { backgroundColor: st.surfaceContainerHigh }]}>
            {renderRow('timer', 'Daily Practice Goal', 'Streak target per day', (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={[styles.badge, { backgroundColor: isSystemDark ? 'rgba(76,215,246,0.1)' : 'rgba(6,182,212,0.1)' }]}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: st.primary }}>15 min/day</Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color={st.onSurfaceVariant} />
              </View>
            ), () => {})}
            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: st.divider }} />
            {renderRow('signal-cellular-alt', 'Difficulty Level', 'CEFR alignment', (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={[styles.badge, { backgroundColor: isSystemDark ? 'rgba(74,51,130,0.3)' : 'rgba(139,92,246,0.1)' }]}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: st.secondary }}>B2 Upper Inter.</Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color={st.onSurfaceVariant} />
              </View>
            ), () => {})}
            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: st.divider }} />
            {renderRow('forum', 'Preferred Practice Style', 'Scenario generation mode', (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 14, color: st.onSurface }}>Conversational</Text>
                <MaterialIcons name="chevron-right" size={20} color={st.onSurfaceVariant} />
              </View>
            ), () => {})}
          </View>
        </View>

        {/* Section 4: Notifications */}
        <View style={styles.section}>
          {renderSectionHeader('notifications-active', 'Notifications')}
          <View style={[styles.cardList, { backgroundColor: st.surfaceContainerHigh }]}>
            {renderRow('notifications', 'Daily Practice Reminders', 'Get notified at 09:00 AM', (
              <Switch value={notifDaily} onValueChange={setNotifDaily} trackColor={{ true: st.primary, false: st.surfaceContainerHigh }} thumbColor={st.surface} />
            ))}
            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: st.divider }} />
            {renderRow('bolt', 'Streak Protection Alerts', 'Remind me before midnight', (
              <Switch value={notifStreak} onValueChange={setNotifStreak} trackColor={{ true: st.primary, false: st.surfaceContainerHigh }} thumbColor={st.surface} />
            ))}
            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: st.divider }} />
            {renderRow('insights', 'Weekly Progress Report', 'Detailed cadence breakdown', (
              <Switch value={notifWeekly} onValueChange={setNotifWeekly} trackColor={{ true: st.primary, false: st.surfaceContainerHigh }} thumbColor={st.surface} />
            ))}
          </View>
        </View>

        {/* Section 5: Voice & Audio */}
        <View style={styles.section}>
          {renderSectionHeader('graphic-eq', 'Voice & Audio')}
          <View style={[styles.cardList, { backgroundColor: st.surfaceContainerHigh }]}>
            <View style={[styles.rowCol, { backgroundColor: st.surfaceContainer }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <View>
                  <Text style={{ fontSize: 15, color: st.onSurface }}>Voice Playback Speed</Text>
                  <Text style={{ fontSize: 13, color: st.onSurfaceVariant, marginTop: 2 }}>Adjust synthesis rate</Text>
                </View>
                <Text style={{ fontSize: 12, fontWeight: '600', color: st.primary }}>{playbackSpeed} {playbackSpeed === '1.0x' ? 'Normal' : ''}</Text>
              </View>
              <View style={[styles.speedSelector, { backgroundColor: st.surfaceContainerLowest }]}>
                {['0.8x', '1.0x', '1.2x'].map((s) => (
                  <TouchableOpacity key={s} style={[styles.speedBtn, playbackSpeed === s && { backgroundColor: st.surfaceContainerHigh }]} onPress={() => setPlaybackSpeed(s)}>
                    <Text style={{ fontSize: 12, fontWeight: playbackSpeed === s ? '600' : '400', color: playbackSpeed === s ? st.primary : st.onSurfaceVariant }}>
                      {s} {s === '1.0x' ? '(Normal)' : ''}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: st.divider }} />
            {renderRow('volume-up', 'Auto-play Pronunciation Audio', 'Hear words instantly on card tap', (
              <Switch value={autoPlay} onValueChange={setAutoPlay} trackColor={{ true: st.primary, false: st.surfaceContainerHigh }} thumbColor={st.surface} />
            ))}
            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: st.divider }} />
            {renderRow('mic-off', 'Microphone Noise Suppression', 'Isolate voice in busy cafes', (
              <Switch value={noiseSuppression} onValueChange={setNoiseSuppression} trackColor={{ true: st.primary, false: st.surfaceContainerHigh }} thumbColor={st.surface} />
            ))}
          </View>
        </View>

        {/* Section 6: Privacy & Security */}
        <View style={styles.section}>
          {renderSectionHeader('security', 'Privacy & Security')}
          <View style={[styles.cardList, { backgroundColor: st.surfaceContainerHigh }]}>
            {renderRow('policy', 'Privacy Policy', undefined, (
              <MaterialIcons name="open-in-new" size={20} color={st.onSurfaceVariant} />
            ), () => {})}
            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: st.divider }} />
            {renderRow('fingerprint', 'Account Security & Biometrics', undefined, (
              <MaterialIcons name="chevron-right" size={20} color={st.onSurfaceVariant} />
            ), () => {})}
            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: st.divider }} />
            {renderRow('analytics', 'Voice Data & Analytics Sharing', undefined, (
              <MaterialIcons name="chevron-right" size={20} color={st.onSurfaceVariant} />
            ), () => {})}
          </View>
        </View>

        {/* Section 7: Support & About */}
        <View style={styles.section}>
          {renderSectionHeader('help-center', 'Support & About')}
          <View style={[styles.cardList, { backgroundColor: st.surfaceContainerHigh }]}>
            {renderRow('contact-support', 'Help Center & FAQ', undefined, (
              <MaterialIcons name="chevron-right" size={20} color={st.onSurfaceVariant} />
            ), () => {})}
            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: st.divider }} />
            {renderRow('rate-review', 'Send Feedback', undefined, (
              <MaterialIcons name="chevron-right" size={20} color={st.onSurfaceVariant} />
            ), () => {})}
            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: st.divider }} />
            {renderRow('info', 'About PolyTalk', undefined, (
              <MaterialIcons name="chevron-right" size={20} color={st.onSurfaceVariant} />
            ), () => {})}
            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: st.divider }} />
            {renderRow('terminal', 'App Version', undefined, (
              <Text style={{ fontSize: 12, fontWeight: '600', color: st.onSurfaceVariant }}>v2.4.0 (Build 418)</Text>
            ))}
          </View>
        </View>

        {/* Section 8: Account Actions */}
        <View style={styles.section}>
          {renderSectionHeader('manage-accounts', 'Account', '#E11D48')}
          <View style={[styles.cardList, { backgroundColor: st.surfaceContainerHigh }]}>
            {renderRow('logout', 'Sign Out', 'Securely exit your session', (
              <MaterialIcons name="arrow-forward" size={20} color={st.onSurfaceVariant} />
            ), handleSignOut, '#E11D48')}
            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: st.divider }} />
            {renderRow('delete-forever', 'Delete Account', 'Permanently wipe conversation & audio records', (
              <MaterialIcons name="warning" size={20} color={st.error} />
            ), () => {}, st.error)}
          </View>
        </View>

      </ScrollView>

      <PuterConnectModal
        visible={isPuterModalOpen}
        onClose={() => setIsPuterModalOpen(false)}
        onConnected={(profile) => {
          setPuterProfile(profile);
          setIsPuterConnected(true);
        }}
        userId={currentUserId}
        isDark={isSystemDark}
      />

      <PuterBillingNoticeModal
        visible={showBillingNotice}
        username={puterProfile?.username || 'Puter User'}
        onDismiss={() => setShowBillingNotice(false)}
        isDark={isSystemDark}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'ios' ? 44 : 24,
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
  },
  bannerCard: {
    borderRadius: 12,
    padding: 16,
    overflow: 'hidden',
    position: 'relative',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 24,
  },
  bannerGlow: {
    position: 'absolute',
    bottom: -24,
    right: -24,
    width: 112,
    height: 112,
    borderRadius: 56,
  },
  bannerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  card: {
    borderRadius: 12,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardList: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  themeSelector: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 4,
    gap: 4,
  },
  themeBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  rowCol: {
    padding: 16,
  },
  rowIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  speedSelector: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 4,
    gap: 4,
  },
  speedBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 4,
  }
});
