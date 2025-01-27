import 'intl';
import 'intl/locale-data/jsonp/en';
import '@/lib/dayjs';

import { FontAwesome } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { NativeBaseProvider, StatusBar, View } from 'native-base';
import { useCallback } from 'react';
import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Slot } from 'expo-router';

import { Loading } from '@/components/Loading';
// import { getCurrentTimezone } from './src/utils/dateHelpers';
import { THEME } from './styles/theme';

console.log('Environment: ' + process.env.NODE_ENV);

LogBox.ignoreAllLogs();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    ...FontAwesome.font,
  });

  const onLayoutRootView = useCallback(async () => {
    console.log('fontsLoaded', fontsLoaded);
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NativeBaseProvider theme={THEME}>
        <StatusBar
          backgroundColor='white'
          barStyle='dark-content'
          translucent
        />
        <View flex={1} onLayout={onLayoutRootView}>
          {!fontsLoaded ? <Loading /> : <Slot />}
        </View>
      </NativeBaseProvider>
    </GestureHandlerRootView>
  );
}
