import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Modal, Share, Alert } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { Bookmark, Share2 } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { translations } from '../data/translations';
import { gitaChapters } from '../data/gitaData';
import SlokaDetailScreen from './SlokaDetailScreen';
import { getSlokaOfTheDay } from '../utils/gitaUtils';
import notifee, { TriggerType, AndroidImportance } from '@notifee/react-native';
import { NOTIFICATION_CHANNEL_ID } from '../services/NotificationService';

const HomeScreen = () => {
  const { isDarkMode, fontSizeMultiplier, language, lastViewedVerse } = useTheme();
  const fm = fontSizeMultiplier || 1;
  const t = translations[language].home;
  const styles = getStyles(isDarkMode, fm);
  const [isSlokaDetailVisible, setIsSlokaDetailVisible] = useState(false);
  const [isContinueDetailVisible, setIsContinueDetailVisible] = useState(false);

  // Get dynamic Sloka of the Day
  const { chapter: dailyChapter, verse: dailyVerse } = getSlokaOfTheDay();

  // Get Last Viewed Data
  const lastChapter = lastViewedVerse ? gitaChapters.find(c => c.id === lastViewedVerse.chapterId) : null;
  const lastVerse = lastChapter ? lastChapter.verses.find(v => v.verseNumber === lastViewedVerse?.verseNumber) : null;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t.morning;
    if (hour < 17) return t.afternoon;
    return t.evening;
  };

  const onShare = async () => {
    try {
      await Share.share({
        message: `${dailyChapter.name} - Verse ${dailyVerse.verseNumber}\n\n${dailyVerse.sanskrit}\n\n${dailyVerse.transliteration}\n\n${dailyVerse.explanation}\n\nShared via The Sacred Editorial`,
      });
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.dateText}>{new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</Text>
          </View>
          <TouchableOpacity 
            style={styles.testBtn} 
            onPress={async () => {
              const sloka = getSlokaOfTheDay();
              await notifee.displayNotification({
                title: 'Daily Sloka Reminder (Test)',
                body: `Chapter ${sloka.chapter.chapterNumber} Sloka ${sloka.verse.verseNumber}: ${sloka.chapter.name}`,
                android: {
                  channelId: NOTIFICATION_CHANNEL_ID,
                  importance: AndroidImportance.HIGH,
                  actions: [
                    {
                      title: 'Play Now',
                      pressAction: { id: 'play_sloka' },
                    },
                    {
                      title: 'Not Now',
                      pressAction: { id: 'dismiss' },
                    },
                  ],
                },
              });
            }}
          >
            <Text style={styles.testBtnText}>TEST REMINDER</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Sloka Banner */}
        <TouchableOpacity 
          style={styles.slokaBanner}
          activeOpacity={0.9}
          onPress={() => setIsSlokaDetailVisible(true)}
        >
          <Svg height="100%" width="100%" style={StyleSheet.absoluteFillObject}>
            <Defs>
              <LinearGradient id="bannerGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#A45511" stopOpacity="1" />
                <Stop offset="1" stopColor="#D98338" stopOpacity="1" />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" rx={16} fill="url(#bannerGrad)" />
          </Svg>
          
          <View style={styles.bannerContent}>
            <View style={styles.slokaTopRow}>
              <Text style={styles.slokaLabel}>{t.todaySloka}</Text>
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.actionIconButton}>
                  <Bookmark color="#FFF" size={18} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionIconButton} onPress={onShare}>
                  <Share2 color="#FFF" size={18} />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.sanskritText}>
              {dailyVerse.sanskrit.split('\n')[0]}{"\n"}
              {dailyVerse.sanskrit.split('\n').filter(l => l.trim().length > 0 && !l.includes('।।')).pop() || dailyVerse.sanskrit}
            </Text>
            
            <Text style={styles.chapterRef}>{dailyChapter.name} {dailyChapter.chapterNumber}.{dailyVerse.verseNumber}</Text>

            <View style={styles.divider} />
            
            <Text style={styles.translationText}>
              {dailyVerse.text}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Continue Reading Card */}
        {lastChapter && lastVerse && (
          <View style={styles.continueSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>CONTINUE READING</Text>
            </View>
            <TouchableOpacity 
              style={styles.continueCard}
              activeOpacity={0.8}
              onPress={() => setIsContinueDetailVisible(true)}
            >
              <View style={styles.continueLeft}>
                <View style={styles.continueChapterBadge}>
                  <Text style={styles.continueChapterText}>CH {lastChapter.chapterNumber}</Text>
                </View>
                <View style={styles.continueInfo}>
                  <Text style={styles.continueChapterName} numberOfLines={1}>{lastChapter.name}</Text>
                  <Text style={styles.continueVerseRef}>Verse {lastVerse.verseNumber}</Text>
                </View>
              </View>
              <View style={styles.continueButton}>
                <Text style={styles.continueButtonText}>RESUME</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <Modal visible={isSlokaDetailVisible} animationType="slide" presentationStyle="fullScreen">
        <SlokaDetailScreen 
          chapter={dailyChapter} 
          verse={dailyVerse} 
          onBack={() => setIsSlokaDetailVisible(false)} 
        />
      </Modal>

      {lastChapter && lastVerse && (
        <Modal visible={isContinueDetailVisible} animationType="slide" presentationStyle="fullScreen">
          <SlokaDetailScreen 
            chapter={lastChapter} 
            verse={lastVerse} 
            onBack={() => setIsContinueDetailVisible(false)} 
          />
        </Modal>
      )}

    </SafeAreaView>
  );
};

const getStyles = (isDark: boolean, fm: number) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#1A1816' : '#FDFBF7',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  testBtn: {
    backgroundColor: 'rgba(202, 117, 50, 0.1)',
    borderWidth: 1,
    borderColor: '#CA7532',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  testBtnText: {
    color: '#CA7532',
    fontSize: 10 * fm,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  greeting: {
    fontFamily: 'serif',
    fontSize: 28 * fm,
    fontWeight: 'bold',
    color: isDark ? '#EAE1D3' : '#151515',
  },
  dateText: {
    fontSize: 14 * fm,
    color: '#A0988E',
    marginTop: 4,
    fontWeight: '600',
    letterSpacing: 1,
  },
  slokaBanner: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#A45511',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  bannerContent: {
    padding: 24,
  },
  slokaTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  slokaLabel: {
    color: '#FFDDBB',
    fontSize: 10 * fm,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  actionRow: {
    flexDirection: 'row',
  },
  actionIconButton: {
    padding: 8,
    marginLeft: 4,
  },
  sanskritText: {
    fontFamily: 'serif',
    fontSize: 20 * fm,
    color: '#FFF',
    lineHeight: 30 * fm,
    textAlign: 'center',
    marginBottom: 10,
  },
  chapterRef: {
    textAlign: 'center',
    color: '#FFDDBB',
    fontSize: 12 * fm,
    fontStyle: 'italic',
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 15,
  },
  translationText: {
    color: '#FFF',
    fontSize: 14 * fm,
    lineHeight: 22 * fm,
    textAlign: 'center',
    fontFamily: 'serif',
    opacity: 0.9,
  },
  
  // Continue Reading Styles
  continueSection: {
    marginTop: 35,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 10 * fm,
    letterSpacing: 2,
    fontWeight: 'bold',
    color: '#A0988E',
  },
  continueCard: {
    backgroundColor: isDark ? '#2D2823' : '#FFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: isDark ? 0.2 : 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  continueLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  continueChapterBadge: {
    backgroundColor: isDark ? '#3D362F' : '#F6F2EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 12,
  },
  continueChapterText: {
    fontSize: 10 * fm,
    fontWeight: 'bold',
    color: '#CA7532',
  },
  continueInfo: {
    flex: 1,
  },
  continueChapterName: {
    fontFamily: 'serif',
    fontSize: 16 * fm,
    fontWeight: 'bold',
    color: isDark ? '#EAE1D3' : '#333',
    marginBottom: 2,
  },
  continueVerseRef: {
    fontSize: 12 * fm,
    color: '#A0988E',
  },
  continueButton: {
    backgroundColor: '#CA7532',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  continueButtonText: {
    color: '#FFF',
    fontSize: 10 * fm,
    fontWeight: 'bold',
    letterSpacing: 1,
  }
});

export default HomeScreen;
