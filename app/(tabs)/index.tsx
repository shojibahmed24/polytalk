import React from 'react';
import { Screen, Stack, Box } from '@/components/layout';
import { Text, Card, Button } from '@/components/ui';
import { router, Href } from 'expo-router';
import { theme } from '@/theme';

export default function HomeScreen() {
  return (
    <Screen centerContent scrollable padded>
      <Stack align="center" gap="lg" style={{ width: '100%', maxWidth: theme.layout.contentMaxWidth }}>
        <Text variant="display" color="primary">PolyTalk Home</Text>
        
        <Card variant="elevated" style={{ width: '100%' }}>
          <Stack gap="sm">
            <Text variant="title">Welcome</Text>
            <Text variant="body" color="textSecondary">
              This is the Home tab scaffold (S002). The product functionality will be built here in future phases.
            </Text>
          </Stack>
        </Card>

        <Box marginVertical="xl" style={{ width: '100%' }}>
          <Button 
            label="Open Developer Showcase" 
            variant="outline" 
            onPress={() => router.push('/dev' as Href)} 
          />
        </Box>
      </Stack>
    </Screen>
  );
}
