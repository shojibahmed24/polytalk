import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from '@/components/ui';
import { MaterialIcons } from '@expo/vector-icons';
import { VocabularyItem } from '@/services/coach/types';

interface Props {
  visible: boolean;
  items: VocabularyItem[];
  onClose: () => void;
  isDark?: boolean;
}

export function VocabularyModal({ visible, items, onClose, isDark = true }: Props) {
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
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={[styles.backdrop, { backgroundColor: st.bg }]}>
        <View style={[styles.card, { backgroundColor: st.card, borderColor: st.border }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <MaterialIcons name="auto-stories" size={22} color={st.primary} />
              <Text style={{ fontSize: 18, fontWeight: '700', color: st.text }}>Saved Vocabulary</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <MaterialIcons name="close" size={20} color={st.subText} />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
            {items.length === 0 ? (
              <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                <MaterialIcons name="menu-book" size={40} color={st.subText} style={{ opacity: 0.5 }} />
                <Text style={{ fontSize: 14, color: st.subText, marginTop: 12 }}>
                  No saved vocabulary words yet.
                </Text>
                <Text style={{ fontSize: 12, color: st.subText, marginTop: 4, textAlign: 'center' }}>
                  Tap the bookmark icon on any AI response to save new words.
                </Text>
              </View>
            ) : (
              items.map((item) => (
                <View key={item.id} style={[styles.itemCard, { backgroundColor: st.surfaceHigh }]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: st.text }}>{item.word}</Text>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: st.primary }}>{item.translation}</Text>
                  </View>
                  {item.context_sentence && (
                    <Text style={{ fontSize: 12, color: st.subText, marginTop: 4, fontStyle: 'italic' }}>
                      "{item.context_sentence}"
                    </Text>
                  )}
                </View>
              ))
            )}
          </ScrollView>

          <TouchableOpacity onPress={onClose} style={[styles.closeActionBtn, { backgroundColor: st.primary }]}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#090E1B' }}>Close</Text>
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
  itemCard: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  closeActionBtn: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
});
