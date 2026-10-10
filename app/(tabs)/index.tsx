import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { router } from 'expo-router';
import { Screen, Stack, Box } from '@/components/layout';
import { Text, Card, Button } from '@/components/ui';
import { theme } from '@/theme';
import { useAppColors } from '@/theme/colors';
import { SymbolView, SFSymbol } from 'expo-symbols';

export default function HomeScreen() {
  const colors = useAppColors();
  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [slideAnim] = useState(() => new Animated.Value(12));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Screen bg="background" edges={['top', 'left', 'right']} style={styles.screen}>
      <Animated.ScrollView 
        contentContainerStyle={styles.scrollContent}
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
        showsVerticalScrollIndicator={false}
      >
        <Stack gap="xl" style={styles.container}>
          
          {/* A. Top Header */}
          <Box direction="row" justify="space-between" align="center" style={styles.header}>
            <Stack gap="xs" style={{ flex: 1 }}>
              <Text variant="label" color="textSecondary" weight="medium">
                {getGreeting()}
              </Text>
              <Text variant="heading" color="textPrimary">
                Ready to speak with confidence?
              </Text>
              <Text variant="bodySmall" color="textSecondary" style={styles.subtitle}>
                Let's continue your language journey today.
              </Text>
            </Stack>
            
            <TouchableOpacity 
              onPress={() => router.push('/(tabs)/profile')}
              style={styles.avatarButton}
              accessibilityLabel="Go to Profile"
              accessibilityRole="button"
              activeOpacity={0.7}
            >
              <SymbolView name="person.circle.fill" size={40} tintColor={colors.secondary} />
            </TouchableOpacity>
          </Box>

          {/* B. Primary Learning Action */}
          <TouchableOpacity activeOpacity={0.9} onPress={() => router.push({ pathname: '/(app)/chat/[id]', params: { id: 'spanish' } } as never)}>
            <View style={[styles.primaryActionCard, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
              <Box direction="row" justify="space-between" align="flex-start">
                <View style={styles.waveformIcon}>
                  <SymbolView name="sparkles" size={32} tintColor={colors.primary} />
                  <View style={[styles.violetDot, { backgroundColor: colors.secondary }]} />
                </View>
                <SymbolView name="chevron.right" size={24} tintColor={colors.textSecondary} />
              </Box>
              
              <Stack gap="xs" style={styles.primaryActionText}>
                <Text variant="title" color="textPrimary">AI Conversation</Text>
                <Text variant="body" color="textSecondary">
                  Practice speaking naturally. Get instant pronunciation and grammar feedback.
                </Text>
              </Stack>
              
              <Button 
                label="Start practicing" 
                variant="primary" 
                onPress={() => router.push({ pathname: '/(app)/chat/[id]', params: { id: 'spanish' } } as never)}
                style={styles.primaryActionBtn}
              />
            </View>
          </TouchableOpacity>

          {/* C. Quick Actions */}
          <View>
            <Text variant="title" color="textPrimary" style={styles.sectionTitle}>
              Quick Actions
            </Text>
            <View style={styles.quickActionGrid}>
              <QuickActionCard 
                title="Tutor"
                icon="text.bubble.fill"
                onPress={() => router.push({ pathname: '/(app)/chat/[id]', params: { id: 'spanish' } } as never)}
              />
              <QuickActionCard 
                title="Translate"
                icon="globe"
                onPress={() => router.push('/(tabs)/translate')}
              />
              <QuickActionCard 
                title="Grammar"
                icon="text.book.closed.fill"
                onPress={() => router.push('/(app)/grammar' as never)}
              />
            </View>
          </View>

          {/* D. Learning Progress Section */}
          <View>
            <Text variant="title" color="textPrimary" style={styles.sectionTitle}>
              Your Progress
            </Text>
            <Card variant="default" style={[styles.progressCard, { borderColor: colors.border }]}>
              <Box direction="row" align="center" gap="md">
                <View style={[styles.progressIcon, { backgroundColor: colors.surfaceElevated }]}>
                  <SymbolView name="chart.bar.fill" size={24} tintColor={colors.secondary} />
                </View>
                <Stack gap="xs" style={{ flex: 1 }}>
                  <Text variant="body" weight="semibold" color="textPrimary">Getting Started</Text>
                  <Text variant="bodySmall" color="textSecondary">
                    Your learning journey begins here. Complete your first conversation to track your progress.
                  </Text>
                </Stack>
              </Box>
            </Card>
          </View>

          {/* Dev Showcase Link */}
          <Box align="center" marginVertical="lg">
            <Button 
              label="Developer Showcase" 
              variant="ghost"
              size="sm"
              onPress={() => router.push('/dev')}
            />
          </Box>
        </Stack>
      </Animated.ScrollView>
    </Screen>
  );
}

function QuickActionCard({ title, icon, onPress }: { title: string, icon: SFSymbol, onPress: () => void }) {
  const colors = useAppColors();
  
  return (
    <TouchableOpacity 
      activeOpacity={0.7} 
      style={[styles.quickActionCard, { backgroundColor: colors.surface, borderColor: colors.border }]} 
      onPress={onPress}
      accessibilityRole="button"
    >
      <View style={styles.quickActionIcon}>
        <SymbolView name={icon} size={28} tintColor={colors.primary} />
      </View>
      <Text variant="bodySmall" weight="semibold" color="textPrimary" align="center">
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.layout.screenPadding,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
    alignItems: 'center',
  },
  container: {
    width: '100%',
    maxWidth: 680,
  },
  header: {
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    marginTop: 2,
  },
  avatarButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.md,
  },
  primaryActionCard: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: 20,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  waveformIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(6, 182, 212, 0.1)', // Primary tint
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  violetDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.secondary,
  },
  primaryActionText: {
    marginBottom: theme.spacing.lg,
  },
  primaryActionBtn: {
    width: '100%',
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  quickActionGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  quickActionCard: {
    flex: 1,
    minWidth: 100,
    maxWidth: 160,
    backgroundColor: theme.colors.surface,
    borderRadius: 18,
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: 110,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(6, 182, 212, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  progressCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 18,
  },
  progressIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(139, 92, 246, 0.1)', // Secondary (violet) tint
    justifyContent: 'center',
    alignItems: 'center',
  },
});
