import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { uploadKyc } from '../lib/api';

const PRIMARY_BLUE = '#0094FF';

export default function TakePhotoOfPassportScreen({ route }) {
  const navigation = useNavigation();
  const { returnTo, bookingData } = route?.params || {};
  const { token, refreshUser } = useAuth();

  const [passportPhoto, setPassportPhoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Camera access is needed!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4], // Passport aspect ratio
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setPassportPhoto(result.assets[0].uri);
    }
  };

  const handleRetake = () => {
    setPassportPhoto(null);
  };

  const handleSubmit = async () => {
    if (!passportPhoto) {
      Alert.alert('No photo', 'Please take a photo of your passport first');
      return;
    }

    if (!token) {
      return Alert.alert("Error", "You must be logged in to upload your passport.");
    }

    try {
      setSubmitting(true);

      // Upload passport (using same photo for front/back since passport is single page)
      const result = await uploadKyc(token, "passport", passportPhoto, passportPhoto);
      console.log("✅ Passport Upload result:", result);

      await refreshUser();

      // Show success and navigate
      Alert.alert("Success", "Identity verified successfully!", [
        {
          text: "OK",
          onPress: () => {
            // If we came from booking flow, return there
            if (returnTo === "ConfirmBooking" && bookingData) {
              navigation.navigate("ConfirmBooking", bookingData);
            } else {
              // Regular flow - go to main tabs
              navigation.reset({
                index: 0,
                routes: [{ name: "MainTabs" }],
              });
            }
          },
        },
      ]);
    } catch (err) {
      console.error("❌ Passport upload error:", err);
      Alert.alert("Error", err.message || "Failed to upload passport.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Ionicons name="chevron-back" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Take a photo of your passport</Text>
      <Text style={styles.subtitle}>Make sure the photo page is clearly visible</Text>

      {/* Rectangular Image Preview */}
      <TouchableOpacity
        style={styles.imageWrapper}
        onPress={openCamera}
        disabled={submitting}
      >
        {passportPhoto ? (
          <Image source={{ uri: passportPhoto }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="document-text" size={60} color="#555" />
            <Text style={styles.placeholderText}>Tap to capture passport photo page</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Info Box */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Passport Photo Page</Text>
        <Text style={styles.infoText}>
          Center your passport's photo page in the frame. Make sure all text and your photo are clearly visible.
        </Text>
      </View>

      {/* Retake Button */}
      {passportPhoto && !submitting && (
        <TouchableOpacity onPress={handleRetake} style={styles.retakeBtn}>
          <Text style={styles.retakeText}>Retake the Photo</Text>
        </TouchableOpacity>
      )}

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        style={[styles.submitButton, (!passportPhoto || submitting) && styles.submitButtonDisabled]}
        disabled={!passportPhoto || submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Submit Photo</Text>
        )}
      </TouchableOpacity>

      {/* Uploading Overlay */}
      {submitting && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.overlayText}>Verifying your identity...</Text>
        </View>
      )}
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
  imageWrapper: {
    width: "100%",
    height: 280,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "#fff",
    backgroundColor: "#1f1f1f",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 30,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#888',
    fontSize: 14,
    fontFamily: 'Manrope-Regular',
    marginTop: 12,
  },
  image: {
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Manrope-Regular",
    marginTop: 12,
  },
});
