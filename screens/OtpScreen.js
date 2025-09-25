import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../hooks/useAuth';

export default function OtpScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { signIn } = useAuth();

  const email = (route.params && route.params.email) || 'guest@example.com';

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(600);
  const inputRefs = useRef([]);

  useEffect(() => {
    setCode(['', '', '', '', '', '']);
    setTimer(120);
    const t = setInterval(() => setTimer((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const allFilled = code.every((d) => d.length === 1);

  const handleChange = (text, index) => {
    if (/^\d?$/.test(text)) {
      const next = [...code];
      next[index] = text;
      setCode(next);
      if (text.length === 1 && index < 5) {
        inputRefs.current[index + 1] && inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
      inputRefs.current[index - 1] && inputRefs.current[index - 1].focus();
    }
  };

  const handleContinue = async () => {
    try {
      const otp = code.join('');

      const res = await axios.post("http://192.168.100.6:4000/api/verify-otp", {
        email,
        otp,
      });

      const user = res.data.user;

      if (user.kycStatus === 'VERIFIED') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'UserVerification',
              params: { email: user.email },
            },
          ],
        });
      }
    } catch (err) {
      console.error(err);
      alert('Failed to verify OTP');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flexContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrow}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>

          <View style={styles.centerContent}>
            <Text style={styles.title}>OTP Confirmation</Text>
            <View style={{ marginBottom: 16 }} />
            <Text style={styles.subText}>A 6 digit code has been sent to your email</Text>
            <View style={{ marginBottom: 16 }} />
            <Text style={styles.emailText}>
              Enter code sent to <Text style={styles.emailBold}>{email}</Text>
            </Text>
            <Text style={styles.noteText}>
              Don’t have access to this email?{' '}
              <Text style={styles.link}>Use a different address</Text>
            </Text>

            <View style={{ marginBottom: 16 }} />

            <View style={styles.codeInputWrapper}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  keyboardType="number-pad"
                  maxLength={1}
                  style={styles.codeInput}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  autoFocus={index === 0}
                />
              ))}
            </View>

            <Text style={styles.timerText}>
              You can request a code in <Text style={{ fontWeight: 'bold' }}>{timer} secs</Text>
            </Text>
          </View>
        </ScrollView>

        <TouchableOpacity
          style={[styles.continueBtn, !allFilled && { opacity: 0.5 }]}
          onPress={handleContinue}
          disabled={!allFilled}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'white' },
  flexContainer: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 20, flexGrow: 1 },
  centerContent: { justifyContent: 'center' },
  backArrow: { marginBottom: 12 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 0, textAlign: 'left' },
  subText: { fontSize: 16, color: '#333' },
  emailText: { fontSize: 16, marginBottom: 4 },
  emailBold: { fontWeight: 'bold' },
  noteText: { fontSize: 14, color: '#333', marginBottom: 24 },
  link: { color: '#000A63', textDecorationLine: 'underline' },
  codeInputWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 8,
  },
  codeInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: 48,
    height: 48,
    textAlign: 'center',
    fontSize: 20,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  timerText: { fontSize: 14, textAlign: 'center', color: '#333', marginBottom: 32 },
  continueBtn: {
    backgroundColor: '#000A63',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 24,
  },
  continueText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});