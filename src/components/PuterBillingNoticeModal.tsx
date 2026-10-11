import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Text } from '@/components/ui';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface PuterBillingNoticeModalProps {
  visible: boolean;
  username?: string;
  onDismiss: () => void;
  isDark?: boolean;
}

export const PuterBillingNoticeModal: React.FC<PuterBillingNoticeModalProps> = ({
  visible,
  username = 'Puter User',
  onDismiss,
  isDark = true,
}) => {
  const colors = {
    surface: isDark ? '#161B29' : '#FFFFFF',
    surfaceHigh: isDark ? '#252A38' : '#F3F4F6',
    surfaceLowest: isDark ? '#0E1320' : '#E5E7EB',
    onSurface: isDark ? '#DEE2F5' : '#111827',
    onSurfaceVariant: isDark ? '#BCC9CD' : '#6B7280',
    primary: isDark ? '#4CD7F6' : '#06B6D4',
    secondary: isDark ? '#D0BCFF' : '#8B5CF6',
    border: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {/* Header Icon */}
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={['#06B6D4', '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconCircle}
            >
              <MaterialIcons name="auto-awesome" size={28} color="#FFFFFF" />
            </LinearGradient>
          </View>

          {/* Title & Subtitle */}
          <Text variant="heading" weight="bold" color="textPrimary" align="center" style={{ marginTop: 12 }}>
            Puter AI Connected!
          </Text>
          <Text variant="caption" weight="semibold" color="primary" align="center" style={{ marginTop: 2, letterSpacing: 0.5 }}>
            USER-OWNED AI BILLING ACTIVE
          </Text>

          {/* Connected User Badge */}
          <View style={[styles.userBadge, { backgroundColor: colors.surfaceHigh }]}>
            <View style={styles.userLeft}>
              <MaterialIcons name="account-circle" size={20} color={colors.primary} />
              <Text variant="label" weight="bold" color="textPrimary">
                @{username}
              </Text>
            </View>
            <View style={styles.activeTag}>
              <View style={styles.activeDot} />
              <Text variant="caption" weight="bold" style={{ color: '#10B981', fontSize: 11 }}>
                Active Quota
              </Text>
            </View>
          </View>

          {/* Key Explanations */}
          <View style={styles.infoList}>
            <View style={styles.infoRow}>
              <View style={[styles.infoIconWrap, { backgroundColor: isDark ? 'rgba(6, 182, 212, 0.15)' : 'rgba(6, 182, 212, 0.1)' }]}>
                <MaterialIcons name="credit-card" size={18} color="#06B6D4" />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="label" weight="semibold" color="textPrimary" style={{ fontSize: 13 }}>
                  Direct Puter Deduction
                </Text>
                <Text variant="bodySmall" color="textSecondary" style={{ fontSize: 12, marginTop: 2, lineHeight: 16 }}>
                  All AI conversations, voice replies, and grammar checks are billed directly to your own Puter account credits.
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={[styles.infoIconWrap, { backgroundColor: isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.1)' }]}>
                <MaterialIcons name="lock-clock" size={18} color="#8B5CF6" />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="label" weight="semibold" color="textPrimary" style={{ fontSize: 13 }}>
                  Zero Extra PolyTalk Charges
                </Text>
                <Text variant="bodySmall" color="textSecondary" style={{ fontSize: 12, marginTop: 2, lineHeight: 16 }}>
                  PolyTalk never charges any subscription or API fees. You only pay what Puter charges for token usage.
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={[styles.infoIconWrap, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)' }]}>
                <MaterialIcons name="tune" size={18} color="#10B981" />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="label" weight="semibold" color="textPrimary" style={{ fontSize: 13 }}>
                  Manage Quota Anytime
                </Text>
                <Text variant="bodySmall" color="textSecondary" style={{ fontSize: 12, marginTop: 2, lineHeight: 16 }}>
                  You can view your token balance or disconnect anytime in Settings &gt; AI Provider.
                </Text>
              </View>
            </View>
          </View>

          {/* Dismiss Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onDismiss}
            style={styles.actionBtnWrap}
          >
            <LinearGradient
              colors={['#06B6D4', '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.actionBtn}
            >
              <Text variant="label" weight="bold" color="textInverse" style={{ fontSize: 15 }}>
                Got It, Let's Learn!
              </Text>
              <MaterialIcons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: -8,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#06B6D4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 16,
  },
  userLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  infoList: {
    marginTop: 16,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  actionBtnWrap: {
    marginTop: 24,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#06B6D4',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  actionBtn: {
    flexDirection: 'row',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
