import React from 'react';
import { Screen, Stack } from '@/components/layout';
import { Text, Card } from '@/components/ui';
import { theme } from '@/theme';

export default function TranslateScreen() {
  return (
    <Screen centerContent scrollable padded>
      <Stack align="center" gap="lg" style={{ width: '100%', maxWidth: theme.layout.contentMaxWidth }}>
        <Card variant="elevated" style={{ width: '100%' }}>
          <Stack gap="sm">
            <Text variant="title">Translate Tab</Text>
            <Text variant="body" color="textSecondary">
              Development scaffold for the real-time translation UI. WebRTC and speech services will be integrated here later.
            </Text>
          </Stack>
        </Card>
      </Stack>
    </Screen>
  );
}
