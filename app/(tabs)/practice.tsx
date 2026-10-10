import React from 'react';
import { Screen, Stack } from '@/components/layout';
import { Text, Card } from '@/components/ui';
import { theme } from '@/theme';

export default function LearnScreen() {
  return (
    <Screen centerContent scrollable padded>
      <Stack align="center" gap="lg" style={{ width: '100%', maxWidth: theme.layout.contentMaxWidth }}>
        <Card variant="elevated" style={{ width: '100%' }}>
          <Stack gap="sm">
            <Text variant="title">Learn Tab</Text>
            <Text variant="body" color="textSecondary">
              Development scaffold for the learning interface. AI-driven lessons and progress will be implemented in a subsequent phase.
            </Text>
          </Stack>
        </Card>
      </Stack>
    </Screen>
  );
}
