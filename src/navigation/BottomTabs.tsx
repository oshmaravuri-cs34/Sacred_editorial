import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView, Platform } from 'react-native';
import { Home, Book, Inbox, User } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { translations } from '../data/translations';

import HomeScreen from '../screens/HomeScreen';
import ChaptersScreen from '../screens/ChaptersScreen';
import SearchScreen from '../screens/SearchScreen';
import ProfileScreen from '../screens/ProfileScreen';

const BottomTabs = () => {
  const { isDarkMode, fontSizeMultiplier, language } = useTheme();
  const fm = fontSizeMultiplier || 1;
  const t = translations[language].tabs;
  const [activeTab, setActiveTab] = useState('Profile');

  const renderScreen = () => {
    switch (activeTab) {
      case 'Home': return <HomeScreen />;
      case 'Chapters': return <ChaptersScreen />;
      case 'Search': return <SearchScreen />;
      case 'Profile': return <ProfileScreen />;
      default: return <HomeScreen />;
    }
  };

  const tabs = [
    { id: 'Home', label: t.home, Icon: Home },
    { id: 'Chapters', label: t.chapters, Icon: Book },
    { id: 'Search', label: t.search, Icon: Inbox },
    { id: 'Profile', label: t.profile, Icon: User },
  ];

  const styles = getStyles(isDarkMode, fm);

  return (
    <View style={styles.container}>
      <View style={styles.screenContainer}>
        {renderScreen()}
      </View>
      
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const color = isActive ? '#BF5D15' : (isDarkMode ? '#8A8275' : '#A0988E');
          return (
            <TouchableOpacity 
              key={tab.id} 
              style={styles.tabItem} 
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.7}
            >
              <tab.Icon strokeWidth={isActive ? 2.5 : 1.5} size={24} color={color} />
              <Text style={[styles.tabLabel, { color, fontWeight: isActive ? 'bold' : 'normal' }]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <SafeAreaView style={{ backgroundColor: isDarkMode ? '#1A1816' : '#FFF' }} />
    </View>
  );
};

const getStyles = (isDark: boolean, fm: number) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#1A1816' : '#FDFBF7',
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    height: 65,
    backgroundColor: isDark ? '#1A1816' : '#FFF',
    borderTopWidth: 1,
    borderTopColor: isDark ? '#2D2823' : '#EEE',
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 0 : 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10 * fm,
    marginTop: 4,
  }
});

export default BottomTabs;
