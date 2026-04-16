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
  const { isDarkMode, notificationTime, hasSeenOnboarding, completeOnboarding } = useTheme();
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [activeSloka, setActiveSloka] = useState<{ chapter: any, verse: any } | null>(null);

  useEffect(() => {
    const setup = async () => {
      await initializeNotifications();

      // Listen for notification-triggered playback
      setNotificationListener((data) => {
        const chapter = gitaChapters.find(c => c.id === data.chapterId);
        const verse = chapter?.verses.find(v => v.verseNumber === data.verseNumber);
        if (chapter && verse) {
            setActiveSloka({ chapter, verse });
        }
      });

      // Handle initial notification (app cold start)
      const initialNotification = await notifee.getInitialNotification();
      if (initialNotification && (initialNotification.pressAction?.id === 'default' || initialNotification.pressAction?.id === 'play_sloka')) {
          await setupTrackPlayer();
          await startSlokaPlayback();
      }
    };
    setup();

    return () => setNotificationListener(null);
  }, []);

  // Update schedule whenever notificationTime changes
  useEffect(() => {
    scheduleDailySlokaNotification(notificationTime.hour, notificationTime.minute, notificationTime.period);
  }, [notificationTime]);

  return (
    <SafeAreaProvider style={[styles.container, { backgroundColor: isDarkMode ? '#1A1816' : '#FDFBF7' }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={isDarkMode ? '#1A1816' : '#FDFBF7'} />
      {isSplashVisible ? (
        <SplashScreen onFinish={() => setIsSplashVisible(false)} />
      ) : !hasSeenOnboarding ? (
        <OnboardingScreen onFinish={completeOnboarding} />
      ) : (
        <>
          {activeSloka ? (
            <SlokaDetailScreen 
              chapter={activeSloka.chapter} 
              verse={activeSloka.verse} 
              onBack={() => setActiveSloka(null)} 
            />
          ) : (
            <BottomTabs />
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
