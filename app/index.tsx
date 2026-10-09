import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/theme';

export default function IndexScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <View style={styles.container}>
        <Text style={styles.brandTitle}>PolyTalk</Text>
        <Text style={styles.subtitle}>AI Language Learning</Text>
        
        <View style={styles.statusBox}>
          <Text style={styles.statusTitle}>App Foundation Status</Text>
          <Text style={styles.statusText}>✓ Native Architecture Initialized</Text>
          <Text style={styles.statusText}>✓ Expo Router Configured</Text>
          <Text style={styles.statusText}>✓ TypeScript Strict Mode</Text>
          <Text style={styles.statusText}>✓ Design Tokens Applied</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    padding: theme.layout.screenPadding,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: theme.typography.sizes.display,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.secondary,
    marginBottom: theme.spacing.xxl,
  },
  statusBox: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    width: '100%',
    maxWidth: theme.layout.maxWidth,
  },
  statusTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
    marginBottom: theme.spacing.lg,
  },
  statusText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.sm,
    marginBottom: theme.spacing.sm,
  },
});
