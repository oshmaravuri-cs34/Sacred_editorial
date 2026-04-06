import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, Easing } from 'react-native';

const { width } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  // Fade in animation
  const opacity = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    // Call onFinish after 2.5s
    const timer = setTimeout(() => {
      if (onFinish) {
        onFinish();
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.contentContainer, { opacity }]}>
        {/* Placeholder Logo Graphic matching the image */}
        <View style={styles.logoContainer}>
          {/* Background tan shapes */}
          <View style={styles.bgShapeLeft} />
          <View style={styles.bgShapeRight}>
            <View style={styles.combLine} />
            <View style={styles.combLine} />
            <View style={styles.combLine} />
            <View style={styles.combLine} />
            <View style={styles.combLine} />
            <View style={styles.combLine} />
          </View>

          {/* Orange Human Figure */}
          <View style={styles.figureHead} />
          <View style={styles.figureArms} />
          <View style={styles.figureBody} />
          <View style={styles.figureLegContainer}>
            <View style={styles.figureLeg} />
            <View style={styles.figureLegSpace} />
            <View style={styles.figureLeg} />
          </View>
          
          {/* Three Dots */}
          <View style={styles.dotsContainer}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.titleLine1}>The Sacred</Text>
        <Text style={styles.titleLine2}>Editorial</Text>

        {/* Subtitle */}
        <View style={styles.subtitleContainer}>
          <View style={styles.divider} />
          <Text style={styles.subtitle}>ETERNAL WISDOM</Text>
          <View style={styles.divider} />
        </View>
      </Animated.View>
    </View>
  );
};

const ORANGE = '#C4642C';
const TAN = '#EAE1D3';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF7F1', // Warm off-white
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 150,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  bgShapeLeft: {
    position: 'absolute',
    left: 20,
    width: 60,
    height: 100,
    borderRadius: 30,
    borderWidth: 10,
    borderColor: TAN,
    borderRightWidth: 0,
    top: 20,
  },
  bgShapeRight: {
    position: 'absolute',
    right: 35,
    width: 30,
    height: 90,
    backgroundColor: TAN,
    top: 25,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: 'space-evenly',
    paddingLeft: 5,
  },
  combLine: {
    width: 15,
    height: 4,
    backgroundColor: '#FBF7F1', // cut out effect
  },
  figureHead: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: ORANGE,
    marginBottom: 4,
    zIndex: 10,
  },
  figureArms: {
    width: 80,
    height: 10,
    backgroundColor: ORANGE,
    borderRadius: 5,
    zIndex: 10,
  },
  figureBody: {
    width: 24,
    height: 40,
    backgroundColor: ORANGE,
    zIndex: 10,
    marginTop: -2,
  },
  figureLegContainer: {
    flexDirection: 'row',
    height: 25,
    zIndex: 10,
    marginTop: -2,
  },
  figureLeg: {
    width: 10,
    height: 25,
    backgroundColor: ORANGE,
  },
  figureLegSpace: {
    width: 4,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 15,
    width: 60,
    justifyContent: 'space-between',
    zIndex: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: ORANGE,
  },
  titleLine1: {
    fontFamily: 'serif',
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8A4A20',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  titleLine2: {
    fontFamily: 'serif',
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8A4A20',
    textAlign: 'center',
    marginBottom: 30,
    letterSpacing: 0.5,
    marginTop: -5,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.6,
    justifyContent: 'center',
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1C8BC',
  },
  subtitle: {
    marginHorizontal: 12,
    fontSize: 10,
    fontWeight: '600',
    color: '#A89E90',
    letterSpacing: 3,
  },
});

export default SplashScreen;
