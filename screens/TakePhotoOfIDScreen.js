// screens/TakePhotoOfIDScreen.js
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { API_BASE } from '../lib/api';

export default function TakePhotoOfIDScreen({ route }) {
  const navigation = useNavigation();
  const { idType } = route.params || {};
  const { token, refreshUser, user } = useAuth();

  const [frontPhoto, setFrontPhoto] = useState(null);
  const [backPhoto, setBackPhoto] = useState(null);
  const [currentStep, setCurrentStep] = useState('front');
  const [submitting, setSubmitting] = useState(false);

  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Camera access is needed!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 2],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      if (currentStep === 'front') {
        setFrontPhoto(uri);
        setCurrentStep('back');
      } else {
        setBackPhoto(uri);
      }
    }
  };

  const handleSubmit = async () => {
    if (!frontPhoto || !backPhoto) {
      Alert.alert('Missing photo', 'Please capture both sides of your ID');
      return;
    }
    if (!token) {
      Alert.alert('Error', 'You must be logged in.');
      return;
    }

    try {
      setSubmitting(true);

      // Convert to FormData
      const formData = new FormData();
      formData.append('idType', idType || 'UNKNOWN');
      formData.append('email', user?.email || '');
      formData.append('front', {
        uri: frontPhoto,
        name: 'front.jpg',
        type: 'image/jpeg',
      });
      formData.append('back', {
        uri: backPhoto,
        name: 'back.jpg',
        type: 'image/jpeg',
      });

      const res = await fetch(`${API_BASE}/api/upload-id`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Upload failed (${res.status})`);
      }

      const data = await res.json();
      console.log('✅ Upload success:', data);

      // 🔄 Immediately refresh user profile (so Explore updates)
      await refreshUser();

      Alert.alert('Success', 'Your ID has been submitted.');
      navigation.navigate('Home'); // or MainTabs/Explore depending on your nav setup
    } catch (err) {
      console.error('Upload error:', err);
      Alert.alert('Error', err.message || 'Failed to upload ID');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Take a photo of your ID</Text>
      </View>

      {/* Image Preview */}
      <TouchableOpacity style={styles.imageWrapper} onPress={openCamera} disabled={submitting}>
        <Image
          source={
            currentStep === 'front'
              ? frontPhoto
                ? { uri: frontPhoto }
                : require('../assets/images/id-card-illustration.png')
              : backPhoto
              ? { uri: backPhoto }
              : require('../assets/images/id-card-illustration.png')
          }
          style={styles.image}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Info Box */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>
          {currentStep === 'front' ? 'Front of ID' : 'Back of ID'}
        </Text>
        <Text style={styles.infoText}>
          Center your ID in the frame and we’ll take the photo automatically
        </Text>
      </View>

      {/* Retake */}
      {(frontPhoto || backPhoto) && !submitting && (
        <TouchableOpacity
          onPress={() => {
            setFrontPhoto(null);
            setBackPhoto(null);
            setCurrentStep('front');
          }}
        >
          <Text style={styles.retakeText}>Retake Photo(s)</Text>
        </TouchableOpacity>
      )}

      {/* Submit Button */}
      {frontPhoto && backPhoto && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.submitButton, submitting && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            <Text style={styles.submitText}>
              {submitting ? 'Submitting...' : 'Submit Photos'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', paddingHorizontal: 20, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  title: { color: '#fff', fontSize: 20, fontWeight: '600', marginLeft: 10 },
  imageWrapper: { alignItems: 'center', marginBottom: 20 },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1E293B',
    backgroundColor: '#1E293B',
  },
  infoBox: { backgroundColor: '#0F2D52', padding: 15, borderRadius: 10, marginBottom: 20 },
  infoTitle: { color: 'white', fontWeight: '600', marginBottom: 5 },
  infoText: { color: 'white', fontSize: 14 },
  retakeText: { color: 'white', fontSize: 16, textAlign: 'center', marginBottom: 20 },
  footer: { marginTop: 'auto', marginBottom: 20 },
  submitButton: { backgroundColor: '#0094FF', padding: 16, borderRadius: 8 },
  submitText: { color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
});