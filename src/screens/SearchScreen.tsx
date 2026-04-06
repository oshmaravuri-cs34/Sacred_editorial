import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Menu, UserCircle } from 'lucide-react-native';

const SearchScreen = () => {
  const { isDarkMode, fontSizeMultiplier, language } = useTheme();
  const fm = fontSizeMultiplier || 1;
  const styles = getStyles(isDarkMode, fm);
  const [offering, setOffering] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fadeAnim = new Animated.Value(1);

  const handlePour = () => {
    if (offering.trim().length === 0) return;
    
    // Smooth fade-out animation for the "poured" heart
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1500,
      useNativeDriver: true,
    }).start(() => {
      setIsSubmitted(true);
      setOffering('');
      // Reset fade for the next offering
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => setIsSubmitted(false));
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.headerIcon}>
          <Menu color={isDarkMode ? '#EAE1D3' : '#8A4F1D'} size={24} />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>THE SACRED</Text>
          <Text style={styles.logoTextSub}>EDITORIAL</Text>
        </View>
        <TouchableOpacity style={styles.headerIcon}>
          <UserCircle color={isDarkMode ? '#EAE1D3' : '#8A4F1D'} size={24} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
            <View style={styles.guidanceLabelContainer}>
              <Text style={styles.guidanceLabel}>SPIRITUAL GUIDANCE</Text>
            </View>

            <Text style={styles.mainTitle}>The Quiet{"\n"}Chamber of{"\n"}Truth</Text>

            <Text style={styles.description}>
              In the stillness of your heart, the divine speaks. Share your burdens, your questions, or your gratitude with the cosmic manuscript.
            </Text>

            <View style={styles.offeringContainer}>
              <Text style={styles.offeringLabel}>YOUR OFFERING</Text>
              <TextInput
                style={styles.parchmentInput}
                placeholder="Pour your heart into the parchment..."
                placeholderTextColor={isDarkMode ? '#6B5E4F' : '#C4B7A6'}
                multiline
                value={offering}
                onChangeText={setOffering}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity 
              style={[styles.pourButton, offering.trim().length === 0 && styles.pourDisabled]} 
              onPress={handlePour}
              disabled={offering.trim().length === 0}
            >
              <Text style={styles.pourButtonText}>FIND SOLUTION</Text>
            </TouchableOpacity>
          </Animated.View>

          {isSubmitted && (
            <View style={styles.successContainer}>
              <Text style={styles.successText}>Seeking divine guidance for your heart's request...</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const getStyles = (isDark: boolean, fm: number) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#141210' : '#FFFBF5',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#2D2823' : '#F2E8DB',
  },
  headerIcon: {
    padding: 8,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontFamily: 'serif',
    fontSize: 14 * fm,
    fontWeight: 'bold',
    letterSpacing: 2,
    color: isDark ? '#EAE1D3' : '#8A4F1D',
  },
  logoTextSub: {
    fontFamily: 'serif',
    fontSize: 14 * fm,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginTop: -4,
    color: isDark ? '#EAE1D3' : '#8A4F1D',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 30,
  },
  guidanceLabelContainer: {
    marginBottom: 25,
  },
  guidanceLabel: {
    fontSize: 10 * fm,
    letterSpacing: 2,
    fontWeight: '700',
    color: isDark ? '#A0988E' : '#B0A291',
  },
  mainTitle: {
    fontFamily: 'serif',
    fontSize: 48 * fm,
    fontWeight: '600',
    color: isDark ? '#EAE1D3' : '#2A2A2A',
    lineHeight: 56 * fm,
    marginBottom: 20,
  },
  description: {
    fontSize: 16 * fm,
    lineHeight: 26 * fm,
    color: isDark ? '#A0988E' : '#5A5A5A',
    fontFamily: 'serif',
    marginBottom: 40,
    opacity: 0.9,
  },
  offeringContainer: {
    flex: 1,
  },
  offeringLabel: {
    fontSize: 10 * fm,
    letterSpacing: 2,
    fontWeight: '700',
    color: isDark ? '#A0988E' : '#B0A291',
    marginBottom: 15,
  },
  parchmentInput: {
    flex: 1,
    fontFamily: 'serif',
    fontSize: 22 * fm,
    color: isDark ? '#EAE1D3' : '#4A4238',
    minHeight: 200,
    paddingTop: 0,
    textAlignVertical: 'top',
  },
  pourButton: {
    backgroundColor: '#8A4F1D',
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#8A4F1D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  pourDisabled: {
    backgroundColor: isDark ? '#2D2823' : '#E6DCCF',
    shadowOpacity: 0,
    elevation: 0,
  },
  pourButtonText: {
    color: '#FFF',
    fontSize: 14 * fm,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  successContainer: {
    position: 'absolute',
    top: '40%',
    left: 30,
    right: 30,
    alignItems: 'center',
  },
  successText: {
    fontFamily: 'serif',
    fontSize: 18 * fm,
    color: '#8A4F1D',
    textAlign: 'center',
    fontStyle: 'italic',
  }
});

export default SearchScreen;
