import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import AppleIcon from '../assets/icons/apple.png';
import FacebookIcon from '../assets/icons/facebook.png';
import GoogleIcon from '../assets/icons/google.png';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigation = useNavigation();

  const isValidEmail = (v) => /\S+@\S+\.\S+/.test(v);

  const handleContinue = async () => {
  if (!email.trim()) return alert("Please enter an email");

  try {
    const res = await axios.post("http://192.168.100.6:4000/api/send-otp", { email });

    if (res.data.success) {
      console.log("✅ OTP sent successfully:", res.data);

      // ⚡ Show dev OTP (for development only)
      if (res.data.devOtp) {
        console.log("🧩 DEV OTP:", res.data.devOtp);
        alert(`🧩 Dev OTP: ${res.data.devOtp}`);
      }

      // 🔀 Navigate to OTP screen and pass devOtp
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
        <Text style={styles.welcome}>Welcome!</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, { borderColor: isFocused ? '#000' : '#ccc' }]}
          placeholder="yourname@gmail.com"
          value={email}
          onChangeText={setEmail}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[
            styles.continueBtn,
            { backgroundColor: isValidEmail(email) ? '#000A63' : '#9DB7E1' },
          ]}
          disabled={!isValidEmail(email)}
          onPress={handleContinue}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>

        <Text style={styles.or}>or</Text>

        <TouchableOpacity style={styles.socialBtn}>
          <Ionicons name="person-circle-outline" size={20} color="#000" />
          <Text style={styles.socialText}>Continue as Guest</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialBtn}>
          <Image source={GoogleIcon} style={styles.icon} />
          <Text style={styles.socialText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialBtn}>
          <Image source={AppleIcon} style={styles.icon} />
          <Text style={styles.socialText}>Continue with Apple</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialBtn}>
          <Image source={FacebookIcon} style={styles.icon} />
          <Text style={styles.socialText}>Continue with Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signUpText}>
            Don’t have an account? <Text style={{ color: '#000A63', fontWeight: '600' }}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { paddingHorizontal: 20, paddingTop: 80, paddingBottom: 30 },
  topTitle: { textAlign: 'center', color: '#999', fontSize: 14, marginBottom: 20 },
  welcome: { fontSize: 26, fontWeight: 'bold', marginBottom: 30 },
  label: { fontSize: 14, marginBottom: 6, color: '#333' },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    fontSize: 16,
  },
  continueBtn: { paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  continueText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  or: { textAlign: 'center', marginVertical: 10, color: '#999' },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  socialText: { color: '#000', fontSize: 16, marginLeft: 10 },
  icon: { width: 20, height: 20, resizeMode: 'contain', marginRight: 10 },
  signUpText: { textAlign: 'center', marginTop: 20, color: '#666', fontSize: 14 },
});