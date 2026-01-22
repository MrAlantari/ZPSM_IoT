import { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

export const useFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await SplashScreen.preventAutoHideAsync();
        
        await Font.loadAsync({
          'Roboto-Regular': require('@expo-google-fonts/roboto/Roboto_400Regular'),
          'Roboto-Medium': require('@expo-google-fonts/roboto/Roboto_500Medium'),
          'Roboto-Bold': require('@expo-google-fonts/roboto/Roboto_700Bold'),
        });
        
      } catch (e) {
        console.warn('Error loading fonts:', e);
      } finally {
        setFontsLoaded(true);
        await SplashScreen.hideAsync();
      }
    }

    loadFonts();
  }, []);

  return fontsLoaded;
};