import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as Linking from 'expo-linking';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';

export default function PaymentResultScreen() {
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'failed'
  const navigation = useNavigation();

  useEffect(() => {
    const handleDeepLink = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();

        if (initialUrl) {
          const url = new URL(initialUrl);
          const reference = url.searchParams.get('reference');

          if (!reference) return setStatus('failed');

          // Verify payment via backend
          const response = await axios.get(
            `${process.env.EXPO_PUBLIC_API_BASE}/api/payments/verify/${reference}`
          );

          if (response.data.status === 'success') {
            setStatus('success');
          } else {
            setStatus('failed');
          }
        } else {
          setStatus('failed');
        }
      } catch (error) {
        console.log('Verification error:', error);
        setStatus('failed');
      }
    };

    handleDeepLink();
  }, []);

  const renderContent = () => {
    if (status === 'loading') {
      return (
        <>
          <ActivityIndicator size="large" />
          <Text style={styles.message}>Verifying your payment...</Text>
        </>
      );
    }

    if (status === 'success') {
      return (
        <>
          <Text style={styles.success}>✅ Payment Successful!</Text>
          <Button title="View Booking" onPress={() => navigation.navigate('MyBookings')} />
          <Button title="Back to Home" onPress={() => navigation.navigate('Home')} />
        </>
      );
    }

    return (
      <>
        <Text style={styles.error}>❌ Payment Failed or Cancelled</Text>
        <Button title="Try Again" onPress={() => navigation.navigate('Home')} />
      </>
    );
  };

  return <View style={styles.container}>{renderContent()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24,
  },
  message: {
    marginTop: 12, fontSize: 16, color: '#555',
  },
  success: {
    fontSize: 20, color: 'green', marginBottom: 20,
  },
  error: {
    fontSize: 20, color: 'red', marginBottom: 20,
  },
});