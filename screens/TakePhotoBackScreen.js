import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TakePhotoBackScreen({ route, navigation }) {
  const { frontPhoto, idType } = route.params;
  const [backPhoto, setBackPhoto] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Camera access is required to verify your ID.');
      }
    })();
  }, []);

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.6,
    });

    if (!result.canceled) {
      setBackPhoto(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Take a photo of your ID</Text>

      <TouchableOpacity style={styles.photoBox} onPress={takePhoto}>
        {backPhoto ? (
          <Image source={{ uri: backPhoto }} style={styles.image} />
        ) : (
          <Text style={styles.photoText}>Tap to take back photo</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.instruction}>Back of ID</Text>
      <Text style={styles.caption}>Center your ID in the frame and we’ll take the photo automatically</Text>

      {backPhoto && (
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => navigation.navigate('SubmitPhoto', {
            frontPhoto,
            backPhoto,
            idType,
          })}
        >
          <Text style={styles.submitButtonText}>Submit Photo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // dark theme
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 20,
  },
  photoBox: {
    height: 200,
    backgroundColor: '#1f1f1f',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoText: {
    color: '#aaa',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  instruction: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
  },
  caption: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#0094FF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});