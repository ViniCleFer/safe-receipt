import 'intl';
import 'intl/locale-data/jsonp/en';
import '@/lib/dayjs';

import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { FontAwesome } from '@expo/vector-icons';
import * as Font from 'expo-font';
import { router, Stack, useRouter, Tabs } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { LogBox, ActivityIndicator, AppState } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NativeBaseProvider, StatusBar, View } from 'native-base';
import { THEME } from '@/styles/theme';
import { Loading } from '@/components/Loading';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

export default function MainLayout() {
  // const [fontsLoaded, setFontsLoaded] = useState(false);
  // const [loading, setLoading] = useState(false);

  // const { session, initialized } = useAuth();

  // const segments = useSegments();
  // const router = useRouter();
  const [appIsReady, setAppIsReady] = useState(false);
  const [loading, setLoading] = useState(true);

  console.log('MainLayout Auth useEffect');

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="forms-ptp-list" />
      <Stack.Screen name="divergencies-list" />
      <Stack.Screen name="laudos-crm-list" />
    </Stack>
  );
}
