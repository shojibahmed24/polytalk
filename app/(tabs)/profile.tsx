import React from 'react';
import { Screen, Stack } from '@/components/layout';
import { Text, Card } from '@/components/ui';
import { theme } from '@/theme';

export default function ProfileScreen() {
  return (
    <Screen centerContent scrollable padded>
      <Stack align="center" gap="lg" style={{ width: '100%', maxWidth: theme.layout.contentMaxWidth }}>
        <Card variant="elevated" style={{ width: '100%' }}>
          <Stack gap="sm">
            <Text variant="title">Profile Tab</Text>
            <Text variant="body" color="textSecondary">
              Development scaffold for the user profile. Authentication, settings, and progress analytics will reside here.
            </Text>
          </Stack>
        </Card>
      </Stack>
    </Screen>
  );
}
