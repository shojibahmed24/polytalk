import React from 'react';
import { Screen, Box, Stack } from '@/components/layout';
import { Text, Card } from '@/components/ui';
import { theme } from '@/theme';
import { ComponentShowcase } from '@/components/dev/ComponentShowcase';

export default function IndexScreen() {
  return (
    <Screen centerContent scrollable keyboardAware>
      <Stack align="center" gap="sm" style={{ width: '100%', maxWidth: theme.layout.contentMaxWidth, paddingVertical: theme.spacing.xl }}>
        <Text variant="display" color="primary">PolyTalk</Text>
        
        <Box marginVertical="lg">
          <Text variant="title" color="secondary">AI Language Learning</Text>
        </Box>
        
        <Card variant="elevated" style={{ width: '100%', marginBottom: theme.spacing.xl }}>
          <Box marginVertical="sm">
            <Text variant="label" color="textPrimary">App Foundation Status</Text>
          </Box>
          <Stack gap="sm">
            <Text variant="bodySmall" color="textSecondary">✓ Native Architecture Initialized</Text>
            <Text variant="bodySmall" color="textSecondary">✓ Expo Router Configured</Text>
            <Text variant="bodySmall" color="textSecondary">✓ TypeScript Strict Mode</Text>
            <Text variant="bodySmall" color="textSecondary">✓ Design Tokens Applied</Text>
            <Text variant="bodySmall" color="textSecondary">✓ Form Primitives Added</Text>
            <Text variant="bodySmall" color="textSecondary">✓ Feedback & Modals Implemented</Text>
          </Stack>
        </Card>

        <Box style={{ width: '100%' }}>
          <Text variant="label" color="textPrimary" style={{ marginBottom: theme.spacing.md }}>
            Interactive UI Showcase (Dev Only)
          </Text>
          <ComponentShowcase />
        </Box>
      </Stack>
    </Screen>
  );
}
