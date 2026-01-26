import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Audio } from 'expo-av';

const SplashScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const soundRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    async function playSplash() {
      try {
        // Load the sound and get its duration
        const { sound, status } = await Audio.Sound.createAsync(
          require('../assets/sounds/splash-sound.mp3')
        );
        soundRef.current = sound;

        // Get the actual sound duration (in milliseconds)
        const duration = status.durationMillis || 3000;

        // Play the sound
        await sound.playAsync();

        // Start animation synced with sound duration
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 2,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.sequence([
            // Keep logo visible for most of the sound
            Animated.delay(duration - 800),
            // Fade out in the last 800ms
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 800,
              useNativeDriver: true,
            }),
          ]),
        ]).start(() => {
          if (isMounted) {
            navigation.replace('Login');
          }
        });

        // Listen for when sound finishes (backup navigation)
        sound.setOnPlaybackStatusUpdate((playbackStatus) => {
          if (playbackStatus.didJustFinish && isMounted) {
            navigation.replace('Login');
          }
        });
      } catch (error) {
        console.log('Splash sound error:', error);
        // Fallback: navigate after 2 seconds if sound fails
        setTimeout(() => {
          if (isMounted) {
            navigation.replace('Login');
          }
        }, 2000);
      }
    }

    playSplash();

    // Cleanup
    return () => {
      isMounted = false;
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
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