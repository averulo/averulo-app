import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import { useState } from 'react';
import { API_BASE } from '../lib/api';
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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const navigation = useNavigation();

  const isValidEmail = (v) => /\S+@\S+\.\S+/.test(v);
  const canContinue = isValidEmail(email) && password.length >= 6;

  const handleContinue = async () => {
    if (!canContinue) return;

    try {
      // Send OTP for authentication
      const res = await axios.post(`${API_BASE}/api/send-otp`, { email });

      if (res.data.success) {
        console.log("✅ OTP sent successfully:", res.data);

        // Show dev OTP (for development only)
        if (res.data.devOtp) {
          console.log("🧩 DEV OTP:", res.data.devOtp);
          alert(`🧩 Dev OTP: ${res.data.devOtp}`);
        }

        // Navigate to OTP screen
        navigation.navigate("OtpScreen", {
          email,
          devOtp: res.data.devOtp || null,
        });
      } else {
        alert("Failed to send OTP: " + (res.data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("❌ Error sending OTP:", err.message);
      alert("Network or server error: " + err.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <Text style={styles.topTitle}>Log in or sign up</Text>
        <Text style={styles.title}>Log in</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, focusedField === 'email' && styles.focusedInput]}
          placeholder="yourname@gmail.com"
          value={email}
          onChangeText={setEmail}
          onFocus={() => setFocusedField('email')}
          onBlur={() => setFocusedField('')}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            placeholder="••••••••••"
            secureTextEntry={!isPasswordVisible}
            style={[styles.plainInput, focusedField === 'password' && styles.focusedInput]}
            value={password}
            onChangeText={setPassword}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField('')}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!isPasswordVisible)}>
            <Ionicons name={isPasswordVisible ? 'eye-off' : 'eye'} size={20} color="#888" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => alert('Forgot password feature coming soon')}>
          <Text style={styles.forgotPassword}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.continueBtn,
            { backgroundColor: canContinue ? '#000A63' : '#9DB7E1' },
          ]}
          disabled={!canContinue}
          onPress={handleContinue}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={{ marginTop: 20 }}>
          <Text style={styles.signUpText}>
            Don't have an account? <Text style={{ color: '#000A63', fontWeight: '600' }}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 30 },
  topTitle: { textAlign: 'center', color: '#888', fontSize: 14, marginBottom: 30 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 30 },
  label: { fontSize: 14, marginBottom: 6, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  plainInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  focusedInput: {
    borderColor: '#000A63',
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  forgotPassword: {
    textAlign: 'right',
    color: '#000A63',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 20,
  },
  continueBtn: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  continueText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  signUpText: { textAlign: 'center', color: '#666', fontSize: 14 },
});