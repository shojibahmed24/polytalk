import React, { useState, useEffect } from 'react';
import { Redirect } from 'expo-router';
import { Screen } from '@/components/layout';
import { LoadingState } from '@/components/feedback/LoadingState';

// Temporary local memory flag for onboarding completion.
// In Phase 4, this will be replaced by Supabase session state or persistent MMKV storage.
export const bootState = {
  hasCompletedOnboarding: false,
};

export default function BootScreen() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simulate initial boot tasks (e.g. font loading, token checking)
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <Screen centerContent bg="background">
        <LoadingState message="Loading PolyTalk..." />
      </Screen>
    );
  }

  if (!bootState.hasCompletedOnboarding) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}
