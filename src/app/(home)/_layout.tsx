import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Redirect, Stack } from 'expo-router';
import { useEffect, useState } from 'react';

export default function AuthRoutesLayout() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (!session) {
    return <Redirect href={'/(auth)/sign-in'} />;
  }

  return <Stack />;
}
