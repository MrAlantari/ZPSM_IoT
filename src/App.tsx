import { Assets as NavigationAssets } from '@react-navigation/elements';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Asset } from 'expo-asset';
import { createURL } from 'expo-linking';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import { useColorScheme } from 'react-native';
import { Navigation } from './navigation/index';

// Załaduj assets
Asset.loadAsync([
  ...NavigationAssets,
  // Możesz dodać własne ikony jeśli potrzebujesz
]);

SplashScreen.preventAutoHideAsync();

const prefix = createURL('/');

export function App() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  React.useEffect(() => {
    const loadResources = async () => {
      try {
        // Załaduj fonty jeśli są
        // await Font.loadAsync(...)
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn(e);
      }
    };

    loadResources();
  }, []);

  return (
    <ThemeProvider value={theme}>
      <Navigation
        linking={{
          prefixes: [prefix],
        }}
      />
    </ThemeProvider>
  );
}