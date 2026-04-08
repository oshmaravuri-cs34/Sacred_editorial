import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Platform, Share, Alert, Modal, FlatList } from 'react-native';
import { ArrowLeft, Settings, Type, Globe, Bookmark, Share2, Repeat, SkipBack, Play, SkipForward, Volume2, X, Check, Star } from 'lucide-react-native';
import { useTheme, LanguageCode } from '../context/ThemeContext';
import { translations } from '../data/translations';
import { Chapter, Verse } from '../data/gitaData';
import TrackPlayer, { usePlaybackState, State, useProgress } from 'react-native-track-player';
import { setupTrackPlayer, startSlokaPlayback } from '../services/NotificationService';

interface SlokaDetailScreenProps {
  chapter: Chapter;
  verse: Verse;
  onBack: () => void;
}

const LANGUAGES: { id: LanguageCode; name: string; translation: string }[] = [
  { id: 'en', name: 'English', translation: 'Just as the embodied soul continuously passes, in this body, from boyhood to youth to old age, the soul similarly passes into another body at death. A sober person is not bewildered by such a change.' },
  { id: 'hi', name: 'Hindi (हिंदी)', translation: 'जैसे देहधारी आत्मा इस भौतिक शरीर में बाल्यावस्था से युवावस्था और फिर वृद्धावस्था की ओर निरंतर अग्रसर होती है, उसी प्रकार मृत्यु होने पर आत्मा दूसरे शरीर में चली जाती है। धीर व्यक्ति ऐसे परिवर्तन से मोहग्रस्त नहीं होता।' },
  { id: 'te', name: 'Telugu (తెలుగు)', translation: 'దేహికి ఈ దేహమునందు బాల్యము, యౌవనము, ముసలితనము ఎలా కలుగుచున్నవో, అలాగే మరణించిన తరువాత మరొక దేహమును పొందుచున్నాడు. పండితుడైనవాడు దీనికి వగవడు.' },
  { id: 'ta', name: 'Tamil (தமிழ்)', translation: 'இந்த உடலில் வாழும் ஆத்மா குழந்தைப்பருவம், இளமை, முதுமை என்று மாறுவது போல, மரணத்திற்குப் பின் வேறொரு உடலை அடைகிறது. நிதானமான மனிதன் இந்த மாற்றத்தால் குழப்பமடைவதில்லை.' },
  { id: 'kn', name: 'Kannada (ಕನ್ನಡ)', translation: 'ದೇಹಿಯು ಈ ದೇಹದಲ್ಲಿ ಬಾಲ್ಯ, ಯೌವನ ಮತ್ತು ಮುಪ್ಪನ್ನು ಹೇಗೆ ಹೊಂದುತ್ತಾನೆಯೋ, ಹಾಗೆಯೇ ಸಾವಿನ ನಂತರ ಮತ್ತೊಂದು ದೇಹವನ್ನು ಹೊಂದುತ್ತಾನೆ. ಧೀರನಾದವನು ಇಂತಹ ಬದಲಾವಣೆಗಳಿಂದ ಗೊಂದಲಕ್ಕೊಳಗಾಗುವುದಿಲ್ಲ.' },
  { id: 'mr', name: 'Marathi (मराठी)', translation: 'ज्याप्रमाणे देहधारी आत्मा या शरीरात बालपणापासून तारुण्यापर्यंत आणि नंतर म्हातारपणापर्यंत सतत पुढे जातो, त्याचप्रमाणे मृत्यूनंतर आत्मा दुसऱ्या शरीरात प्रवेश करतो. धीर मनुष्य अशा बदलाने मोहित होत नाही.' },
  { id: 'bn', name: 'Bengali (বাংলা)', translation: 'যেমন দেহধারী আত্মা এই শরীরে বাল্যকাল থেকে যৌবনে এবং পরে বার্ধক্যে অবিরাম অগ্রসর হয়, তেমনি মৃত্যুর পর আত্মা অন্য একটি শরীরে প্রবেশ করে। ধীর ব্যক্তি এমন পরিবর্তনে বিভ্রান্ত হন না।' },
  { id: 'gu', name: 'Gujarati (ગુજરાતી)', translation: 'જેમ દેહધારી આત્મા આ શરીરમાં બાળપણથી યુવાની અને પછી વૃદ્ધાવસ્થામાં નિરંતર આગળ વધે છે, તેમ મૃત્યુ પછી આત્મા બીજા શરીરમાં પ્રવેશે છે. ધીર પુરુષ આવા પરિવર્તનથી મોહ પામતો નથી.' },
  { id: 'ml', name: 'Malayalam (മലയാളം)', translation: 'ഈ ശരീരത്തിൽ വസിക്കുന്ന ആത്മാവ് ബാല്യം, യൗവനം, വാർദ്ധക്യം എന്നിവയിലൂടെ കടന്നുപോകുന്നതുപോലെ, മരണശേഷം മറെറാരു ശരീരത്തിലേക്ക് കടക്കുകയും ചെയ്യുന്നു. ധീരനായ ഒരാൾ അത്തരം മാറ്റങ്ങളിൽ ആശയക്കുഴപ്പത്തിലാകുന്നില്ല.' },
];

