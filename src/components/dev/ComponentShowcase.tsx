import React, { useState } from 'react';
import { Box, Stack, Divider, Row } from '@/components/layout';
import { Text, Button, TextInput, Card, Badge } from '@/components/ui';
import { Dialog, BottomSheet, AlertBanner, EmptyState, LoadingState } from '@/components/feedback';
import { theme } from '@/theme';

export function ComponentShowcase() {
  const [testText, setTestText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);

  const handleTestSubmit = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleDialogAction = () => {
    setDialogLoading(true);
    setTimeout(() => {
      setDialogLoading(false);
      setDialogVisible(false);
    }, 1000);
  };

  return (
    <Stack gap="xl" style={{ width: '100%', maxWidth: theme.layout.contentMaxWidth }}>
      
      <Card variant="outlined">
        <Text variant="title" color="textPrimary" style={{ marginBottom: theme.spacing.md }}>
          Inputs & Buttons
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
          <Button label="Primary Action" onPress={handleTestSubmit} loading={isLoading} />
          <Button label="Secondary Action" variant="secondary" onPress={() => {}} />
          <Button label="Outline Button" variant="outline" onPress={() => {}} />
          <Button label="Destructive Action" variant="destructive" onPress={() => {}} disabled={isLoading} />
        </Stack>
      </Card>

      <Card variant="default">
        <Text variant="title" color="textPrimary" style={{ marginBottom: theme.spacing.md }}>
          Badges & Status
        </Text>
        <Stack gap="md">
          <Row gap="sm" style={{ flexWrap: 'wrap' }}>
            <Badge label="Default" />
            <Badge label="Success" variant="success" />
            <Badge label="Warning" variant="warning" />
            <Badge label="Error" variant="error" />
            <Badge label="Info" variant="info" />
          </Row>
          <Row gap="md" align="center">
            <Text variant="bodySmall" color="textSecondary">Status Dots:</Text>
            <Badge variant="success" dotOnly />
            <Badge variant="warning" dotOnly />
            <Badge variant="error" dotOnly />
            <Badge variant="info" dotOnly />
          </Row>
        </Stack>
      </Card>

      <Card variant="elevated">
        <Text variant="title" color="textPrimary" style={{ marginBottom: theme.spacing.md }}>
          Cards & Dividers
        </Text>
        <Text variant="body" color="textSecondary" style={{ marginBottom: theme.spacing.md }}>
          This is an elevated card. Below is a horizontal divider.
        </Text>
        <Divider />
        <Box paddingVertical="md">
          <Row justify="space-between">
            <Text variant="label">Item 1</Text>
            <Text variant="label">Item 2</Text>
          </Row>
        </Box>
        <Divider />
        <Box paddingVertical="md">
          <Card variant="default" onPress={() => {}} padding="md">
            <Text variant="label" color="primary">Interactive Default Card</Text>
          </Card>
        </Box>
      </Card>

      <Card variant="default">
        <Text variant="title" color="textPrimary" style={{ marginBottom: theme.spacing.md }}>
          Modals & Overlays
        </Text>
        <Stack gap="md">
          <Button label="Open Dialog" variant="secondary" onPress={() => setDialogVisible(true)} />
          <Button label="Open Bottom Sheet" variant="outline" onPress={() => setSheetVisible(true)} />
        </Stack>
      </Card>

      <Card variant="default">
        <Text variant="title" color="textPrimary" style={{ marginBottom: theme.spacing.md }}>
          Feedback Components
        </Text>
        <Stack gap="md">
          <AlertBanner variant="info" message="This is an informational alert." />
          <AlertBanner variant="success" message="Operation completed successfully." />
          <AlertBanner variant="warning" message="Please check your connection." />
          <AlertBanner variant="error" message="A critical error occurred." />
          
          <Divider />
          <EmptyState 
            title="No Data Found" 
            message="There are no items to display at this time." 
            actionLabel="Refresh" 
            onAction={() => {}} 
          />
          
          <Divider />
          <LoadingState message="Fetching your data..." />
        </Stack>
      </Card>

      <Dialog
        visible={dialogVisible}
        title="Confirm Deletion"
        message="Are you sure you want to delete this item? This action cannot be undone."
        primaryActionLabel="Cancel"
        onPrimaryAction={() => setDialogVisible(false)}
        destructiveActionLabel="Delete"
        onDestructiveAction={handleDialogAction}
        onDismiss={() => setDialogVisible(false)}
        isActionLoading={dialogLoading}
      />

      <BottomSheet
        visible={sheetVisible}
        onDismiss={() => setSheetVisible(false)}
        scrollable
      >
        <Stack gap="md">
          <Text variant="title" color="textPrimary">Bottom Sheet Content</Text>
          <Text variant="body" color="textSecondary">
            This is a native bottom sheet using React Native Modal.
            You can put any interactive content in here, and it will scroll if the content gets too long.
          </Text>
          <Button label="Close Sheet" onPress={() => setSheetVisible(false)} />
          <Box marginVertical="xl" />
        </Stack>
      </BottomSheet>
      <Card variant="elevated">
        <Text variant="title" color="textPrimary" style={{ marginBottom: theme.spacing.md }}>
          Keyboard & Safe Area Test
        </Text>
        <Text variant="bodySmall" color="textSecondary" style={{ marginBottom: theme.spacing.lg }}>
          Scroll down and focus these inputs. The screen should avoid the keyboard on iOS and resize on Android, keeping inputs visible.
        </Text>
        <Stack gap="md">
          <TextInput 
            label="Email Address" 
            placeholder="test@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput 
            label="Access Code" 
            placeholder="Enter code"
            secureTextEntry
          />
          <Button label="Submit Verification" onPress={() => {}} />
        </Stack>
      </Card>

    </Stack>
  );
}
