import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Platform, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/components/ui';
import { ThemeContext } from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from '@/utils/i18n';
import { getTargetLanguage, saveTargetLanguage, getInterfaceLanguage, saveInterfaceLanguage } from '@/utils/languageStorage';
import { TARGET_LANGUAGES, INTERFACE_LANGUAGES, REGION_FILTERS } from '@/constants/languages';

export default function LanguageSelectionScreen() {
  const { isDark: isSystemDark } = React.useContext(ThemeContext);
  const [selectedTarget, setSelectedTarget] = useState<string>('es');
  const [selectedInterface, setSelectedInterface] = useState<string>('English (US)');
  const [selectedRegion, setSelectedRegion] = useState<string>('All Regions');
  const [searchQuery, setSearchQuery] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { t, setLang } = useTranslation();

  useEffect(() => {
    async function loadLangs() {
      const target = await getTargetLanguage();
      const iface = await getInterfaceLanguage();
      setSelectedTarget(target);
      setSelectedInterface(iface);
      setIsReady(true);
    }
    loadLangs();
  }, []);

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
    primaryContainer: isSystemDark ? '#06B6D4' : '#E0F2FE',
    onPrimaryContainer: isSystemDark ? '#00424F' : '#0369A1',
    secondary: isSystemDark ? '#D0BCFF' : '#8B5CF6',
    outline: isSystemDark ? '#869397' : '#9CA3AF',
    divider: isSystemDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
  };

  const handleContinue = async () => {
    setIsSaving(true);
    await saveTargetLanguage(selectedTarget);
    await saveInterfaceLanguage(selectedInterface);
    setIsSaving(false);
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const filteredTargets = useMemo(() => {
    return TARGET_LANGUAGES.filter(lang => {
      // 1. Region filter
      if (selectedRegion !== 'All Regions' && selectedRegion !== 'Popular') {
        if (lang.region !== selectedRegion) return false;
      }
      // 2. Search query filter
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = lang.name.toLowerCase().includes(q);
        const matchesEnglish = lang.englishName.toLowerCase().includes(q);
        const matchesAlias = lang.searchAliases.some(alias => alias.includes(q));
        if (!matchesName && !matchesEnglish && !matchesAlias) {
          return false;
        }
      }
      return true;
    });
  }, [selectedRegion, searchQuery]);

  const activeTargetData = TARGET_LANGUAGES.find(l => l.id === selectedTarget) || TARGET_LANGUAGES[0];

  if (!isReady) {
    return (
      <View style={{ flex: 1, backgroundColor: st.surface, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={st.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: st.surface }}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isSystemDark ? 'rgba(14,19,32,0.85)' : 'rgba(248,249,252,0.85)', borderBottomColor: st.divider }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={handleBack}
              style={styles.backBtn}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <MaterialIcons name="arrow-back" size={24} color={st.onSurface} />
            </TouchableOpacity>
            <View style={styles.headerTitleCol}>
              <Text style={{ fontSize: 22, fontWeight: '600', color: st.onSurface, letterSpacing: -0.5 }}>{t('choose_your_languages')}</Text>
              <Text variant="label" style={{ color: st.onSurfaceVariant }}>{t('make_polytalk_yours')}</Text>
            </View>
          </View>
          
          <View style={[styles.avatarWrap, { backgroundColor: st.primary }]}>
            <MaterialIcons name="person" size={18} color={isSystemDark ? '#003640' : '#FFFFFF'} />
          </View>
        </View>
      </View>

      {/* Main Scrollable Area */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* SECTION A: App Interface Language */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <View>
              <Text variant="label" weight="bold" style={{ fontSize: 14, color: st.onSurface }}>{t('app_interface')}</Text>
              <Text variant="bodySmall" style={{ color: st.onSurfaceVariant }}>{t('system_menus')}</Text>
            </View>
            <View style={[styles.defaultBadge, { backgroundColor: st.surfaceContainerHigh }]}>
              <Text style={{ fontSize: 10, fontWeight: '700', color: st.primary, textTransform: 'uppercase' }}>{t('default')}</Text>
            </View>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizList}>
            {INTERFACE_LANGUAGES.map((lang, idx) => {
              const isSelected = selectedInterface === lang;
              return (
                <TouchableOpacity 
                  key={idx}
                  activeOpacity={0.7}
                  onPress={() => { setSelectedInterface(lang); setLang(lang); }}
                  style={[
                    styles.chip,
                    { backgroundColor: isSelected ? st.primaryContainer : st.surfaceContainer },
                    isSelected && { shadowColor: st.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 3 }
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                >
                  {isSelected && <MaterialIcons name="check-circle" size={16} color={st.onPrimaryContainer} style={{ marginRight: 4 }} />}
                  <Text style={{ fontSize: 13, fontWeight: '600', color: isSelected ? st.onPrimaryContainer : st.onSurface }}>{lang}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* SECTION B: Target Language */}
        <View style={[styles.section, { marginTop: 24 }]}>
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: '600', color: st.onSurface }}>{t('target_language')}</Text>
            <Text variant="bodySmall" style={{ color: st.onSurfaceVariant, marginTop: 4 }}>{t('choose_tongue')}</Text>
          </View>
          
          {/* Active Selection Summary Card */}
          <View style={[styles.activeCard, { backgroundColor: st.surfaceContainerHigh, overflow: 'hidden' }]}>
            <View style={[styles.activeCardGlow, { backgroundColor: st.primary }]} />
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, paddingRight: 8 }}>
                <View style={[styles.activeFlagWrap, { backgroundColor: st.surfaceContainerLowest }]}>
                  <Text style={{ fontSize: 24 }}>{activeTargetData.flag}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontSize: 18, fontWeight: '600', color: st.onSurface }} numberOfLines={1}>{activeTargetData.name}</Text>
                    <View style={styles.liveDotWrap}>
                      <View style={[styles.liveDotPing, { backgroundColor: st.primary }]} />
                      <View style={[styles.liveDot, { backgroundColor: st.primary }]} />
                    </View>
                  </View>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: st.onSurfaceVariant, marginTop: 2 }} numberOfLines={1}>
                    {t('primary_target')} â€¢ {activeTargetData.dialect} Dialect
                  </Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end', flexShrink: 0 }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: st.primary, textTransform: 'uppercase' }}>{t('ai_tutor')}</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: st.primary }}>{t('active')}</Text>
              </View>
            </View>
          </View>

          {/* Search Box */}
          <View style={styles.searchWrap}>
            <MaterialIcons name="search" size={20} color={st.onSurfaceVariant} style={styles.searchIcon} />
            <TextInput 
              placeholder={t('search_placeholder')}
              placeholderTextColor={st.outline}
              style={[styles.searchInput, { backgroundColor: st.surfaceContainer, color: st.onSurface }]}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <View style={styles.searchActions}>
                <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <MaterialIcons name="close" size={16} color={st.onSurfaceVariant} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Region Filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizList}>
            {REGION_FILTERS.map((reg, idx) => {
              const isSelected = selectedRegion === reg;
              return (
                <TouchableOpacity 
                  key={idx}
                  activeOpacity={0.7}
                  onPress={() => setSelectedRegion(reg)}
                  style={[
                    styles.chip,
                    { backgroundColor: isSelected ? (isSystemDark ? 'rgba(76,215,246,0.15)' : '#E0F2FE') : st.surfaceContainer },
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                >
                  <Text style={{ fontSize: 13, fontWeight: '600', color: isSelected ? st.primary : st.onSurfaceVariant }}>{reg}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Visual Section Divider */}
        <View style={styles.dividerRow}>
          <Text style={{ fontSize: 10, fontWeight: '700', color: st.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: 1 }}>
            {searchQuery ? 'Search Results' : 'Popular & Recommended'}
          </Text>
          <Text style={{ fontSize: 10, fontWeight: '700', color: st.outline }}>
            {filteredTargets.length} of {TARGET_LANGUAGES.length} {t('available')}
          </Text>
        </View>

        {/* SECTION C: Language Cards */}
        <View style={styles.languageList}>
          {filteredTargets.length === 0 && (
            <Text style={{ textAlign: 'center', color: st.onSurfaceVariant, marginVertical: 20 }}>{t('no_languages_found')} "{searchQuery}"</Text>
          )}
          {filteredTargets.map((lang) => {
            const isSelected = selectedTarget === lang.id;
            return (
              <TouchableOpacity 
                key={lang.id}
                activeOpacity={0.8}
                onPress={() => setSelectedTarget(lang.id)}
                style={[
                  styles.targetCard,
                  { backgroundColor: isSelected ? st.surfaceContainerHigh : st.surfaceContainer },
                  isSelected && { shadowColor: st.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 20, elevation: 4 }
                ]}
                accessibilityRole="radio"
                accessibilityState={{ checked: isSelected }}
              >
                <View style={styles.targetCardLeft}>
                  <View style={[styles.targetFlagWrap, { backgroundColor: st.surfaceContainerLowest }]}>
                    <Text style={{ fontSize: 20 }}>{lang.flag}</Text>
                  </View>
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <Text style={{ fontSize: 18, fontWeight: isSelected ? '700' : '500', color: isSelected ? st.primary : st.onSurface }} numberOfLines={1}>
                        {lang.name}
                      </Text>
                      {lang.dialect && (
                        <View style={[styles.targetDialectBadge, { backgroundColor: isSelected ? st.surfaceContainerLowest : st.surfaceVariant }]}>
                          <Text style={{ fontSize: 10, fontWeight: '700', color: isSelected ? st.primary : st.onSurfaceVariant }}>{lang.dialect}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={{ fontSize: 13, color: st.onSurfaceVariant, marginTop: 2 }} numberOfLines={1}>
                      {lang.englishName} {lang.speakers ? `â€¢ ${lang.speakers}` : ''}
                    </Text>
                  </View>
                </View>
                
                {isSelected ? (
                  <LinearGradient
                    colors={[st.primary, st.secondary]}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    style={styles.selectedCheckWrap}
                  >
                    <MaterialIcons name="check" size={16} color={isSystemDark ? '#090E1B' : '#FFFFFF'} />
                  </LinearGradient>
                ) : (
                  <View style={[styles.unselectedCheckWrap, { backgroundColor: st.surfaceVariant }]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

      </ScrollView>

      {/* Footer Container */}
      <View style={[styles.footer, { backgroundColor: isSystemDark ? 'rgba(14,19,32,0.9)' : 'rgba(248,249,252,0.9)', borderTopColor: st.divider }]}>
        <TouchableOpacity activeOpacity={0.8} onPress={handleContinue} disabled={isSaving}>
          <LinearGradient
            colors={[st.primaryContainer, st.primary, st.secondary]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={[styles.footerBtn, isSaving && { opacity: 0.8 }]}
          >
            {isSaving ? (
              <ActivityIndicator color={isSystemDark ? '#090E1B' : '#FFFFFF'} />
            ) : (
              <>
                <Text style={{ fontSize: 15, fontWeight: '600', color: isSystemDark ? '#090E1B' : '#FFFFFF', letterSpacing: 0.5 }}>{t('continue')}</Text>
                <MaterialIcons name="arrow-forward" size={20} color={isSystemDark ? '#090E1B' : '#FFFFFF'} style={{ marginLeft: 6 }} />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    paddingTop: Platform.OS === 'ios' ? 44 : 24, // fallback for status bar if SafeAreaView doesn't cover top
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 60,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -12,
  },
  headerTitleCol: {
    justifyContent: 'center',
  },
  avatarWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 120 : 100, // accommodate fixed header
    paddingBottom: Platform.OS === 'ios' ? 130 : 110, // critical: pad for fixed footer so last item isn't clipped
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  defaultBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  horizList: {
    paddingRight: 20,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  activeCardGlow: {
    position: 'absolute',
    right: -24,
    bottom: -24,
    width: 96,
    height: 96,
    borderRadius: 48,
    opacity: 0.1,
  },
  activeFlagWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  liveDotWrap: {
    width: 8,
    height: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveDotPing: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.75,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchIcon: {
    position: 'absolute',
    left: 14,
    zIndex: 10,
  },
  searchInput: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    paddingLeft: 44,
    paddingRight: 44,
    fontSize: 15,
  },
  searchActions: {
    position: 'absolute',
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginTop: 16,
  },
  languageList: {
    gap: 8,
  },
  targetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
  },
  targetCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  targetFlagWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetDialectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  selectedCheckWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  unselectedCheckWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginLeft: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  footerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 28,
  }
});

