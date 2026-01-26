import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Audio } from 'expo-av';

const SplashScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Play splash sound
    async function playSound() {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/sounds/splash-sound.mp3')
        );
        await sound.playAsync();
      } catch (error) {
        console.log('Splash sound error:', error);
      }
    }

    playSound();

    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 2,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.replace('Login'); // 👈 Go to your Welcome screen
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/images/averulo-logo.png')} // ✅ Your real logo path
        style={[
          styles.logo,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000066',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
});