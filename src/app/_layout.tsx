import 'intl';
import 'intl/locale-data/jsonp/en';
import '@/lib/dayjs';

import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { FontAwesome } from '@expo/vector-icons';
import * as Font from 'expo-font';
import { router, Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { LogBox, ActivityIndicator, AppState } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NativeBaseProvider, StatusBar, View } from 'native-base';
import { THEME } from '@/styles/theme';
import { Loading } from '@/components/Loading';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

LogBox.ignoreAllLogs();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

export function MainLayout() {
  const { setAuthenticatedUser } = useAuth();

  // const [fontsLoaded, setFontsLoaded] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  // const [loading, setLoading] = useState(false);

  // const { session, initialized } = useAuth();

  // const segments = useSegments();
  const router = useRouter();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        ...FontAwesome.font,
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
      setLoading(false);
    }
  }, [fontsLoaded]);

  // Função para verificar a sessão atual
  // const checkSession = async () => {
  //   const {
  //     data: { session },
  //   } = await supabase.auth.getSession();
  //   setSession(session);
  //   setLoading(false);
  // };

  useEffect(() => {
    // Verifica a sessão ao carregar o app
    // checkSession();

    // Monitora mudanças no estado de autenticação
    supabase.auth.onAuthStateChange((_event, session) => {
      console.log('authListener', JSON.stringify(session, null, 2));
      if (session) {
        setAuthenticatedUser(session?.user);

        router.replace('/(auth)/dashboard');
        return;
      }

      setAuthenticatedUser(null);
      router.replace('/');
    });

    // if (!initialized) return;

    // // Check if the path/url is in the (auth) group
    // const inAuthGroup = segments[0] === '(auth)';

    // if (session && inAuthGroup) {
    //   // Redirect authenticated users to the list page
    //   router.replace('/(auth)/dashboard');
    // } else {
    //   // Redirect unauthenticated users to the login page
    //   router.replace('/');
    // }

    // // Monitora mudanças no estado do app (foreground/background)
    // const subscription = AppState.addEventListener('change', state => {
    //   if (state === 'active') {
    //     checkSession(); // Verifica a sessão quando o app volta ao primeiro plano
    //   }
    // });

    // return () => {
    //   authListener.subscription.unsubscribe();
    //   // subscription.remove();
    // };
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={'#2e2efe'} size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NativeBaseProvider theme={THEME}>
        <StatusBar
          backgroundColor="white"
          barStyle="dark-content"
          translucent
        />
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="sign-up" />
            <Stack.Screen name="forgot-password" />
            <Stack.Screen name="(auth)/dashboard" />
            <Stack.Screen name="(auth)/divergency/[type]" />
            <Stack.Screen name="(auth)/enunciado/[id]" />
            <Stack.Screen name="(auth)/form-ptp" />
            <Stack.Screen name="(auth)/forms-ptp-list" />
            <Stack.Screen name="(auth)/divergencies-list" />
            <Stack.Screen name="(auth)/laudo-crm/[id]" />
            <Stack.Screen name="(auth)/laudos-crm-list" />
            <Stack.Screen name="(auth)/select-divergency-type" />
            <Stack.Screen name="(auth)/select-form-type-to-list" />
            <Stack.Screen name="(auth)/select-form-type-to-register" />
          </Stack>
        </View>
      </NativeBaseProvider>
    </GestureHandlerRootView>
  );
}
