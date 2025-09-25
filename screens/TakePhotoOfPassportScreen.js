import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TakePhotoOfPassportScreen() {
  const [passportPhoto, setPassportPhoto] = useState(null);
  const navigation = useNavigation();

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
    });
    if (!result.canceled) {
      setPassportPhoto(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!passportPhoto) return;
    console.log('✅ Submitting Passport Photo:', passportPhoto);
    // Navigate or call API here
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ✅ Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Ionicons name="chevron-back" size={28} color="#fff" />
      </TouchableOpacity>

      {/* ✅ Title */}
      <Text style={styles.title}>Take a photo of your Passport</Text>

      {/* ✅ Image Preview Box */}
      <TouchableOpacity style={styles.previewBox} onPress={pickImage}>
        {passportPhoto ? (
          <Image source={{ uri: passportPhoto }} style={styles.image} />
        ) : (
          <Text style={styles.tapText}>Tap to take passport photo</Text>
        )}
      </TouchableOpacity>

      {/* ✅ Instruction */}
      <Text style={styles.instruction}>
        Center your passport in the frame and we’ll take the photo automatically
      </Text>

      {/* ✅ Retake Button */}
      {passportPhoto && (
        <TouchableOpacity onPress={pickImage}>
          <Text style={styles.retake}>Retake the Photo</Text>
        </TouchableOpacity>
      )}

      {/* ✅ Submit Button */}
      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitText}>Submit Photo</Text>
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
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
  previewBox: {
    width: '100%',
    height: 200,
    backgroundColor: '#1f1f1f',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  tapText: {
    color: '#aaa',
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    resizeMode: 'cover',
  },
  instruction: {
    color: '#ccc',
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 20,
  },
  retake: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#0094FF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});