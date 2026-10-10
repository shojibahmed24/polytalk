import React from 'react';
import { useTranslation } from '@/utils/i18n';
import { Tabs } from 'expo-router';

import { Platform, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemeContext } from '@/theme/colors';

function TabIcon({ name, color }: { name: React.ComponentProps<typeof MaterialIcons>['name']; color: string }) {
  return (
    <View importantForAccessibility="no" accessibilityElementsHidden={true}>
      <MaterialIcons name={name} size={24} color={color as string} />
    </View>
  );
}

export default function TabLayout() {
  const { t } = useTranslation();
  const { isDark: isSystemDark } = React.useContext(ThemeContext);
  
  const st = {
    surfaceElevated: isSystemDark ? '#1A1F2D' : '#FFFFFF',
    border: isSystemDark ? '#303443' : '#E5E7EB',
    primary: isSystemDark ? '#4CD7F6' : '#06B6D4',
    textSecondary: isSystemDark ? '#BCC9CD' : '#6B7280',
    background: isSystemDark ? '#0E1320' : '#F8F9FC',
    textPrimary: isSystemDark ? '#DEE2F5' : '#111827',
  };

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: st.background,
        },
        headerTintColor: st.textPrimary,
        headerTitleStyle: {
          fontWeight: '700',
        },
        tabBarStyle: {
          backgroundColor: st.surfaceElevated,
          borderTopColor: st.border,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          paddingTop: 12,
        },
        tabBarActiveTintColor: st.primary,
        tabBarInactiveTintColor: st.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('home'),
          headerShown: false,
          tabBarIcon: ({ color }) => <TabIcon name="home" color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: t('practice'),
          tabBarIcon: ({ color }) => <TabIcon name="play-circle-filled" color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: t('progress'),
          tabBarIcon: ({ color }) => <TabIcon name="bar-chart" color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('profile'),
          tabBarIcon: ({ color }) => <TabIcon name="person" color={color as string} />,
        }}
      />
    </Tabs>
  );
}



