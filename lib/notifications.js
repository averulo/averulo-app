// lib/notifications.js
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { API_BASE } from './api';

// Configure how notifications are displayed
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Register device for push notifications and save token to backend
 */
export async function registerForPushNotificationsAsync(token) {
  if (!Device.isDevice) {
    console.log('Push notifications only work on physical devices');
    return null;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push notification permissions');
      return null;
    }

    // Get Expo push token
    const expoPushToken = await Notifications.getExpoPushTokenAsync({
      projectId: 'e91af410-469e-4ed4-a169-34a44278e3a3', // Your EAS project ID
    });

    console.log('📱 Expo Push Token:', expoPushToken.data);

    // Save token to backend
    if (token) {
      await fetch(`${API_BASE}/api/users/push-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ pushToken: expoPushToken.data }),
      });
    }

    return expoPushToken.data;
  } catch (error) {
    console.error('Error registering for push notifications:', error);
    return null;
  }
}

/**
 * Add notification listeners
 */
export function addNotificationListeners(navigation) {
  // Handle notification received while app is foregrounded
  const receivedSubscription = Notifications.addNotificationReceivedListener(notification => {
    console.log('🔔 Notification received:', notification);
  });

  // Handle notification response (user tapped notification)
  const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
    console.log('👆 Notification tapped:', response);

    const data = response.notification.request.content.data;

    // Navigate based on notification type
    if (data.bookingId) {
      navigation.navigate('BookingDetailsScreen', { bookingId: data.bookingId });
    } else if (data.propertyId) {
      navigation.navigate('PropertyDetailsScreen', { propertyId: data.propertyId });
    }
  });

  return () => {
    receivedSubscription.remove();
    responseSubscription.remove();
  };
}
