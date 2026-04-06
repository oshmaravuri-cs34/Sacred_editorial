import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type LanguageCode = 'en' | 'hi' | 'te' | 'ta' | 'kn' | 'mr' | 'bn' | 'gu' | 'ml';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  fontSizeMultiplier: number;
  setFontSizeMultiplier: (val: number) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  memorizedVerses: string[];
  toggleMemorized: (verseId: string) => void;
  lastViewedVerse: { chapterId: number, verseNumber: number } | null;
  setLastViewedVerse: (chapterId: number, verseNumber: number) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const MEMORIZED_KEY = '@memorized_verses';
const LAST_VIEWED_KEY = '@last_view_progress';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1.0);
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [memorizedVerses, setMemorizedVerses] = useState<string[]>([]);
  const [lastViewedVerse, setLastViewedState] = useState<{ chapterId: number, verseNumber: number } | null>(null);

  // Load state on mount
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedVerses = await AsyncStorage.getItem(MEMORIZED_KEY);
        if (storedVerses) {
          setMemorizedVerses(JSON.parse(storedVerses));
        }

        const storedLastViewed = await AsyncStorage.getItem(LAST_VIEWED_KEY);
        if (storedLastViewed) {
          setLastViewedState(JSON.parse(storedLastViewed));
        }
      } catch (e) {
        console.error('Failed to load stored data', e);
      }
    };
    loadStoredData();
  }, []);

  // Save state on change
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem(MEMORIZED_KEY, JSON.stringify(memorizedVerses));
      } catch (e) {
        console.error('Failed to save memorized verses', e);
      }
    };
    saveData();
  }, [memorizedVerses]);

  useEffect(() => {
    const saveLastViewed = async () => {
      try {
        if (lastViewedVerse) {
          await AsyncStorage.setItem(LAST_VIEWED_KEY, JSON.stringify(lastViewedVerse));
        }
      } catch (e) {
        console.error('Failed to save last viewed verse', e);
      }
    };
    saveLastViewed();
  }, [lastViewedVerse]);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const toggleMemorized = (verseId: string) => {
    setMemorizedVerses(prev => 
      prev.includes(verseId) 
        ? prev.filter(id => id !== verseId) 
        : [...prev, verseId]
    );
  };

  const setLastViewedVerse = (chapterId: number, verseNumber: number) => {
    setLastViewedState({ chapterId, verseNumber });
  };

  return (
    <ThemeContext.Provider value={{ 
      isDarkMode, 
      toggleDarkMode, 
      fontSizeMultiplier, 
      setFontSizeMultiplier,
      language,
      setLanguage,
      memorizedVerses,
      toggleMemorized,
      lastViewedVerse,
      setLastViewedVerse
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
