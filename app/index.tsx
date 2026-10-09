import React, { useState } from 'react';
import { Screen, Box, Stack } from '@/components/layout';
import { Text, Button, TextInput } from '@/components/ui';
import { theme } from '@/theme';

export default function IndexScreen() {
  const [testText, setTestText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTestSubmit = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <Screen centerContent scrollable>
      <Stack align="center" gap="sm" style={{ width: '100%', maxWidth: theme.layout.maxWidth, paddingVertical: theme.spacing.xl }}>
        <Text variant="display" color="primary">PolyTalk</Text>
        
        <Box marginVertical="lg">
          <Text variant="title" color="secondary">AI Language Learning</Text>
        </Box>
        
        <Box 
          bg="surface" 
          padding="lg" 
          radius="lg" 
          borderWidth={1} 
          borderColor="border" 
          style={{ width: '100%', marginBottom: theme.spacing.xl }}
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

        <Box 
          bg="surface" 
          padding="lg" 
          radius="lg" 
          borderWidth={1} 
          borderColor="border" 
          style={{ width: '100%' }}
        >
          <Text variant="label" color="textPrimary" style={{ marginBottom: theme.spacing.md }}>
            Interactive UI Showcase
          </Text>
          
          <Stack gap="md">
            <TextInput 
              label="Test Input" 
              placeholder="Type something..."
              value={testText}
              onChangeText={setTestText}
              helperText="This is a fully controlled text input."
            />
            
            <TextInput 
              label="Secure Input" 
              placeholder="Password"
              secureTextEntry
              error={testText.length > 0 && testText.length < 3 ? 'Minimum 3 characters required' : undefined}
            />

            <Button 
              label="Primary Action" 
              onPress={handleTestSubmit} 
              loading={isLoading} 
            />
            
            <Button 
              label="Secondary Action" 
              variant="secondary" 
              onPress={() => {}} 
            />
            
            <Button 
              label="Outline Button" 
              variant="outline" 
              onPress={() => {}} 
            />
            
            <Button 
              label="Destructive Action" 
              variant="destructive" 
              onPress={() => {}} 
              disabled={isLoading}
            />
          </Stack>
        </Box>
      </Stack>
    </Screen>
  );
}
