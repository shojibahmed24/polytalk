import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import { Text } from '@/components/ui';
import { MaterialIcons } from '@expo/vector-icons';
import { 
  startPuterBrowserAuth, 
  connectPuterWithToken, 
  PuterProfile 
} from '@/services/puter';

interface PuterConnectModalProps {
  visible: boolean;
  onClose: () => void;
  onConnected: (profile: PuterProfile) => void;
  userId?: string | null;
  isDark?: boolean;
}

export const PuterConnectModal: React.FC<PuterConnectModalProps> = ({
  visible,
  onClose,
  onConnected,
  userId,
  isDark = true,
}) => {
  const [tokenInput, setTokenInput] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  const colors = {
    surface: isDark ? '#161B29' : '#FFFFFF',
    surfaceHigh: isDark ? '#252A38' : '#F3F4F6',
    surfaceLowest: isDark ? '#0E1320' : '#E5E7EB',
    onSurface: isDark ? '#DEE2F5' : '#111827',
    onSurfaceVariant: isDark ? '#BCC9CD' : '#6B7280',
    primary: isDark ? '#4CD7F6' : '#06B6D4',
    primaryContainer: isDark ? '#003640' : '#E0F2FE',
    error: isDark ? '#FFB4AB' : '#EF4444',
    border: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
  };

  const handleBrowserAuth = async () => {
    setIsLoading(true);
    setErrorMessage('');
    setStatusMessage('Initiating Puter login...');

    try {
      const res = await startPuterBrowserAuth(userId, (status) => {
        setStatusMessage(status);
      });

      if (res.success && res.user) {
        setIsLoading(false);
        onConnected(res.user);
        onClose();
      } else {
        setIsLoading(false);
        setErrorMessage(res.error || 'Failed to authenticate with Puter.');
        setShowManualInput(true);
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Error launching browser authentication.');
      setShowManualInput(true);
    }
  };

  const handleManualTokenSubmit = async () => {
    if (!tokenInput.trim()) {
      setErrorMessage('Please paste your Puter Auth Token.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setStatusMessage('Verifying Puter token...');

    try {
      const res = await connectPuterWithToken(userId, tokenInput.trim());
      setIsLoading(false);
      if (res.success && res.user) {
        onConnected(res.user);
        onClose();
      } else {
        setErrorMessage(res.error || 'Invalid Puter token.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Token verification failed.');
    }
  };

  const openPuterDashboard = () => {
    Linking.openURL('https://puter.com/dashboard#account');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={[styles.iconCircle, { backgroundColor: colors.primaryContainer }]}>
                <MaterialIcons name="cloud" size={24} color={colors.primary} />
              </View>
              <View>
                <Text style={{ fontSize: 18, fontWeight: '700', color: colors.onSurface }}>
                  Connect Puter AI
                </Text>
                <Text style={{ fontSize: 13, color: colors.onSurfaceVariant }}>
                  User-Owned AI Provider
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} disabled={isLoading} style={styles.closeBtn}>
              <MaterialIcons name="close" size={20} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          {/* Explanation */}
          <Text style={{ fontSize: 14, color: colors.onSurfaceVariant, marginTop: 14, lineHeight: 20 }}>
            PolyTalk uses your personal Puter account for AI conversations and real-time grammar corrections. You remain in complete control of your usage and account.
          </Text>

          {/* Status / Error display */}
          {errorMessage ? (
            <View style={[styles.alertBox, { backgroundColor: 'rgba(239, 68, 68, 0.12)' }]}>
              <MaterialIcons name="error-outline" size={18} color={colors.error} />
              <Text style={{ fontSize: 13, color: colors.error, flex: 1, marginLeft: 8 }}>
                {errorMessage}
              </Text>
            </View>
          ) : null}

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={colors.primary} size="small" />
              <Text style={{ fontSize: 13, color: colors.primary, marginTop: 8 }}>
                {statusMessage}
              </Text>
            </View>
          ) : null}

          {/* Option 1: Browser 1-Click Sign-in */}
          {!isLoading && (
            <View style={{ marginTop: 20 }}>
              <TouchableOpacity
                style={[styles.primaryActionBtn, { backgroundColor: colors.primary }]}
                onPress={handleBrowserAuth}
                activeOpacity={0.85}
              >
                <MaterialIcons name="open-in-browser" size={20} color="#003640" />
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#003640', marginLeft: 8 }}>
                  Sign In with Puter
                </Text>
              </TouchableOpacity>

              {/* Toggle manual token input */}
              <TouchableOpacity
                onPress={() => setShowManualInput(!showManualInput)}
                style={{ marginTop: 16, alignItems: 'center' }}
              >
                <Text style={{ fontSize: 13, color: colors.primary, textDecorationLine: 'underline' }}>
                  {showManualInput ? 'Hide manual token option' : 'Or connect via Puter Auth Token'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Option 2: Manual token input if requested or after failure */}
          {showManualInput && !isLoading ? (
            <View style={[styles.manualSection, { backgroundColor: colors.surfaceLowest, borderColor: colors.border }]}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: colors.onSurface }}>
                Enter Puter Auth Token:
              </Text>
              <TextInput
                style={[
                  styles.tokenInput,
                  {
                    color: colors.onSurface,
                    backgroundColor: colors.surfaceHigh,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="Paste token from puter.com/dashboard"
                placeholderTextColor={colors.onSurfaceVariant}
                value={tokenInput}
                onChangeText={setTokenInput}
                secureTextEntry
                autoCapitalize="none"
              />

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <TouchableOpacity onPress={openPuterDashboard}>
                  <Text style={{ fontSize: 12, color: colors.primary }}>
                    Get token from puter.com ↗
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.submitTokenBtn, { backgroundColor: colors.primary }]}
                  onPress={handleManualTokenSubmit}
                >
                  <Text style={{ fontSize: 13, fontWeight: '600', color: '#003640' }}>
                    Connect
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}

          {/* Privacy Note */}
          <Text style={{ fontSize: 11, color: colors.onSurfaceVariant, marginTop: 20, textAlign: 'center' }}>
            🔒 Credentials are authenticated directly with Puter. PolyTalk never sees your password.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 14,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 18,
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
  },
  manualSection: {
    marginTop: 16,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  tokenInput: {
    height: 42,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 13,
    marginTop: 8,
  },
  submitTokenBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
});
