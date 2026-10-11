import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Text } from '@/components/ui';
import { MaterialIcons } from '@expo/vector-icons';
import { SessionSettings } from '@/services/coach/types';

interface Props {
  visible: boolean;
  settings: SessionSettings;
  onSave: (newSettings: SessionSettings) => void;
  onClose: () => void;
  isDark?: boolean;
}

export function SessionSettingsModal({ visible, settings, onSave, onClose, isDark = true }: Props) {
  const [localSettings, setLocalSettings] = useState<SessionSettings>(settings);

  const st = {
    bg: isDark ? 'rgba(10, 15, 29, 0.85)' : 'rgba(0, 0, 0, 0.5)',
    card: isDark ? '#161B29' : '#FFFFFF',
    text: isDark ? '#DEE2F5' : '#111827',
    subText: isDark ? '#8A99AD' : '#6B7280',
    primary: isDark ? '#4CD7F6' : '#06B6D4',
    surfaceHigh: isDark ? '#252A38' : '#F3F4F6',
    border: isDark ? '#303443' : '#E5E7EB',
  };

  const handleModeSelect = (mode: 'bilingual_tutor' | 'dual_immersion') => {
    setLocalSettings(prev => ({ ...prev, learningMode: mode }));
  };

  const handleLevelSelect = (level: string) => {
    setLocalSettings(prev => ({ ...prev, proficiencyLevel: level }));
  };

  const handleRateSelect = (rate: number) => {
    setLocalSettings(prev => ({ ...prev, voiceRate: rate }));
  };

  const handleIntensitySelect = (intensity: 'gentle' | 'balanced' | 'rigorous') => {
    setLocalSettings(prev => ({ ...prev, correctionIntensity: intensity }));
  };

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={[styles.backdrop, { backgroundColor: st.bg }]}>
        <View style={[styles.card, { backgroundColor: st.card, borderColor: st.border }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <MaterialIcons name="tune" size={22} color={st.primary} />
              <Text style={{ fontSize: 18, fontWeight: '700', color: st.text }}>Session Settings</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <MaterialIcons name="close" size={20} color={st.subText} />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ maxHeight: 460 }} showsVerticalScrollIndicator={false}>
            {/* Learning Mode Selection */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: st.text }]}>Learning Mode (শেখার মোড)</Text>
              <View style={{ gap: 8, marginTop: 4 }}>
                <TouchableOpacity
                  onPress={() => handleModeSelect('bilingual_tutor')}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 12,
                    borderRadius: 12,
                    backgroundColor: (localSettings.learningMode || 'bilingual_tutor') === 'bilingual_tutor'
                      ? (isDark ? 'rgba(76,215,246,0.18)' : '#E0F2FE')
                      : st.surfaceHigh,
                    borderWidth: 1.5,
                    borderColor: (localSettings.learningMode || 'bilingual_tutor') === 'bilingual_tutor' ? st.primary : 'transparent',
                    gap: 12
                  }}
                >
                  <MaterialIcons name="school" size={24} color={st.primary} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: st.text }}>
                      Bilingual Tutor Mode (শিক্ষক মোড)
                    </Text>
                    <Text style={{ fontSize: 12, color: st.subText, marginTop: 2 }}>
                      AI বাংলায় বুঝিয়ে স্প্যানিশ শব্দ ও নিয়ম শেখাবে
                    </Text>
                  </View>
                  {(localSettings.learningMode || 'bilingual_tutor') === 'bilingual_tutor' && (
                    <MaterialIcons name="check-circle" size={20} color={st.primary} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleModeSelect('dual_immersion')}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 12,
                    borderRadius: 12,
                    backgroundColor: localSettings.learningMode === 'dual_immersion'
                      ? (isDark ? 'rgba(76,215,246,0.18)' : '#E0F2FE')
                      : st.surfaceHigh,
                    borderWidth: 1.5,
                    borderColor: localSettings.learningMode === 'dual_immersion' ? st.primary : 'transparent',
                    gap: 12
                  }}
                >
                  <MaterialIcons name="forum" size={24} color={st.primary} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: st.text }}>
                      Dual Immersion Mode (দ্বিভাষিক কথোপকথন)
                    </Text>
                    <Text style={{ fontSize: 12, color: st.subText, marginTop: 2 }}>
                      AI স্প্যানিশে কথা বলবে + সাথে বাংলা অর্থ ও উচ্চারণ দেবে
                    </Text>
                  </View>
                  {localSettings.learningMode === 'dual_immersion' && (
                    <MaterialIcons name="check-circle" size={20} color={st.primary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* CEFR Level Selection */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: st.text }]}>Proficiency Level</Text>
              <View style={styles.optionsRow}>
                {['A1', 'A2', 'B1', 'B2', 'C1'].map((lvl) => {
                  const isSelected = localSettings.proficiencyLevel.includes(lvl);
                  return (
                    <TouchableOpacity
                      key={lvl}
                      onPress={() => handleLevelSelect(lvl)}
                      style={[
                        styles.chip,
                        { backgroundColor: isSelected ? st.primary : st.surfaceHigh }
                      ]}
                    >
                      <Text style={{ fontSize: 13, fontWeight: '700', color: isSelected ? '#090E1B' : st.text }}>
                        {lvl}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Speaking Rate */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: st.text }]}>AI Speaking Speed</Text>
              <View style={styles.optionsRow}>
                {[
                  { label: '0.8x Slower', value: 0.8 },
                  { label: '1.0x Normal', value: 1.0 },
                  { label: '1.2x Faster', value: 1.2 },
                ].map((item) => {
                  const isSelected = localSettings.voiceRate === item.value;
                  return (
                    <TouchableOpacity
                      key={item.label}
                      onPress={() => handleRateSelect(item.value)}
                      style={[
                        styles.chip,
                        { backgroundColor: isSelected ? st.primary : st.surfaceHigh }
                      ]}
                    >
                      <Text style={{ fontSize: 12, fontWeight: '600', color: isSelected ? '#090E1B' : st.text }}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Correction Intensity */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: st.text }]}>Grammar Correction Intensity</Text>
              <View style={styles.optionsRow}>
                {(['gentle', 'balanced', 'rigorous'] as const).map((intensity) => {
                  const isSelected = localSettings.correctionIntensity === intensity;
                  return (
                    <TouchableOpacity
                      key={intensity}
                      onPress={() => handleIntensitySelect(intensity)}
                      style={[
                        styles.chip,
                        { backgroundColor: isSelected ? st.primary : st.surfaceHigh }
                      ]}
                    >
                      <Text style={{ fontSize: 12, fontWeight: '600', textTransform: 'capitalize', color: isSelected ? '#090E1B' : st.text }}>
                        {intensity}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Feature Toggles */}
            <View style={[styles.toggleRow, { borderTopColor: st.border }]}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: st.text }}>Real-Time Pronunciation Assessment</Text>
                <Text style={{ fontSize: 11, color: st.subText }}>Evaluates voice inputs for accuracy & clarity</Text>
              </View>
              <Switch
                value={localSettings.pronunciationAssessment}
                onValueChange={(val) => setLocalSettings(prev => ({ ...prev, pronunciationAssessment: val }))}
                trackColor={{ false: st.surfaceHigh, true: st.primary }}
              />
            </View>

            <View style={[styles.toggleRow, { borderTopColor: st.border }]}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: st.text }}>Instant Translation</Text>
                <Text style={{ fontSize: 11, color: st.subText }}>Show translation buttons on AI replies</Text>
              </View>
              <Switch
                value={localSettings.translationPreference}
                onValueChange={(val) => setLocalSettings(prev => ({ ...prev, translationPreference: val }))}
                trackColor={{ false: st.surfaceHigh, true: st.primary }}
              />
            </View>

            <View style={[styles.toggleRow, { borderTopColor: st.border }]}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: st.text }}>Autoplay AI Audio</Text>
                <Text style={{ fontSize: 11, color: st.subText }}>Automatically voice replies when received</Text>
              </View>
              <Switch
                value={localSettings.autoplayAudio}
                onValueChange={(val) => setLocalSettings(prev => ({ ...prev, autoplayAudio: val }))}
                trackColor={{ false: st.surfaceHigh, true: st.primary }}
              />
            </View>
          </ScrollView>

          {/* Action buttons */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={onClose} style={[styles.cancelBtn, { backgroundColor: st.surfaceHigh }]}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: st.text }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={[styles.saveBtn, { backgroundColor: st.primary }]}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#090E1B' }}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  closeBtn: {
    padding: 4,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    minWidth: 44,
    alignItems: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
});
