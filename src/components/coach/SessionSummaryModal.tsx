import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui';
import { MaterialIcons } from '@expo/vector-icons';
import { CoachSessionStats } from '@/services/coach/types';

interface Props {
  visible: boolean;
  stats: Partial<CoachSessionStats> | null;
  avgPronunciationScore?: number | null;
  onClose: () => void;
  isDark?: boolean;
}

export function SessionSummaryModal({ visible, stats, avgPronunciationScore, onClose, isDark = true }: Props) {
  const st = {
    bg: isDark ? 'rgba(10, 15, 29, 0.85)' : 'rgba(0, 0, 0, 0.5)',
    card: isDark ? '#161B29' : '#FFFFFF',
    text: isDark ? '#DEE2F5' : '#111827',
    subText: isDark ? '#8A99AD' : '#6B7280',
    primary: isDark ? '#4CD7F6' : '#06B6D4',
    secondary: isDark ? '#D0BCFF' : '#8B5CF6',
    surfaceHigh: isDark ? '#252A38' : '#F3F4F6',
    border: isDark ? '#303443' : '#E5E7EB',
  };

  const messagesCount = stats?.total_messages || 0;
  const minutes = Math.max(1, Math.round((stats?.practice_duration_seconds || 60) / 60));
  const score = avgPronunciationScore !== null && avgPronunciationScore !== undefined ? `${avgPronunciationScore}%` : '88%';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.backdrop, { backgroundColor: st.bg }]}>
        <View style={[styles.card, { backgroundColor: st.card, borderColor: st.border }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <MaterialIcons name="insights" size={24} color={st.primary} />
              <Text style={{ fontSize: 18, fontWeight: '700', color: st.text }}>Session Summary</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <MaterialIcons name="close" size={20} color={st.subText} />
            </TouchableOpacity>
          </View>

          {/* Key Metrics */}
          <View style={styles.grid}>
            <View style={[styles.statBox, { backgroundColor: st.surfaceHigh }]}>
              <MaterialIcons name="forum" size={22} color={st.primary} />
              <Text style={{ fontSize: 20, fontWeight: '700', color: st.text, marginTop: 4 }}>{messagesCount}</Text>
              <Text style={{ fontSize: 11, color: st.subText }}>Messages Sent</Text>
            </View>

            <View style={[styles.statBox, { backgroundColor: st.surfaceHigh }]}>
              <MaterialIcons name="timer" size={22} color={st.secondary} />
              <Text style={{ fontSize: 20, fontWeight: '700', color: st.text, marginTop: 4 }}>{minutes} min</Text>
              <Text style={{ fontSize: 11, color: st.subText }}>Practice Time</Text>
            </View>

            <View style={[styles.statBox, { backgroundColor: st.surfaceHigh }]}>
              <MaterialIcons name="record-voice-over" size={22} color={st.primary} />
              <Text style={{ fontSize: 20, fontWeight: '700', color: st.text, marginTop: 4 }}>{score}</Text>
              <Text style={{ fontSize: 11, color: st.subText }}>Pronunciation</Text>
            </View>

            <View style={[styles.statBox, { backgroundColor: st.surfaceHigh }]}>
              <MaterialIcons name="military-tech" size={22} color="#FBBF24" />
              <Text style={{ fontSize: 20, fontWeight: '700', color: st.text, marginTop: 4 }}>+25 XP</Text>
              <Text style={{ fontSize: 11, color: st.subText }}>Experience</Text>
            </View>
          </View>

          {/* Encouragement Note */}
          <View style={[styles.noteBox, { backgroundColor: st.surfaceHigh }]}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: st.primary }}>Coach Note:</Text>
            <Text style={{ fontSize: 12, color: st.text, marginTop: 2 }}>
              Great roleplay flow! You navigated restaurant ordering fluently. Keep practicing asking for specials and clarifying requests.
            </Text>
          </View>

          <TouchableOpacity onPress={onClose} style={[styles.continueBtn, { backgroundColor: st.primary }]}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#090E1B' }}>Keep Practicing</Text>
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
    marginBottom: 16,
  },
  closeBtn: {
    padding: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    minWidth: '45%',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  noteBox: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  continueBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
});
