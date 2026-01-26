import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { ActivityIndicator, Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_BASE } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

export default function InputNINScreen({ route }) {
  const [nin, setNin] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigation = useNavigation();
  const { token, refreshUser } = useAuth();

  // Get returnTo and bookingData from route params
  const { returnTo, bookingData } = route?.params || {};

  const handleContinue = async () => {
    if (!/^\d{11}$/.test(nin)) {
      Alert.alert('Invalid NIN', 'NIN must be 11 numeric digits.');
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch(`${API_BASE}/api/users/kyc/submit-nin`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nin }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      // Refresh user data to get updated KYC status
      await refreshUser();

      Alert.alert('Success', 'Identity verified successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // If we came from booking flow, return there
            if (returnTo === 'ConfirmBooking' && bookingData) {
              navigation.navigate('ConfirmBooking', bookingData);
            } else {
              navigation.reset({
                index: 0,
                routes: [{ name: 'MainTabs' }],
              });
            }
          },
        },
      ]);
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to submit NIN');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔙 Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Ionicons name="chevron-back" size={28} color="#fff" />
      </TouchableOpacity>

      {/* 📝 Title */}
      <Text style={styles.title}>Enter your NIN</Text>

      {/* 🆔 Input */}
      <TextInput
        placeholder="National Identification Number"
        keyboardType="numeric"
        maxLength={11}
        value={nin}
        onChangeText={setNin}
        style={styles.input}
        placeholderTextColor="#888"
      />

      {/* 🚀 Submit */}
      <TouchableOpacity
        style={[styles.button, submitting && styles.buttonDisabled]}
        onPress={handleContinue}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Submit NIN</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  backBtn: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 20,
    fontWeight: '600',
    textAlign: 'left',
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
  input: {
    backgroundColor: '#1f1f1f',
    color: '#fff',
    padding: 14,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#0094FF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#666',
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
