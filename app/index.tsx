import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A', // Dark Navy
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#06B6D4', // Cyan accent
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#A855F7', // Purple accent
    marginBottom: 48,
  },
  statusBox: {
    backgroundColor: '#1E293B',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    width: '100%',
    maxWidth: 400,
  },
  statusTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  statusText: {
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 8,
  },
});
