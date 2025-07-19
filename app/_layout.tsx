import 'react-native-url-polyfill/auto';
import { Toasts } from '@backpackapp-io/react-native-toast';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { darkTheme, lightTheme } from '@/constants/Themes';
import { ThemeProvider, useTheme } from '@/contexts/theme-context';
import { useProfileStore } from '@/features/profile/profileStore';
import '../global.css'; 
import 'react-native-reanimated';
import '@/i18n'; 

SplashScreen.preventAutoHideAsync();

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

const InternalRootLayout = () => {
  const { isDarkMode } = useTheme();

  return (
    <NavigationThemeProvider value={isDarkMode ? darkTheme : lightTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(public)" options={{ animation: 'fade' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </NavigationThemeProvider>
  );
};

const RootLayout = () => {
  const { i18n } = useTranslation();
  const { language } = useProfileStore();

  const [loading, setLoading] = useState(true);
  const [loaded] = useFonts({
    DynaPuffBold: require('../assets/fonts/DynaPuff-Bold.ttf'),
    DynaPuffMedium: require('../assets/fonts/DynaPuff-Medium.ttf'),
    DynaPuffRegular: require('../assets/fonts/DynaPuff-Regular.ttf'),
    DynaPuffSemiBold: require('../assets/fonts/DynaPuff-SemiBold.ttf'),
  });

  useEffect(() => {
    i18n.changeLanguage(language);

    setLoading(false);
  }, [language, i18n]);

  useEffect(() => {
    if (loaded && !loading) {
      SplashScreen.hideAsync();
    }
  }, [loaded, loading]);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <ThemeProvider>
          <InternalRootLayout />
          <Toasts />
        </ThemeProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
