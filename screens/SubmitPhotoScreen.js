import { useState } from 'react';
import { ActivityIndicator, Alert, Button, Image, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export default function SubmitPhotoScreen({ route, navigation }) {
  const { token } = useAuth();
  const { frontPhoto, backPhoto, idType } = route.params;
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      const form = new FormData();
      form.append('front', {
        uri: frontPhoto,
        name: 'front.jpg',
        type: 'image/jpeg',
      });
      form.append('back', {
        uri: backPhoto,
        name: 'back.jpg',
        type: 'image/jpeg',
      });
      form.append('idType', idType);

      const res = await fetch(`${process.env.EXPO_PUBLIC_API_BASE}/api/kyc/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: form,
      });

      if (!res.ok) throw new Error('Upload failed');

      Alert.alert('Success', 'Your ID was submitted successfully!');
      navigation.navigate('Home');
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to submit ID');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Review Your ID</Text>

      <Image source={{ uri: frontPhoto }} style={styles.image} />
      <Image source={{ uri: backPhoto }} style={styles.image} />

      <Button title={submitting ? "Submitting..." : "Submit for Review"} onPress={handleSubmit} disabled={submitting} />

      {submitting && <ActivityIndicator style={{ marginTop: 20 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  image: { width: 250, height: 160, borderRadius: 10, marginVertical: 10 },
});