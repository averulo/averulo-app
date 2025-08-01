import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function OtpScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(10);
  const inputRefs = useRef([]);
  const email = route.params?.email || 'akinbikehinde365@gmail.com';

  useEffect(() => {
    setCode(['', '', '', '', '', '']); // Reset on screen load
    setTimer(10);
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Helper: all fields filled?
  const allFilled = code.every(d => d.length === 1);

  // Input handler with focus control
  const handleChange = (text, index) => {
    if (/^\d?$/.test(text)) {
      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);

      if (text.length === 1 && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  // Handle backspace to auto-focus previous input
  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Submit OTP
  const handleContinue = async () => {
    const otp = code.join('');
    if (otp.length !== 6) {
      alert('Please enter all 6 digits');
      return;
    }
    try {
      const res = await axios.post('http://192.168.1.170:5050/api/verify-otp', {
        email,
        otp,
      });
      if (res.data.success) {
        navigation.navigate('UserVerification', { email });
      } else {
        alert(res.data.message || 'Invalid OTP');
      }
    } catch (err) {
      alert('Failed to verify OTP. Try again.');
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
              Don’t have access to this number?{' '}
              <Text style={styles.link}>Use a different Email address</Text>
            </Text>
            <View style={{ marginBottom: 16 }} />
            <View style={styles.codeInputWrapper}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={el => (inputRefs.current[index] = el)}
                  keyboardType="number-pad"
                  maxLength={1}
                  style={styles.codeInput}
                  value={digit}
                  onChangeText={text => handleChange(text, index)}
                  onKeyPress={e => handleKeyPress(e, index)}
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
          style={[
            styles.continueBtn,
            !allFilled && { opacity: 0.5 }
          ]}
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
  // ...same as your previous style...
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
    flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, marginTop: 8,
  },
  codeInput: {
    borderWidth: 1, borderColor: '#ccc', width: 48, height: 48, textAlign: 'center',
    fontSize: 20, borderRadius: 6, backgroundColor: '#f0f0f0',
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