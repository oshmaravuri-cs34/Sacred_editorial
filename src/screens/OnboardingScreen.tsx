import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  TouchableOpacity,
  SafeAreaView,
  Switch
} from 'react-native';
import { BookOpen, Bell, Volume2, Bookmark, ArrowRight } from 'lucide-react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';
import { translations } from '../data/translations';

const GradientButton = ({ onPress, text }: { onPress: () => void, text: string }) => {
  const fm = 1;
  const styles = getStyles(false, fm);
  return (
    <TouchableOpacity style={styles.btnContainer} onPress={onPress} activeOpacity={0.8}>
      <Svg height="100%" width="100%" style={StyleSheet.absoluteFillObject}>
        <Defs>
          <LinearGradient id="btnGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#964b0f" stopOpacity="1" />
            <Stop offset="1" stopColor="#ef9849" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" rx={12} fill="url(#btnGrad)" />
      </Svg>
      <View style={styles.btnContent}>
        <Text style={styles.btnText}>{text}</Text>
        <ArrowRight color="#FFF" size={16} style={{ marginLeft: 8 }} />
      </View>
    </TouchableOpacity>
  );
};

// Paginators across the 3 designs are unique, so we render them in the slides, not globally.
const PaginatorType1 = ({ activeIndex }: { activeIndex: number }) => {
  const fm = 1;
  const styles = getStyles(false, fm);
  return (
    <View style={styles.paginatorType1}>
      <View style={[styles.pagType1Line, activeIndex === 0 ? styles.pagType1LineActive : null]} />
      <View style={[styles.pagType1Line, { width: 12 }, activeIndex === 1 ? styles.pagType1LineActive : null]} />
      <View style={[styles.pagType1Line, { width: 12 }, activeIndex === 2 ? styles.pagType1LineActive : null]} />
      <Text style={styles.pagType1Text}>{activeIndex + 1} / 3</Text>
    </View>
  );
};

interface OnboardingScreenProps {
  onFinish: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onFinish }) => {
  const { width } = useWindowDimensions();
  const { language } = useTheme();
  const t = translations[language].onboarding;
  const th = translations[language].headers;
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesRef = useRef<FlatList<any>>(null);
  
  const fm = 1;
  const styles = getStyles(false, fm);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const scrollToNext = () => {
    if (currentIndex < 2) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      onFinish();
    }
  };

  const renderSlide1 = () => (
    <View style={[styles.slideMain, { width }]}>
      <Text style={styles.slide1Header}>{th.title}</Text>
      <View style={styles.slide1ArtBox}>
        <View style={styles.slide1ArtBg}>
          {/* Faux mandala lines */}
          <View style={styles.mandalaLineV} />
          <View style={styles.mandalaLineH} />
          <View style={styles.mandalaLineD1} />
          <View style={styles.mandalaLineD2} />
          {/* Glassy center overlay */}
          <View style={styles.slide1ArtGlass}>
            <BookOpen color="#964b0f" size={48} strokeWidth={2.5} />
          </View>
        </View>
      </View>

      <View style={styles.slide1TextContent}>
        <Text style={styles.slide1Title}>{t.title1}</Text>
        <PaginatorType1 activeIndex={0} />
        <Text style={styles.slide1Desc}>{t.desc1}</Text>
      </View>

      <View style={styles.bottomActions}>
        <GradientButton text={t.next} onPress={scrollToNext} />
        <TouchableOpacity onPress={onFinish} style={styles.skipBtn}>
          <Text style={styles.skipText}>{t.skip}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSlide2 = () => (
    <View style={[styles.slideMain, { width }]}>
      <View style={styles.slide2Header}>
        <View style={styles.paginatorType1}>
          <View style={[styles.pagType1Line, { width: 16 }]} />
          <View style={[styles.pagType1LineActive, { width: 24 }]} />
          <View style={[styles.pagType1Line, { width: 16 }]} />
        </View>
        <Text style={styles.slide2StepText}>STEP {currentIndex + 1} / 03</Text>
      </View>

      <View style={styles.slide2ArtBox}>
        <View style={styles.slide2ArtBg}>
          <View style={styles.slide2Waveform} />
          <View style={styles.slide1ArtGlass}>
            <Bell color="#964b0f" size={42} strokeWidth={2.5} />
          </View>
          <View style={styles.slide2FloatingCard}>
            <Volume2 color="#CD3A30" size={16} />
            <Text style={styles.floatingCardText}>96kHz Audio</Text>
          </View>
        </View>
      </View>

      <View style={styles.slide1TextContent}>
        <Text style={styles.slide1Title}>{t.title2}</Text>
        <View style={{height: 15}}/>
        <Text style={styles.slide1Desc}>{t.desc2}</Text>
      </View>

      <View style={styles.bottomActions}>
         <GradientButton text={t.next} onPress={scrollToNext} />
         <TouchableOpacity onPress={onFinish} style={styles.skipBtn}>
          <Text style={styles.skipText}>{t.skip}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSlide3 = () => (
    <View style={[styles.slide3Main, { width }]}>
      {/* Background Gradient */}
      <Svg height="100%" width="100%" style={StyleSheet.absoluteFillObject}>
        <Defs>
          <LinearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#4A5557" stopOpacity="1" />
            <Stop offset="0.6" stopColor="#D9D5CF" stopOpacity="1" />
            <Stop offset="1" stopColor="#FDFBF7" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#bgGrad)" />
      </Svg>

      <View style={styles.slide3ContentTop}>
        <Text style={styles.slide3Cat}>{t.cat3}</Text>
        <Text style={styles.slide3Title}>{t.title3}</Text>
        {/* Background fake elements */}
        <View style={styles.slide3FakeElement}>
          <Text style={styles.slide3FakeText}>PEACEFUL</Text>
        </View>
      </View>

      <View style={styles.slide3CardsContainer}>
        {/* Card 1 */}
        <View style={styles.slide3Card}>
          <View style={styles.slide3CardHeader}>
            <Bell color="#964b0f" size={20} />
            <Text style={styles.slide3CardTitle}>{t.card1Title}</Text>
          </View>
          <Text style={styles.slide3CardDesc}>{t.card1Desc}</Text>
          <View style={styles.cardDivider} />
          <View style={styles.cardBottomRow}>
             <Text style={styles.cardSettingsText}>ACTIVE SETTING</Text>
             <Switch 
               trackColor={{ false: '#dcdcdc', true: '#ef9849' }}
               thumbColor={'#964b0f'}
               ios_backgroundColor="#3e3e3e"
               value={true}
             />
          </View>
        </View>

        {/* Card 2 */}
        <View style={[styles.slide3Card, { backgroundColor: '#F8F6F1', marginTop: 15 }]}>
          <View style={styles.slide3CardHeader}>
            <Bookmark color="#b73c2a" size={20} />
            <Text style={styles.slide3CardTitle}>{t.card2Title}</Text>
          </View>
          <Text style={styles.slide3CardDesc}>{t.card2Desc}</Text>
        </View>
      </View>

      <View style={styles.slide3BottomActions}>
        <View style={[styles.paginatorType1, { justifyContent: 'center', marginBottom: 20 }]}>
          <View style={[styles.pagType1Line, { width: 6, marginHorizontal: 3 }]} />
          <View style={[styles.pagType1Line, { width: 6, marginHorizontal: 3 }]} />
          <View style={[styles.pagType1LineActive, { width: 24, marginHorizontal: 3 }]} />
          <Text style={[styles.pagType1Text, { marginLeft: 15 }]}>{currentIndex + 1} / 03</Text>
        </View>
        
        <GradientButton text={t.begin} onPress={scrollToNext} />
      </View>
    </View>
  );

  const renderItem = ({ item }: { item: number }) => {
    switch (item) {
      case 0: return renderSlide1();
      case 1: return renderSlide2();
      case 2: return renderSlide3();
      default: return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={[0, 1, 2]}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.toString()}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        ref={slidesRef}
      />
    </SafeAreaView>
  );
};

const getStyles = (isDark: boolean, fm: number) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFBF7',
  },
  slideMain: {
    flex: 1,
    backgroundColor: '#FDFBF7',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  // Slide 1 specifics
  slide1Header: {
    fontSize: 16 * fm,
    color: '#D4B892', // Beige/gold
    fontFamily: 'serif',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  slide1ArtBox: {
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  slide1ArtBg: {
    width: 320,
    height: 320,
    backgroundColor: '#1E1C1A',
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slide1ArtGlass: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(255, 230, 200, 0.3)', // Translucent overlay
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  mandalaLineV: { position: 'absolute', width: 2, height: '100%', backgroundColor: 'rgba(255, 200, 100, 0.1)' },
  mandalaLineH: { position: 'absolute', width: '100%', height: 2, backgroundColor: 'rgba(255, 200, 100, 0.1)' },
  mandalaLineD1: { position: 'absolute', width: 2, height: '150%', backgroundColor: 'rgba(255, 200, 100, 0.1)', transform: [{rotate: '45deg'}] },
  mandalaLineD2: { position: 'absolute', width: 2, height: '150%', backgroundColor: 'rgba(255, 200, 100, 0.1)', transform: [{rotate: '-45deg'}] },

  slide1TextContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  slide1Title: {
    fontFamily: 'serif',
    fontSize: 34 * fm,
    fontWeight: 'bold',
    color: '#151515',
    textAlign: 'center',
    lineHeight: 40,
  },
  slide1Desc: {
    fontSize: 14 * fm,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 20,
    fontFamily: 'serif',
  },

  // Slide 2 specifics
  slide2Header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  slide2StepText: {
    fontSize: 10 * fm,
    color: '#A0988E',
    letterSpacing: 1.5,
    fontWeight: 'bold',
  },
  slide2ArtBox: {
    alignItems: 'center',
    marginBottom: 40,
  },
  slide2ArtBg: {
    width: 280,
    height: 280,
    backgroundColor: '#DEBA89',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#C4965D',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 10 },
  },
  slide2Waveform: {
    position: 'absolute',
    width: '80%',
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  slide2FloatingCard: {
    position: 'absolute',
    bottom: -15,
    right: 20,
    backgroundColor: '#FFF',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  floatingCardText: {
    marginLeft: 6,
    fontSize: 10 * fm,
    fontWeight: 'bold',
    color: '#333',
    fontStyle: 'italic',
  },

  // Slide 3 specifics
  slide3Main: {
    flex: 1,
    paddingTop: 40,
    position: 'relative',
  },
  slide3ContentTop: {
    paddingHorizontal: 30,
    zIndex: 10,
  },
  slide3Cat: {
    color: '#c97728',
    fontSize: 10 * fm,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 15,
  },
  slide3Title: {
    fontFamily: 'serif',
    fontSize: 34 * fm,
    fontWeight: '800',
    color: '#1a1a1a',
    lineHeight: 38,
  },
  slide3FakeElement: {
    position: 'absolute',
    top: 150,
    left: 40,
    zIndex: -1,
    opacity: 0.4,
  },
  slide3FakeText: {
    fontSize: 50 * fm,
    fontWeight: '200',
    color: '#FFF',
    letterSpacing: 5,
  },
  slide3CardsContainer: {
    paddingHorizontal: 20,
    marginTop: 100,
    zIndex: 10,
  },
  slide3Card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  slide3CardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  slide3CardTitle: {
    fontFamily: 'serif',
    fontSize: 16 * fm,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  slide3CardDesc: {
    color: '#666',
    fontSize: 12 * fm,
    lineHeight: 18,
    fontFamily: 'serif',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: 15,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardSettingsText: {
    fontSize: 10 * fm,
    color: '#A0988E',
    letterSpacing: 1,
  },
  slide3BottomActions: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 40,
    zIndex: 10,
  },

  // Shared Components
  paginatorType1: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  pagType1Line: {
    height: 2,
    width: 24,
    backgroundColor: '#D1C8BC',
    marginRight: 6,
  },
  pagType1LineActive: {
    height: 4,
    width: 32,
    backgroundColor: '#B46422',
    marginRight: 6,
    borderRadius: 2,
  },
  pagType1Text: {
    marginLeft: 10,
    fontSize: 10 * fm,
    color: '#A0988E',
    letterSpacing: 2,
  },
  btnContainer: {
    width: '100%',
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    marginTop: 20,
  },
  btnContent: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#FFF',
    fontSize: 14 * fm,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  skipBtn: {
    padding: 15,
    marginTop: 10,
  },
  skipText: {
    fontSize: 10 * fm,
    color: '#A0988E',
    letterSpacing: 1,
    fontWeight: '600',
  },
});

export default OnboardingScreen;
