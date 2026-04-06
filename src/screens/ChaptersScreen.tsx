import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { gitaChapters, Chapter, Verse } from '../data/gitaData';
import { ArrowLeft, BookOpen, Search, X, Star } from 'lucide-react-native';
import { translations } from '../data/translations';
import SlokaDetailScreen from './SlokaDetailScreen';

const ChaptersScreen = () => {
  const { isDarkMode, fontSizeMultiplier, language, memorizedVerses } = useTheme();
  const fm = fontSizeMultiplier || 1;
  const t = translations[language].chapters;
  const h = translations[language].headers;
  const styles = getStyles(isDarkMode, fm);

  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const listData = useMemo(() => {
    if (!searchQuery) {
      return gitaChapters.map(c => ({ type: 'chapter', data: c }));
    }
    
    const q = searchQuery.toLowerCase();
    const results: any[] = [];
    
    gitaChapters.forEach(c => {
      const chapterMatch = 
        c.name.toLowerCase().includes(q) || 
        c.meaning.toLowerCase().includes(q) || 
        c.sanskritName.includes(q);
        
      if (chapterMatch) {
         results.push({ type: 'chapter', data: c });
      }
      
      c.verses.forEach(v => {
        if (v.text.toLowerCase().includes(q)) {
           results.push({ type: 'verseMatch', data: v, chapter: c });
        }
      });
    });
    
    return results;
  }, [searchQuery]);

  const renderChapterCard = (chapter: Chapter) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.8}
      onPress={() => setSelectedChapter(chapter)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.chapterNumber}>{translations[language].tabs.chapters.slice(0, -1)} {chapter.chapterNumber}</Text>
        <Text style={styles.verseCount}>{chapter.versesCount} {t.versesCount}</Text>
      </View>
      <Text style={styles.sanskritName}>{chapter.sanskritName}</Text>
      <Text style={styles.chapterName}>{chapter.name}</Text>
      <Text style={styles.chapterMeaning}>{chapter.meaning}</Text>
    </TouchableOpacity>
  );

  const renderVerseMatch = (verse: Verse, chapter: Chapter) => {
    const isMemorized = memorizedVerses.includes(`${chapter.id}.${verse.verseNumber}`);
    return (
      <TouchableOpacity 
        style={styles.verseCard} 
        activeOpacity={0.7} 
        onPress={() => {
          setSelectedChapter(chapter);
          setSelectedVerse(verse);
        }}
      >
        <View style={styles.verseCardHeader}>
          <Text style={styles.verseNumberLabel}>{chapter.name} - {t.versesCount.slice(0,-1)} {verse.verseNumber}</Text>
          {isMemorized && <Star size={16} color="#FFD700" fill="#FFD700" />}
        </View>
        <Text style={styles.verseText}>{verse.text}</Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === 'chapter') {
      return renderChapterCard(item.data);
    } else if (item.type === 'verseMatch') {
      return renderVerseMatch(item.data, item.chapter);
    }
    return null;
  };

  const renderVerseCard = ({ item }: { item: Verse }) => {
    const isMemorized = memorizedVerses.includes(`${selectedChapter?.id}.${item.verseNumber}`);
    return (
      <TouchableOpacity 
        style={styles.verseCard} 
        activeOpacity={0.7}
        onPress={() => setSelectedVerse(item)}
      >
        <View style={styles.verseCardHeader}>
          <Text style={styles.verseNumberLabel}>{t.versesCount.slice(0,-1)} {item.verseNumber}</Text>
          {isMemorized && <Star size={16} color="#FFD700" fill="#FFD700" />}
        </View>
        <Text style={styles.verseText}>{item.text}</Text>
      </TouchableOpacity>
    );
  };

  if (selectedChapter && selectedVerse) {
    return (
      <SlokaDetailScreen 
        chapter={selectedChapter} 
        verse={selectedVerse} 
        onBack={() => setSelectedVerse(null)} 
      />
    );
  }

  if (selectedChapter) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedChapter(null)} style={styles.iconBtn}>
            <ArrowLeft color={isDarkMode ? '#EAE1D3' : '#8A8275'} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{translations[language].tabs.chapters.slice(0, -1)} {selectedChapter.chapterNumber}</Text>
          <View style={{ width: 34 }} />
        </View>
        <FlatList 
            data={selectedChapter.verses}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderVerseCard}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={styles.detailTitleContainer}>
                <Text style={styles.detailSanskritName}>{selectedChapter.sanskritName}</Text>
                <Text style={styles.detailChapterName}>{selectedChapter.name}</Text>
                <Text style={styles.detailChapterMeaning}>{selectedChapter.meaning}</Text>
              </View>
            }
          />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconBtn}>
          <BookOpen color={isDarkMode ? '#EAE1D3' : '#8A8275'} size={24} />
        </View>
        <Text style={styles.headerTitle}>{h.gita}</Text>
        <View style={{ width: 34 }} />
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search color={isDarkMode ? '#A0988E' : '#888'} size={20} />
        <TextInput 
          style={styles.searchInput}
          placeholder={t.searchPlaceholder}
          placeholderTextColor={isDarkMode ? '#A0988E' : '#888'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
            <X color={isDarkMode ? '#A0988E' : '#888'} size={18} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={listData}
        keyExtractor={(item, index) => `${item.type}-${item.data.id}-${index}`}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ color: isDarkMode ? '#A0988E' : '#888', fontSize: 16 * fm }}>{t.noResults}</Text>
          </View>
        }
      />
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
    color: '#CA7532',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#2D2823' : '#F6F2EB',
    marginHorizontal: 20,
    marginTop: 5,
    marginBottom: 5,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: isDark ? '#4A423B' : '#EAE1D3',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16 * fm,
    color: isDark ? '#EAE1D3' : '#333',
    fontFamily: 'serif',
    padding: 0,
  },
  clearBtn: {
    padding: 4,
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: isDark ? '#2D2823' : '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: isDark ? 0.3 : 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#CA7532',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chapterNumber: {
    fontSize: 12 * fm,
    fontWeight: 'bold',
    color: '#CA7532',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  verseCount: {
    fontSize: 12 * fm,
    color: isDark ? '#A0988E' : '#888',
    fontWeight: '600',
  },
  sanskritName: {
    fontFamily: 'serif',
    fontSize: 24 * fm,
    color: isDark ? '#FFF' : '#151515',
    marginBottom: 4,
  },
  chapterName: {
    fontFamily: 'serif',
    fontSize: 18 * fm,
    color: isDark ? '#EAE1D3' : '#333',
    marginBottom: 6,
    fontWeight: '600',
  },
  chapterMeaning: {
    fontSize: 14 * fm,
    color: isDark ? '#C2BAAE' : '#666',
    fontStyle: 'italic',
  },
  detailTitleContainer: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 10,
  },
  detailSanskritName: {
    fontFamily: 'serif',
    fontSize: 32 * fm,
    color: isDark ? '#FFF' : '#151515',
    marginBottom: 8,
    textAlign: 'center',
  },
  detailChapterName: {
    fontFamily: 'serif',
    fontSize: 22 * fm,
    color: '#CA7532',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  detailChapterMeaning: {
    fontSize: 16 * fm,
    color: isDark ? '#C2BAAE' : '#555',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  verseCard: {
    backgroundColor: isDark ? '#26221D' : '#F6F2EB',
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
  },
  verseCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  verseNumberLabel: {
    fontSize: 12 * fm,
    fontWeight: 'bold',
    color: '#CA7532',
    letterSpacing: 1,
  },
  verseText: {
    fontFamily: 'serif',
    fontSize: 16 * fm,
    color: isDark ? '#EAE1D3' : '#151515',
    lineHeight: 24 * fm,
  }
});

export default ChaptersScreen;
