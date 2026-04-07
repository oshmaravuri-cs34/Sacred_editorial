/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import BottomTabs from './src/navigation/BottomTabs';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { useEffect } from 'react';
import { initializeNotifications, scheduleDailySlokaNotification } from './src/services/NotificationService';

function MainContent() {
  const { isDarkMode } = useTheme();
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    const setup = async () => {
      await initializeNotifications();
      // Schedule for 8:00 AM by default
      await scheduleDailySlokaNotification(8, 0);
    };
    setup();
  }, []);

  return (
    <SafeAreaProvider style={[styles.container, { backgroundColor: isDarkMode ? '#1A1816' : '#FDFBF7' }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={isDarkMode ? '#1A1816' : '#FDFBF7'} />
      {isSplashVisible ? (
        <SplashScreen onFinish={() => setIsSplashVisible(false)} />
      ) : showOnboarding ? (
        <OnboardingScreen onFinish={() => setShowOnboarding(false)} />
      ) : (
        <BottomTabs />
      )}
    </SafeAreaProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <MainContent />
    </ThemeProvider>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
