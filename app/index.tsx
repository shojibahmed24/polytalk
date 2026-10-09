import React from 'react';
import { Screen, Box, Stack } from '@/components/layout';
import { Text } from '@/components/ui';
import { theme } from '@/theme';

export default function IndexScreen() {
  return (
    <Screen centerContent scrollable>
      <Stack align="center" gap="sm">
        <Text variant="display" color="primary">PolyTalk</Text>
        
        <Box marginVertical="xxl">
          <Text variant="title" color="secondary">AI Language Learning</Text>
        </Box>
        
        <Box 
          bg="surface" 
          padding="lg" 
          radius="lg" 
          borderWidth={1} 
          borderColor="border" 
          style={{ width: '100%', maxWidth: theme.layout.maxWidth }}
        >
          <Box marginVertical="sm">
            <Text variant="label" color="textPrimary">App Foundation Status</Text>
          </Box>
          <Stack gap="sm">
            <Text variant="bodySmall" color="textSecondary">✓ Native Architecture Initialized</Text>
            <Text variant="bodySmall" color="textSecondary">✓ Expo Router Configured</Text>
            <Text variant="bodySmall" color="textSecondary">✓ TypeScript Strict Mode</Text>
            <Text variant="bodySmall" color="textSecondary">✓ Design Tokens Applied</Text>
            <Text variant="bodySmall" color="textSecondary">✓ Reusable UI Components Added</Text>
          </Stack>
        </Box>
      </Stack>
    </Screen>
  );
}
