import { Audio } from 'expo-av';

/**
 * Plays a short notification sound.
 * Works with Expo-managed workflow.
 */
export async function playNotificationSound() {
  try {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/sounds/notification.mp3') // 👈 placeholder sound
    );
    await sound.playAsync();

    // optional: unload automatically to free memory
    sound.setOnPlaybackStatusUpdate(status => {
      if (status.didJustFinish) sound.unloadAsync();
    });
  } catch (error) {
    console.log('Sound error:', error);
  }
}