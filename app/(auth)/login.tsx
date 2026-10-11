import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Switch, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Screen, Box } from '@/components/layout';
import { Text, TextInput } from '@/components/ui';
import { Dialog } from '@/components/feedback/Dialog';

import { useAppColors, ThemeContext } from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { supabase } from '@/utils/supabase';
import { PuterConnectModal } from '@/components/PuterConnectModal';
import { 
  startPuterBrowserAuth, 
  loginOrRegisterWithPuter, 
  getStoredPuterToken, 
  PuterProfile 
} from '@/services/puter';

type AuthMode = 'signIn' | 'register';

export default function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPuterAuthLoading, setIsPuterAuthLoading] = useState(false);
  const [isPuterModalOpen, setIsPuterModalOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({});

  const { isDark: isSystemDark } = React.useContext(ThemeContext);
  const colors = useAppColors();

  const toggleMode = (newMode: AuthMode) => {
    setMode(newMode);
    setErrors({});
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (mode === 'register' && !name) {
      newErrors.name = 'Name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      if (mode === 'signIn') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setErrors({ email: error.message });
        } else {
          router.replace('/(tabs)');
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } }
        });
        if (error) {
          setErrors({ email: error.message });
        } else {
          router.replace('/(tabs)');
        }
      }
    } catch (err: any) {
      setErrors({ email: err.message || 'Authentication error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePuterAuth = async () => {
    setIsPuterAuthLoading(true);
    try {
      const res = await startPuterBrowserAuth(null);
      if (res.success && res.token && res.user) {
        const loginRes = await loginOrRegisterWithPuter(res.token, res.user);
        if (loginRes.success) {
          router.replace('/(tabs)');
          return;
        } else {
          setErrors({ email: loginRes.error || 'Puter login failed.' });
        }
      } else {
        setIsPuterModalOpen(true);
      }
    } catch {
      setIsPuterModalOpen(true);
    } finally {
      setIsPuterAuthLoading(false);
    }
  };

  const handlePuterConnectedFromModal = async (profile: PuterProfile) => {
    const token = await getStoredPuterToken(null);
    if (token) {
      const loginRes = await loginOrRegisterWithPuter(token, profile);
      if (loginRes.success) {
        router.replace('/(tabs)');
      } else {
        setErrors({ email: loginRes.error || 'Puter login failed.' });
      }
    }
  };

  const handleOAuth = () => {
    setShowDialog(true);
  };

  const handleGuest = () => {
    setShowDialog(false);
    router.replace('/(tabs)');
  };

  const renderPasswordRightAccessory = () => (
    <TouchableOpacity 
      onPress={() => setShowPassword(!showPassword)}
      accessibilityRole="button"
      accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
      activeOpacity={0.7}
      style={{ padding: 4 }}
    >
      <MaterialIcons 
        name={showPassword ? 'visibility' : 'visibility-off'} 
        size={20} 
        color={colors.textSecondary} 
      />
    </TouchableOpacity>
  );

  return (
    <Screen bg="background" padded keyboardAware>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          
          {/* Segmented Tabs */}
          <View style={[styles.tabsContainer, { backgroundColor: isSystemDark ? '#161B29' : 'rgba(0,0,0,0.04)' }]}>
            <TouchableOpacity 
              activeOpacity={0.8} 
              onPress={() => toggleMode('signIn')} 
              style={styles.tabWrap}
            >
              {mode === 'signIn' ? (
                <LinearGradient
                  colors={['#06B6D4', '#06B6D4', '#8B5CF6']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={[styles.tab, styles.tabActive]}
                >
                  <Text variant="label" weight="bold" color="textInverse">Sign In</Text>
                </LinearGradient>
              ) : (
                <View style={[styles.tab, styles.tabInactive]}>
                  <Text variant="label" weight="semibold" color="textSecondary">Sign In</Text>
                </View>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              activeOpacity={0.8} 
              onPress={() => toggleMode('register')} 
              style={styles.tabWrap}
            >
              {mode === 'register' ? (
                <LinearGradient
                  colors={['#06B6D4', '#06B6D4', '#8B5CF6']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={[styles.tab, styles.tabActive]}
                >
                  <Text variant="label" weight="bold" color="textInverse">Create Account</Text>
                </LinearGradient>
              ) : (
                <View style={[styles.tab, styles.tabInactive]}>
                  <Text variant="label" weight="semibold" color="textSecondary">Create Account</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            {mode === 'register' && (
              <Box style={{ marginBottom: 16 }}>
                <TextInput
                  label="Full Name"
                  placeholder="Alex Morgan"
                  value={name}
                  onChangeText={(text) => { setName(text); setErrors(prev => ({ ...prev, name: undefined })) }}
                  error={errors.name}
                  autoCapitalize="words"
                  editable={!isLoading}
                />
              </Box>
            )}

            <Box style={{ marginBottom: 16 }}>
              <TextInput
                label="Email Address"
                placeholder="name@domain.com"
                value={email}
                onChangeText={(text) => { setEmail(text); setErrors(prev => ({ ...prev, email: undefined })) }}
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!isLoading}
                rightAccessory={
                  email && !errors.email && /\S+@\S+\.\S+/.test(email) ? (
                    <MaterialIcons name="check-circle" size={18} color="#06B6D4" style={{ padding: 4 }} />
                  ) : undefined
                }
              />
            </Box>

            <Box style={{ marginBottom: 2 }}>
              <View style={styles.passwordHeader}>
                <Text variant="label" weight="semibold" color="textPrimary">Password</Text>
                {mode === 'signIn' && (
                  <TouchableOpacity activeOpacity={0.7}>
                    <Text variant="label" weight="semibold" color="primary">Forgot Password?</Text>
                  </TouchableOpacity>
                )}
              </View>
              <TextInput
                placeholder="Enter password"
                value={password}
                onChangeText={(text) => { setPassword(text); setErrors(prev => ({ ...prev, password: undefined })) }}
                error={errors.password}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!isLoading}
                rightAccessory={renderPasswordRightAccessory()}
                style={password && !showPassword ? { letterSpacing: 4 } : undefined}
              />
            </Box>

            {/* Biometric Fast Pass (Only for Sign In) */}
            {mode === 'signIn' && (
              <View style={[styles.biometricCard, { backgroundColor: isSystemDark ? '#161B29' : 'rgba(0,0,0,0.02)' }]}>
                <View style={styles.biometricLeft}>
                  <View style={[styles.biometricIconWrap, { backgroundColor: isSystemDark ? '#252A38' : 'rgba(0,0,0,0.06)' }]}>
                    <MaterialIcons name="fingerprint" size={20} color="#06B6D4" />
                  </View>
                  <View>
                    <Text variant="label" weight="semibold" color="textPrimary" style={{ fontSize: 14 }}>Biometric Fast Pass</Text>
                    <Text variant="bodySmall" color="textSecondary" style={{ fontSize: 12 }}>Face ID / Fingerprint</Text>
                  </View>
                </View>
                <Switch
                  value={biometricEnabled}
                  onValueChange={setBiometricEnabled}
                  trackColor={{ false: isSystemDark ? '#252A38' : '#D1D5DB', true: '#06B6D4' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSubmit}
              disabled={isLoading}
              style={[styles.gradientButtonWrap, { marginTop: mode === 'signIn' ? 16 : 24, opacity: isLoading ? 0.7 : 1 }]}
            >
              <LinearGradient
                colors={['#06B6D4', '#06B6D4', '#8B5CF6']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Text variant="body" weight="bold" color="textInverse" style={{ marginRight: 8, fontSize: 16 }}>
                  {mode === 'signIn' ? 'Sign In' : 'Create Account'}
                </Text>
                <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerWrap}>
            <View style={[styles.dividerLine, { backgroundColor: isSystemDark ? '#252A38' : '#E5E7EB' }]} />
            <Text variant="caption" weight="semibold" color="textSecondary" style={{ textTransform: 'uppercase', paddingHorizontal: 12 }}>
              or continue with
            </Text>
            <View style={[styles.dividerLine, { backgroundColor: isSystemDark ? '#252A38' : '#E5E7EB' }]} />
          </View>

          {/* OAuth Buttons */}
          <View style={styles.oauthContainer}>
            {/* Continue with Puter Button */}
            <TouchableOpacity 
              activeOpacity={0.8} 
              onPress={handlePuterAuth}
              disabled={isPuterAuthLoading}
              style={[
                styles.oauthBtn, 
                styles.puterBtn,
                { 
                  backgroundColor: isSystemDark ? '#083344' : '#ECFEFF',
                  borderColor: '#06B6D4',
                  borderWidth: 1.5,
                }
              ]}
            >
              {isPuterAuthLoading ? (
                <ActivityIndicator size="small" color="#06B6D4" />
              ) : (
                <>
                  <MaterialIcons name="auto-awesome" size={20} color="#06B6D4" />
                  <Text variant="label" weight="bold" color="textPrimary" style={{ fontSize: 16 }}>
                    Continue with Puter
                  </Text>
                  <View style={styles.puterBadge}>
                    <Text variant="caption" weight="bold" style={{ color: '#0891B2', fontSize: 11 }}>
                      Free AI
                    </Text>
                  </View>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              activeOpacity={0.8} 
              onPress={handleOAuth}
              style={[styles.oauthBtn, { backgroundColor: colors.surfaceElevated }]}
            >
              <Svg width="16" height="16" viewBox="0 0 24 24">
                <Path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" fill="#4285F4"/>
                <Path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z" fill="#34A853"/>
                <Path d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12c0 1.97.45 3.82 1.25 5.42l4.03-3.15Z" fill="#FBBC05"/>
                <Path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z" fill="#EA4335"/>
              </Svg>
              <Text variant="label" weight="semibold" color="textPrimary" style={{ fontSize: 16 }}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              activeOpacity={0.8} 
              onPress={handleOAuth}
              style={[styles.oauthBtn, { backgroundColor: colors.surfaceElevated }]}
            >
              <Svg width="16" height="16" viewBox="0 0 170 170" fill={isSystemDark ? '#FFFFFF' : '#000000'}>
                <Path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-8.08-12.28-14.07-26.43-17.97-42.45-3.9-16.02-3.84-29.83.19-41.44 4.02-11.61 10.7-20.91 20.02-27.91 9.32-7 19.8-10.63 31.42-10.89 4.13 0 9.07 1.08 14.81 3.24 5.74 2.16 9.42 3.24 11.05 3.24 1.74 0 5.69-1.14 11.85-3.41 6.16-2.27 11.37-3.23 15.64-2.88 12.06.87 22.14 5.48 30.23 13.84-10.76 6.52-16.03 15.65-15.82 27.38.22 10.11 4.18 18.57 11.89 25.37 7.71 6.8 16.89 10.67 27.53 11.61-2.28 6.96-5.05 14.04-8.31 21.25zM119.22 33.15c0-7.39 2.66-14.4 7.99-21.03 5.33-6.63 11.95-11.03 19.87-13.2 1.09 7.82-.71 15.11-5.4 21.87-4.69 6.76-11.08 11.19-19.18 13.3-1.09-.32-2.18-.54-3.28-.94z"/>
              </Svg>
              <Text variant="label" weight="semibold" color="textPrimary" style={{ fontSize: 16 }}>Continue with Apple</Text>
            </TouchableOpacity>
          </View>

          {/* Trust Card */}
          <View style={[styles.trustCard, { backgroundColor: isSystemDark ? '#161B29' : 'rgba(0,0,0,0.02)' }]}>
            <View style={[styles.trustIconWrap, { backgroundColor: isSystemDark ? '#252A38' : 'rgba(0,0,0,0.06)' }]}>
              <MaterialIcons name="verified-user" size={18} color="#06B6D4" />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="label" weight="semibold" color="textPrimary" style={{ fontSize: 14 }}>Private & Adaptive AI Voice Sessions</Text>
              <Text variant="bodySmall" color="textSecondary" style={{ marginTop: 4, lineHeight: 18 }}>
                Voice data is processed instantaneously for accent guidance and is never sold or retained for third-party modeling.
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text variant="bodySmall" color="textSecondary" align="center">
              By continuing, you agree to PolyTalk's{"\n"}
              <Text variant="bodySmall" color="primary" style={{ textDecorationLine: 'underline' }}>Terms of Service</Text>
              {' & '}
              <Text variant="bodySmall" color="primary" style={{ textDecorationLine: 'underline' }}>Privacy Policy</Text>
            </Text>
            <TouchableOpacity onPress={handleGuest} style={{ marginTop: 24, alignSelf: 'center', padding: 8 }}>
              <Text variant="label" color="textSecondary" weight="semibold">Continue as Guest (Dev)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Dialog
        visible={showDialog}
        title="Authentication Not Configured"
        message="Supabase backend authentication is not yet integrated. Missing provider credentials and endpoint configuration. To test the rest of the app, use the 'Continue as Guest' option."
        primaryActionLabel="Got it"
        onPrimaryAction={() => setShowDialog(false)}
        onDismiss={() => setShowDialog(false)}
      />

      <PuterConnectModal
        visible={isPuterModalOpen}
        onClose={() => setIsPuterModalOpen(false)}
        onConnected={handlePuterConnectedFromModal}
        isDark={isSystemDark}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: 24,
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 12,
    marginBottom: 24,
  },
  tabWrap: {
    flex: 1,
  },
  tab: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    shadowColor: '#06B6D4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  tabInactive: {
    backgroundColor: 'transparent',
  },
  form: {
    width: '100%',
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  biometricCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 4,
  },
  biometricLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  biometricIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientButtonWrap: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#06B6D4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  gradientButton: {
    flexDirection: 'row',
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dividerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  oauthContainer: {
    flexDirection: 'column',
    gap: 10,
  },
  oauthBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    height: 48,
    borderRadius: 12,
  },
  puterBtn: {
    marginBottom: 4,
  },
  puterBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    marginLeft: 4,
  },
  trustCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    marginTop: 32,
  },
  trustIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    marginTop: 32,
    marginBottom: 16,
  }
});