const SlokaDetailScreen: React.FC<SlokaDetailScreenProps> = ({ chapter, verse, onBack }) => {
  const { isDarkMode, fontSizeMultiplier, setFontSizeMultiplier, language, memorizedVerses, toggleMemorized, setLastViewedVerse } = useTheme();
  const playbackState = usePlaybackState();
  const isPlaying = playbackState.state === State.Playing;
  const { position, duration } = useProgress();
  
  const fm = fontSizeMultiplier || 1;
  const t = translations[language];
  const styles = getStyles(isDarkMode, fm);
  
  const [isLangModalVisible, setIsLangModalVisible] = useState(false);
  const [isFontModalVisible, setIsFontModalVisible] = useState(false);
  const [tempFontSize, setTempFontSize] = useState(fontSizeMultiplier);
  const [selectedLangId, setSelectedLangId] = useState(language);

  // Track user progress
  useEffect(() => {
    setLastViewedVerse(chapter.id, verse.verseNumber);
  }, [chapter.id, verse.verseNumber]);

  const togglePlayback = async () => {
    const state = await TrackPlayer.getState();
    if (state === State.Playing) {
      await TrackPlayer.pause();
    } else {
      // Check if we already have a track loaded
      const currentTrack = await TrackPlayer.getActiveTrack();
      if (currentTrack) {
        await TrackPlayer.play();
      } else {
        await setupTrackPlayer();
        await startSlokaPlayback();
      }
    }
  };

  const skipForward = async () => {
    await TrackPlayer.seekTo(position + 10);
  };

  const skipBackward = async () => {
    await TrackPlayer.seekTo(Math.max(0, position - 10));
  };


  const selectedLanguage = LANGUAGES.find(l => l.id === selectedLangId) || LANGUAGES[0];

  const onShare = async () => {
    try {
      await Share.share({
        message: `${chapter.name} - SLOKA ${verse.verseNumber}\n\n${verse.transliteration}\n\n${verse.explanation}\n\nExample: ${verse.example}\n\n- Shared via The Sacred Editorial`,
      });
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  const handleOpenFontModal = () => {
    setTempFontSize(fontSizeMultiplier);
    setIsFontModalVisible(true);
  };

  const handleSaveFont = () => {
    setFontSizeMultiplier(tempFontSize);
    setIsFontModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
          <ArrowLeft color={isDarkMode ? '#EAE1D3' : '#8A8275'} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.headers.title}</Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Titles */}
        <View style={styles.titleContainer}>
          <Text style={styles.chapterLabel}>{t.tabs.chapters.toUpperCase().slice(0, -1)} {chapter.chapterNumber}</Text>
          <Text style={styles.chapterTitle}>{chapter.name}</Text>
          <Text style={styles.slokaLabel}>{t.chapters.versesCount.toUpperCase().slice(0, -1)} {verse.verseNumber}</Text>
        </View>

        {/* Sanskrit Card */}
        <View style={styles.sanskritCard}>
          <Text style={styles.devanagariText}>
            {verse.sanskrit || "Sanskrit missing"}
          </Text>
        </View>

        {/* Transliteration */}
        <View style={styles.transliterationContainer}>
          <Text style={styles.transliterationText}>
            {verse.transliteration || "Transliteration missing"}
          </Text>
        </View>

        {/* Translation */}
        <View style={styles.translationContainer}>
          {!!verse.explanation && (
            <>
              <Text style={styles.translationLabel}>WORD MEANINGS</Text>
              <Text style={styles.translationText}>{verse.explanation}</Text>
              <View style={{height: 20}} />
            </>
          )}

          {!!verse.example && (
            <>
              <Text style={[styles.translationLabel, {color: '#CA7532'}]}>EXAMPLE</Text>
              <Text style={[styles.translationText, {fontStyle: 'italic', marginBottom: 20}]}>{verse.example}</Text>
            </>
          )}

          <Text style={styles.translationLabel}>{t.profile.language.toUpperCase()} ({selectedLanguage.name})</Text>
          <Text style={styles.translationText}>
            {selectedLanguage.translation}
          </Text>
        </View>
        
        <View style={{height: 20}}/>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={styles.bottomBarContainer}>
        
        {/* Reading Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleOpenFontModal}>
            <Type color={isDarkMode ? '#C2BAAE' : '#555'} size={20} />
            <Text style={styles.actionLabel}>{t.profile.fontSize.toUpperCase()}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => setIsLangModalVisible(true)}>
            <Globe color={isDarkMode ? '#C2BAAE' : '#555'} size={20} />
            <Text style={styles.actionLabel}>{t.profile.language.toUpperCase()}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => toggleMemorized(`${chapter.id}.${verse.verseNumber}`)}
          >
            {memorizedVerses.includes(`${chapter.id}.${verse.verseNumber}`) ? (
              <Star color="#FFD700" size={20} fill="#FFD700" />
            ) : (
              <Star color={isDarkMode ? '#C2BAAE' : '#555'} size={20} />
            )}
            <Text style={[styles.actionLabel, memorizedVerses.includes(`${chapter.id}.${verse.verseNumber}`) && { color: '#CA7532' }]}>
              {memorizedVerses.includes(`${chapter.id}.${verse.verseNumber}`) ? "MEMORIZED" : "MARK READ"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={onShare}>
            <Share2 color={isDarkMode ? '#C2BAAE' : '#555'} size={20} />
            <Text style={styles.actionLabel}>SHARE</Text>
          </TouchableOpacity>
        </View>

        {/* Audio Player Controls */}
        <View style={styles.playerRow}>
          <TouchableOpacity style={styles.playerIconBtn}>
            <Repeat color={isDarkMode ? '#7A726B' : '#A0988E'} size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.playerIconBtn} onPress={skipBackward}>
            <SkipBack color={isDarkMode ? '#FFF' : '#151515'} size={22} fill={isDarkMode ? '#FFF' : '#151515'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.playBtn} activeOpacity={0.8} onPress={togglePlayback}>
            {isPlaying ? (
              <View style={{ flexDirection: 'row', gap: 4 }}>
                 <View style={{ width: 4, height: 18, backgroundColor: '#FFF', borderRadius: 2 }} />
                 <View style={{ width: 4, height: 18, backgroundColor: '#FFF', borderRadius: 2 }} />
              </View>
            ) : (
              <Play color="#FFF" size={20} fill="#FFF" style={{marginLeft: 4}} />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.playerIconBtn} onPress={skipForward}>
            <SkipForward color={isDarkMode ? '#FFF' : '#151515'} size={22} fill={isDarkMode ? '#FFF' : '#151515'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.playerIconBtn}>
            <Volume2 color={isDarkMode ? '#7A726B' : '#A0988E'} size={20} />
          </TouchableOpacity>
        </View>

        {/* Progress Bar (Optional Add-on for better UX) */}
        {duration > 0 && (
          <View style={{ height: 2, backgroundColor: isDarkMode ? '#4A423B' : '#EEE', marginTop: 15, borderRadius: 1 }}>
            <View style={{ width: `${(position / duration) * 100}%`, height: '100%', backgroundColor: '#CA7532', borderRadius: 1 }} />
          </View>
        )}

      </View>

      {/* Language Selection Modal */}
      <Modal visible={isLangModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBg}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Language</Text>
              <TouchableOpacity onPress={() => setIsLangModalVisible(false)} style={styles.closeBtn}>
                <X color="#A45511" size={20} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={LANGUAGES}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = item.id === selectedLangId;
                return (
                  <TouchableOpacity 
                    style={[styles.langItem, isSelected && styles.langItemSelected]}
                    onPress={() => {
                      setSelectedLangId(item.id);
                      setIsLangModalVisible(false);
                    }}
                  >
                    <Text style={[styles.langText, isSelected && styles.langTextSelected]}>
                      {item.name}
                    </Text>
                    {isSelected && <Check color="#CA7532" size={20} />}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>

      {/* Font Size Modal */}
      <Modal visible={isFontModalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalBg}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.profile.fontSize}</Text>
              <TouchableOpacity onPress={() => setIsFontModalVisible(false)} style={styles.closeBtn}>
                <X color="#A45511" size={20} />
              </TouchableOpacity>
            </View>

            <View style={styles.fontPickerContainer}>
              <Text style={{ fontFamily: 'serif', fontSize: 16 * fm, fontWeight: 'bold', color: isDarkMode ? '#EAE1D3' : '#333' }}>A</Text>
              
              <View style={styles.sliderTrackWrapper}>
                {/* Track Line */}
                <View style={[styles.sliderTrackLine, { backgroundColor: isDarkMode ? '#4A423B' : '#EAE1D3' }]} />
                
                {/* Active Track Line (Left to Current) */}
                {(() => {
                  const FONT_SIZES = [0.85, 0.9, 0.95, 1.0, 1.05, 1.1, 1.15, 1.2];
                  const currentIndex = Math.max(0, FONT_SIZES.indexOf(tempFontSize));
                  const percentage = (currentIndex / (FONT_SIZES.length - 1)) * 100;
                  return (
                    <View style={styles.activeTrackWrapper}>
                       <View style={{ width: `${percentage}%`, height: 3, backgroundColor: '#CA7532' }} />
                    </View>
                  );
                })()}

                {/* Touch Points */}
                <View style={styles.touchPointsContainer}>
                  {[0.85, 0.9, 0.95, 1.0, 1.05, 1.1, 1.15, 1.2].map((size) => {
                    const isActive = tempFontSize === size;
                    return (
                      <TouchableOpacity 
                        key={size}
                        onPress={() => setTempFontSize(size)} 
                        style={styles.touchPoint} 
                        activeOpacity={0.8}
                      >
                        {isActive ? (
                          <View style={styles.activeThumb} />
                        ) : (
                          <View style={[styles.inactiveThumb, { backgroundColor: isDarkMode ? '#7A726B' : '#C2BAAE' }]} />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <Text style={{ fontFamily: 'serif', fontSize: 26 * fm, fontWeight: 'bold', color: isDarkMode ? '#EAE1D3' : '#333' }}>A</Text>
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveFont} activeOpacity={0.8}>
              <Check color="#FFF" size={18} style={{marginRight: 8}} />
              <Text style={styles.saveBtnText}>{t.common.apply}</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const getStyles = (isDark: boolean, fm: number) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#1A1816' : '#FDFBF7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  iconBtn: {
    padding: 5,
  },
  headerTitle: {
    fontFamily: 'serif',
    fontSize: 18 * fm,
    fontWeight: 'bold',
    color: '#B48259',
    fontStyle: 'italic',
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 40,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  chapterLabel: {
    fontSize: 10 * fm,
    letterSpacing: 2.5,
    color: '#CA7532',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chapterTitle: {
    fontFamily: 'serif',
    fontSize: 36 * fm,
    fontWeight: 'bold',
    color: '#CA7532',
    marginBottom: 10,
    textAlign: 'center',
  },
  slokaLabel: {
    fontSize: 10 * fm,
    letterSpacing: 2,
    color: '#8A8275',
    fontWeight: 'bold',
  },
  sanskritCard: {
    backgroundColor: isDark ? '#2D2823' : '#FFF',
    borderLeftWidth: 4,
    borderLeftColor: '#CD3A30',
    paddingVertical: 35,
    paddingHorizontal: 20,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOpacity: isDark ? 0.4 : 0.05,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  devanagariText: {
    fontFamily: 'serif',
    fontSize: 22 * fm,
    color: isDark ? '#FFF' : '#151515',
    lineHeight: 38 * fm,
    textAlign: 'center',
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  transliterationContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  transliterationText: {
    fontFamily: 'serif',
    fontSize: 16 * fm,
    color: isDark ? '#C2BAAE' : '#555',
    lineHeight: 28 * fm,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  translationContainer: {
    alignItems: 'center',
  },
  translationLabel: {
    fontSize: 8 * fm,
    letterSpacing: 2,
    color: '#A0988E',
    marginBottom: 20,
  },
  translationText: {
    fontFamily: 'serif',
    fontSize: 18 * fm,
    color: isDark ? '#EAE1D3' : '#151515',
    lineHeight: 32 * fm,
    textAlign: 'center',
  },

  bottomBarContainer: {
    backgroundColor: isDark ? '#1A1816' : '#FDFBF7',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 25 : 15,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  actionBtn: {
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: 8 * fm,
    marginTop: 6,
    color: isDark ? '#C2BAAE' : '#555',
    letterSpacing: 0.5,
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  playerIconBtn: {
    padding: 10,
  },
  playBtn: {
    backgroundColor: '#CA7532',
    width: 60,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#CA7532',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: isDark ? '#1A1816' : '#FDFBF7',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#2D2823' : '#EAE1D3',
  },
  modalTitle: {
    fontFamily: 'serif',
    fontSize: 20 * fm,
    fontWeight: 'bold',
    color: '#A45511',
  },
  closeBtn: {
    padding: 5,
    backgroundColor: isDark ? '#2D2823' : '#F6F2EB',
    borderRadius: 15,
  },
  langItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#2D2823' : '#F6F2EB',
  },
  langItemSelected: {
    backgroundColor: isDark ? '#26221D' : '#FFF5ED',
  },
  langText: {
    fontSize: 16 * fm,
    color: isDark ? '#EAE1D3' : '#333',
    fontWeight: '500',
  },
  langTextSelected: {
    color: '#CA7532',
    fontWeight: 'bold',
  },
  
  // Font Size Components
  fontPickerContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: 35, 
    paddingHorizontal: 25,
  },
  sliderTrackWrapper: {
    flex: 1, 
    paddingHorizontal: 0, 
    justifyContent: 'center', 
    marginHorizontal: 15,
  },
  sliderTrackLine: {
    position: 'absolute', 
    left: 10, 
    right: 10, 
    height: 3,
  },
  activeTrackWrapper: {
    position: 'absolute', 
    left: 10, 
    right: 10, 
    top: 0, 
    bottom: 0, 
    justifyContent: 'center',
  },
  touchPointsContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
  },
  touchPoint: {
    width: 24, 
    height: 24, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  activeThumb: {
    width: 16, 
    height: 16, 
    borderRadius: 8, 
    backgroundColor: '#CA7532',
  },
  inactiveThumb: {
    width: 8, 
    height: 8, 
    borderRadius: 4,
  },
  saveBtn: {
    backgroundColor: '#CA7532',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: '#CA7532',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 12 * fm,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
});

export default SlokaDetailScreen;
