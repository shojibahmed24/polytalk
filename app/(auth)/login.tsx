import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Screen, Stack as LayoutStack, Box } from '@/components/layout';
import { Text, Button, TextInput } from '@/components/ui';
import { Dialog } from '@/components/feedback/Dialog';
import { theme } from '@/theme';
import { SymbolView } from 'expo-symbols';

// Local mock states (S016: Sign In, S017: Register)
type AuthMode = 'signIn' | 'register';

export default function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // S019: Password Visibility Toggle State
  const [showPassword, setShowPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});

  const toggleMode = () => {
    setMode(mode === 'signIn' ? 'register' : 'signIn');
    setErrors({});
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    
    // Basic email validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Basic password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (mode === 'register') {
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return; // S018: Form Validation Error State

    setIsLoading(true);

    // S020: Submission Mock State
    // Simulating a network request to a non-existent auth backend
    setTimeout(() => {
      setIsLoading(false);
      setShowDialog(true);
    }, 1000);
  };

  const handleGuest = () => {
    // Allows developer/tester to bypass the auth wall to test tabs
    setShowDialog(false);
    router.replace('/(tabs)');
  };

  const renderPasswordRightAccessory = () => (
    <TouchableOpacity 
      onPress={() => setShowPassword(!showPassword)}
      accessibilityRole="button"
      accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
      activeOpacity={0.7}
    >
      <SymbolView 
        name={showPassword ? 'eye.slash.fill' : 'eye.fill'} 
        size={20} 
        tintColor={theme.colors.textSecondary} 
      />
    </TouchableOpacity>
  );

  return (
    <Screen bg="background" padded keyboardAware>
      <View style={styles.container}>
        
        {/* Header / Title */}
        <Box style={styles.header}>
          <View style={styles.iconCircle} importantForAccessibility="no">
            <SymbolView name="person.crop.circle.fill" size={48} tintColor={theme.colors.primary} />
          </View>
          <Text variant="display" color="textPrimary" align="center">
            {mode === 'signIn' ? 'Welcome Back' : 'Create Account'}
          </Text>
          <Text variant="body" color="textSecondary" align="center" style={styles.subtitle}>
            {mode === 'signIn' 
              ? 'Sign in to continue your language journey' 
              : 'Join PolyTalk and start speaking today'}
          </Text>
        </Box>

        {/* Form Fields */}
        <LayoutStack gap="md" style={styles.form}>
          <TextInput
            label="Email Address"
            placeholder="you@example.com"
            value={email}
            onChangeText={(text) => { setEmail(text); setErrors(prev => ({ ...prev, email: undefined })) }}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            editable={!isLoading}
          />

          <TextInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={(text) => { setPassword(text); setErrors(prev => ({ ...prev, password: undefined })) }}
            error={errors.password}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            editable={!isLoading}
            rightAccessory={renderPasswordRightAccessory()}
          />

          {mode === 'register' && (
            <TextInput
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChangeText={(text) => { setConfirmPassword(text); setErrors(prev => ({ ...prev, confirmPassword: undefined })) }}
              error={errors.confirmPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              editable={!isLoading}
            />
          )}

          <Button 
            label={mode === 'signIn' ? 'Sign In' : 'Create Account'} 
            variant="primary" 
            size="lg" 
            onPress={handleSubmit}
            loading={isLoading}
            style={styles.submitButton}
          />
        </LayoutStack>

        {/* Footer Links */}
        <LayoutStack gap="lg" align="center" style={styles.footer}>
          <TouchableOpacity onPress={toggleMode} disabled={isLoading} accessibilityRole="button">
            <Text variant="body" color="textSecondary">
              {mode === 'signIn' ? "Don't have an account? " : 'Already have an account? '}
              <Text variant="body" color="primary" weight="bold">
                {mode === 'signIn' ? 'Sign Up' : 'Sign In'}
              </Text>
            </Text>
          </TouchableOpacity>

          <Button 
            label="Continue as Guest (Dev)" 
            variant="ghost" 
            size="sm" 
            onPress={handleGuest}
            disabled={isLoading}
          />
        </LayoutStack>
      </View>

      <Dialog
        visible={showDialog}
        title="Authentication Not Configured"
        message="Backend authentication is not yet integrated. This is a local UI demonstration. To test the rest of the app, use the 'Continue as Guest' option."
        primaryActionLabel="Got it"
        onPrimaryAction={() => setShowDialog(false)}
        onDismiss={() => setShowDialog(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 480, // Auth forms look better when narrower than full contentMaxWidth
    alignSelf: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  subtitle: {
    marginTop: theme.spacing.sm,
  },
  form: {
    width: '100%',
  },
  submitButton: {
    marginTop: theme.spacing.sm,
  },
  footer: {
    marginTop: theme.spacing.xxl,
  },
});
