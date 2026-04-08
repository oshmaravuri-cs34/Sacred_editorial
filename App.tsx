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
import { initializeNotifications, scheduleDailySlokaNotification, setNotificationListener, setupTrackPlayer, startSlokaPlayback } from './src/services/NotificationService';
import SlokaDetailScreen from './src/screens/SlokaDetailScreen';
import { gitaChapters } from './src/data/gitaData';
import notifee from '@notifee/react-native';

function MainContent() {
  const { isDarkMode } = useTheme();
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [activeSloka, setActiveSloka] = useState<{ chapter: any, verse: any } | null>(null);

  useEffect(() => {
    const setup = async () => {
      await initializeNotifications();
      // Schedule for 8:00 AM by default
      await scheduleDailySlokaNotification(8, 0);

      // Listen for notification-triggered playback
      setNotificationListener((data) => {
        const chapter = gitaChapters.find(c => c.id === data.chapterId);
        const verse = chapter?.verses.find(v => v.verseNumber === data.verseNumber);
        if (chapter && verse) {
            setActiveSloka({ chapter, verse });
        }
      });
    };
    setup();

    return () => setNotificationListener(null);
  }, []);

  return (
    <SafeAreaProvider style={[styles.container, { backgroundColor: isDarkMode ? '#1A1816' : '#FDFBF7' }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={isDarkMode ? '#1A1816' : '#FDFBF7'} />
      {isSplashVisible ? (
        <SplashScreen onFinish={() => setIsSplashVisible(false)} />
      ) : showOnboarding ? (
        <OnboardingScreen onFinish={() => setShowOnboarding(false)} />
      ) : (
        <>
          <BottomTabs />
          {/* Global Sloka Modal */}
          {activeSloka && (
            <SlokaDetailScreen 
              chapter={activeSloka.chapter} 
              verse={activeSloka.verse} 
              onBack={() => setActiveSloka(null)} 
            />
          )}
        </>
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
