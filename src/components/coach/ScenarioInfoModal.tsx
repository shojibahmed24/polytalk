import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from '@/components/ui';
import { MaterialIcons } from '@expo/vector-icons';
import { CoachScenario } from '@/services/coach/types';

interface Props {
  visible: boolean;
  scenario: CoachScenario | null;
  onClose: () => void;
  isDark?: boolean;
}

export function ScenarioInfoModal({ visible, scenario, onClose, isDark = true }: Props) {
  if (!scenario) return null;

  const st = {
    bg: isDark ? 'rgba(10, 15, 29, 0.85)' : 'rgba(0, 0, 0, 0.5)',
    card: isDark ? '#161B29' : '#FFFFFF',
    text: isDark ? '#DEE2F5' : '#111827',
    subText: isDark ? '#8A99AD' : '#6B7280',
    primary: isDark ? '#4CD7F6' : '#06B6D4',
    surfaceHigh: isDark ? '#252A38' : '#F3F4F6',
    border: isDark ? '#303443' : '#E5E7EB',
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.backdrop, { backgroundColor: st.bg }]}>
        <View style={[styles.card, { backgroundColor: st.card, borderColor: st.border }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={[styles.iconWrap, { backgroundColor: st.surfaceHigh }]}>
                <MaterialIcons name="restaurant" size={20} color={st.primary} />
              </View>
              <View>
                <Text style={{ fontSize: 16, fontWeight: '700', color: st.text }}>Scenario Brief</Text>
                <Text style={{ fontSize: 11, color: st.subText }}>Roleplay Instructions</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <MaterialIcons name="close" size={20} color={st.subText} />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ maxHeight: 400 }} showsVerticalScrollIndicator={false}>
            {/* Title & Level */}
            <View style={{ marginTop: 12, marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: st.text }}>{scenario.title}</Text>
              <Text style={{ fontSize: 13, color: st.primary, fontWeight: '600', marginTop: 2 }}>
                Level: {scenario.proficiency_levels.join(', ')} • {scenario.category}
              </Text>
              <Text style={{ fontSize: 13, color: st.subText, marginTop: 8, lineHeight: 20 }}>
                {scenario.description}
              </Text>
            </View>

            {/* Roles */}
            <View style={[styles.infoBox, { backgroundColor: st.surfaceHigh }]}>
              <View style={styles.roleRow}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: st.primary }}>AI Character:</Text>
                <Text style={{ fontSize: 12, color: st.text, marginLeft: 6 }}>{scenario.ai_role}</Text>
              </View>
              <View style={[styles.roleRow, { marginTop: 6 }]}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: st.primary }}>Your Character:</Text>
                <Text style={{ fontSize: 12, color: st.text, marginLeft: 6 }}>{scenario.user_role}</Text>
              </View>
            </View>

            {/* Learning Goals */}
            <View style={{ marginTop: 16 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: st.text, marginBottom: 8 }}>
                Suggested Conversation Starters:
              </Text>
              {scenario.suggested_responses.map((sug, idx) => (
                <View key={idx} style={styles.sugItem}>
                  <MaterialIcons name="chat-bubble-outline" size={14} color={st.primary} />
                  <Text style={{ fontSize: 12, color: st.text, marginLeft: 8 }}>"{sug}"</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Action button */}
          <TouchableOpacity onPress={onClose} style={[styles.doneBtn, { backgroundColor: st.primary }]}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#090E1B' }}>Got It, Let's Practice</Text>
          </TouchableOpacity>
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
    marginBottom: 8,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    padding: 4,
  },
  infoBox: {
    padding: 12,
    borderRadius: 12,
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sugItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  doneBtn: {
    marginTop: 18,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
});
