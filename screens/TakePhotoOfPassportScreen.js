import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PRIMARY_BLUE = '#0094FF';

export default function TakePhotoOfPassportScreen() {
  const [selfiePhoto, setSelfiePhoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigation = useNavigation();

  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Camera access is needed!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1], // Square for circular display
      quality: 1,
      cameraType: ImagePicker.CameraType.front, // Front camera for selfie
    });

    if (!result.canceled && result.assets?.length > 0) {
      setSelfiePhoto(result.assets[0].uri);
    }
  };

  const handleRetake = () => {
    setSelfiePhoto(null);
  };

  const handleSubmit = () => {
    if (!selfiePhoto) {
      Alert.alert('No photo', 'Please take a selfie first');
      return;
    }

    setSubmitting(true);
    console.log('✅ Submitting Selfie Photo:', selfiePhoto);

    // Simulate submission delay
    setTimeout(() => {
      setSubmitting(false);
      Alert.alert(
        'Success',
        'Your verification is complete! Now let\'s set up your property listing.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to property creation flow
              navigation.navigate('CreatePropertyScreen');
            },
          },
        ]
      );
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Ionicons name="chevron-back" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Take a photo of yourself</Text>
      <Text style={styles.subtitle}>It should match with the photo in your ID</Text>

      {/* Circular Image Preview */}
      <View style={styles.circleWrapper}>
        <TouchableOpacity
          style={styles.circlePreview}
          onPress={openCamera}
          disabled={submitting}
        >
          {selfiePhoto ? (
            <Image source={{ uri: selfiePhoto }} style={styles.circleImage} />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="person" size={80} color="#555" />
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Info Box */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Center your face in the circle</Text>
        <Text style={styles.infoText}>
          Center your face in the frame and we'll take the photo automatically
        </Text>
      </View>

      {/* Retake Button */}
      {selfiePhoto && !submitting && (
        <TouchableOpacity onPress={handleRetake} style={styles.retakeBtn}>
          <Text style={styles.retakeText}>Retake the Photo</Text>
        </TouchableOpacity>
      )}

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        style={[styles.submitButton, (!selfiePhoto || submitting) && styles.submitButtonDisabled]}
        disabled={!selfiePhoto || submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Submit Photo</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backBtn: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
    fontFamily: 'Manrope-SemiBold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#aaa',
    fontSize: 14,
    fontFamily: 'Manrope-Regular',
    marginBottom: 40,
  },
  circleWrapper: {
    alignItems: 'center',
    marginBottom: 30,
  },
  circlePreview: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#1f1f1f',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoBox: {
    backgroundColor: '#0F3D5C',
    padding: 16,
    borderRadius: 10,
    marginBottom: 24,
  },
  infoTitle: {
    color: '#fff',
    fontWeight: '600',
    fontFamily: 'Manrope-SemiBold',
    fontSize: 15,
    marginBottom: 6,
  },
  infoText: {
    color: '#B8D4E8',
    fontSize: 13,
    fontFamily: 'Manrope-Regular',
    lineHeight: 18,
  },
  retakeBtn: {
    alignItems: 'center',
    marginBottom: 16,
  },
  retakeText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Manrope-Medium',
  },
  submitButton: {
    backgroundColor: PRIMARY_BLUE,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
    fontFamily: 'Manrope-SemiBold',
    fontSize: 16,
  },
});
