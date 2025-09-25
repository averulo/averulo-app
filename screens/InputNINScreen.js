import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function InputNINScreen() {
  const [nin, setNin] = useState('');
  const navigation = useNavigation();

  const handleContinue = () => {
    if (!/^\d{11}$/.test(nin)) {
      Alert.alert('Invalid NIN', 'NIN must be 11 numeric digits.');
      return;
    }

    navigation.navigate('SubmitPhoto', {
      idType: 'national-id',
      nin,
    });
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
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Submit NIN</Text>
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
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});