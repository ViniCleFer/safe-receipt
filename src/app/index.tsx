import { View } from 'react-native';
import React, { useEffect, useState } from 'react';
import SignIn from './(auth)/sign-in';
import { Redirect, router } from 'expo-router';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { setAuthenticatedUser } = useAuth();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setAuthenticatedUser(session?.user);
        router.replace('/(home)/dashboard');
        return;
      }
      router.replace('/');
      setAuthenticatedUser(null);
    });
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <AuthProvider>
        <SignIn />
      </AuthProvider>
    </View>
  );
}
