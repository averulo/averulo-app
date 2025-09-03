import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView, Platform, SafeAreaView, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';

const API = process.env.EXPO_PUBLIC_API_BASE_URL; // <-- .env

export default function OtpScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const email = route.params?.email; // pass from Login screen!
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputs = useRef([]);

  useEffect(() => {
    setCode(['', '', '', '', '', '']);
    setTimer(30);
    const id = setInterval(() => setTimer(t => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  const allFilled = code.every((d) => d.length === 1);

  const handleChange = (text, i) => {
    if (!/^\d?$/.test(text)) return;
    const next = [...code];
    next[i] = text;
    setCode(next);
    if (text && i < 5) inputs.current[i + 1]?.focus();
    if (next.join('').length === 6) handleSubmit(next.join(''));
  };

  const handleKeyPress = (e, i) => {
    if (e.nativeEvent.key === 'Backspace' && code[i] === '' && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const handleSubmit = async (otp) => {
    if (!API) return Alert.alert('Config', 'Missing EXPO_PUBLIC_API_BASE_URL');
    if (!email) return Alert.alert('Error', 'No email provided');
    try {
      setLoading(true);
      const res = await axios.post(`${API}/verify-otp`, { email, otp });
      if (res.data?.success) {
        Alert.alert('Verified', 'OTP verified successfully');
        navigation.navigate('UserVerification', { email });
      } else {
        Alert.alert('Invalid', res.data?.message || 'Invalid OTP');
      }
    } catch (err) {
      Alert.alert('Failed', 'Could not verify OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (!API) return Alert.alert('Config', 'Missing EXPO_PUBLIC_API_BASE_URL');
    if (!email) return Alert.alert('Error', 'No email provided');
    try {
      setResending(true);
      await axios.post(`${API}/send-otp`, { email });
      setTimer(30);
      Alert.alert('Sent', 'A new code has been sent.');
    } catch {
      Alert.alert('Error', 'Failed to resend code.');
    } finally {
      setResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>

          <Text style={styles.title}>OTP Confirmation</Text>
          <Text style={styles.sub}>A 6-digit code has been sent to</Text>
          <Text style={styles.email}>{email}</Text>

          <View style={styles.inputsRow}>
            {code.map((digit, i) => (
              <TextInput
                key={i}
                ref={(el) => (inputs.current[i] = el)}
                style={styles.input}
                value={digit}
                onChangeText={(t) => handleChange(t, i)}
                onKeyPress={(e) => handleKeyPress(e, i)}
                maxLength={1}
                keyboardType="number-pad"
                autoFocus={i === 0}
                textContentType="oneTimeCode"
              />
            ))}
          </View>

          <Text style={styles.timer}>
            {timer > 0 ? `Resend code in ${timer}s` : 'Didn’t get it?'}
          </Text>

          <TouchableOpacity
            onPress={resend}
            disabled={timer > 0 || resending}
            style={[styles.linkBtn, (timer > 0 || resending) && { opacity: 0.5 }]}
          >
            <Text style={styles.linkText}>{resending ? 'Resending…' : 'Resend code'}</Text>
          </TouchableOpacity>
        </ScrollView>

        <TouchableOpacity
          style={[styles.cta, (!allFilled || loading) && { opacity: 0.6 }]}
          disabled={!allFilled || loading}
          onPress={() => handleSubmit(code.join(''))}
        >
          <Text style={styles.ctaText}>{loading ? 'Verifying…' : 'Continue'}</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  flex: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 20, flexGrow: 1 },
  back: { marginBottom: 12 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 8 },
  sub: { fontSize: 16, color: '#333' },
  email: { fontSize: 16, fontWeight: 'bold', marginBottom: 24 },
  inputsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  input: {
    width: 48, height: 48, borderRadius: 8, borderWidth: 1, borderColor: '#ccc',
    textAlign: 'center', fontSize: 20, backgroundColor: '#f0f0f0',
  },
  timer: { textAlign: 'center', color: '#333', marginTop: 8, marginBottom: 8 },
  linkBtn: { alignSelf: 'center', paddingVertical: 6, paddingHorizontal: 12 },
  linkText: { color: '#000A63', textDecorationLine: 'underline', fontWeight: '600' },
  cta: {
    backgroundColor: '#000A63', paddingVertical: 16, margin: 24, borderRadius: 10, alignItems: 'center',
  },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});