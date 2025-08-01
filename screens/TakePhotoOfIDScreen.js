import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TakePhotoOfIDScreen({ navigation, route }) {
  const { idType } = route.params;
  const [frontPhoto, setFrontPhoto] = useState(null);

  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Camera permission is required!');
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.cancelled && result.assets && result.assets[0].uri) {
      setFrontPhoto(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Take a photo of your ID</Text>
        <View style={{ width: 40 }} /> {/* placeholder for spacing */}
      </View>

      {/* Big Box */}
      <TouchableOpacity style={styles.bigBox} onPress={pickImage}>
        {frontPhoto ? (
          <Image source={{ uri: frontPhoto }} style={{ width: '100%', height: '100%', borderRadius: 16 }} />
        ) : (
          <Text style={styles.bigBoxText}>Tap to take photo</Text>
        )}
      </TouchableOpacity>

      {/* Instructions */}
      <View style={styles.instructionsBox}>
        <Text style={styles.instTitle}>Front of ID</Text>
        <Text style={styles.instSub}>Center your ID in the frame and we’ll take the photo automatically</Text>
      </View>

      {/* Retake/Submit */}
      {frontPhoto && (
        <TouchableOpacity style={styles.retakeBtn} onPress={() => setFrontPhoto(null)}>
          <Text style={styles.retakeText}>Retake the Photo</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.submitBtn}
        onPress={() => {
          if (!frontPhoto) {
            Alert.alert('Please take a photo first!');
            return;
          }
          // TODO: Submit logic here
          Alert.alert('Photo submitted!');
        }}
      >
        <Text style={styles.submitText}>Submit Photo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  header: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 24, justifyContent: 'space-between',
  },
  backArrow: { fontSize: 28, color: '#000A63', fontWeight: 'bold' },
  headerTitle: { fontSize: 18, color: '#000A63', fontWeight: 'bold', flex: 1, textAlign: 'center' },
  bigBox: {
    width: '100%', height: 200, borderRadius: 16, backgroundColor: '#222', justifyContent: 'center', alignItems: 'center', marginBottom: 20,
  },
  bigBoxText: { color: '#fff', fontSize: 18, opacity: 0.5 },
  instructionsBox: { marginBottom: 10, marginTop: 8 },
  instTitle: { fontWeight: 'bold', fontSize: 16, color: '#000A63' },
  instSub: { fontSize: 15, color: '#333', marginTop: 2 },
  retakeBtn: { alignItems: 'center', marginVertical: 16 },
  retakeText: { color: '#000A63', fontWeight: 'bold', fontSize: 16 },
  submitBtn: {
    backgroundColor: '#0095F6', paddingVertical: 16, borderRadius: 10, alignItems: 'center', marginTop: 16,
  },
  submitText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});