// screens/OtpScreen.js
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';

// Design colors
const PRIMARY_DARK = "#04123C";
const TEXT_DARK = "#1F2937";
const TEXT_MEDIUM = "#6B7280";
const BG_INPUT = "#F3F4F6";

export default function OtpScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { signIn } = useAuth();

  // ✅ Ensure email exists
  const { email, devOtp } = route.params || {};

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(120);
  const [busy, setBusy] = useState(false);
  const inputRefs = useRef([]);

  // Handle missing email - render error screen instead of returning null
  if (!email) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={TEXT_MEDIUM} />
          <Text style={styles.errorTitle}>Missing Email</Text>
          <Text style={styles.errorSubtitle}>Please go back and try again.</Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Mask email function
  const maskEmail = (email) => {
    const [name, domain] = email.split('@');
    if (name.length <= 2) return email;
    const maskedName = name[0] + name[1] + '*****';
    return `${maskedName}@${domain}`;
  };

  // Countdown timer
  useEffect(() => {
    const t = setInterval(() => setTimer((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  // 🧩 Auto-fill dev OTP in development
useEffect(() => {
  if (devOtp && __DEV__) {
    const arr = devOtp.split("").slice(0, 6);
    setCode(arr);
    console.log("🧩 Auto-filled dev OTP:", arr.join(""));
  }
}, [devOtp]);
  const allFilled = code.every((d) => d.length === 1);

  const handleChange = (text, index) => {
    if (/^\d?$/.test(text)) {
      const next = [...code];
      next[index] = text;
      setCode(next);
      if (text.length === 1 && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // ✅ Prevent duplicate submissions
  const handleContinue = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const otp = code.join('');
      console.log("🔍 Verifying OTP with:", { email, otp });

      const res = await axios.post(`${API_BASE}/api/verify-otp`, {
        email,
        otp,
      });

      console.log("✅ Verification response:", res.data);
      const { user, token } = res.data;

      // ✅ Save token and load user into AuthContext
      await signIn(token);

      // ✅ Route based on KYC status
      if (user.kycStatus === 'VERIFIED') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'UserVerification', params: { email: user.email } }],
        });
      }
    } catch (err) {
      console.error("❌ Verify OTP error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Invalid or expired OTP. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flexContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back button */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrow}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>

          <View style={styles.centerContent}>
            <Text style={styles.title}>OTP Confirmation</Text>
            <Text style={styles.subText}>A 6 digit code has been sent to your email</Text>

            <Text style={styles.emailText}>
              Enter code sent to <Text style={styles.emailBold}>{maskEmail(email)}</Text>
            </Text>

            <Text style={styles.noteText}>
              Don't have access to this Number. <Text style={styles.link}>Use a different Email address</Text>
            </Text>

            {/* OTP Inputs */}
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
              You can request a code in <Text style={styles.timerBold}>{timer} secs</Text>
            </Text>
          </View>
        </ScrollView>

        {/* Continue Button */}
        <TouchableOpacity
          style={[styles.continueBtn, (!allFilled || busy) && { opacity: 0.5 }]}
          onPress={handleContinue}
          disabled={!allFilled || busy}
        >
          <Text style={styles.continueText}>
            {busy ? "Verifying..." : "Continue"}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  flexContainer: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    flexGrow: 1
  },
  centerContent: {
    justifyContent: 'center'
  },
  backArrow: {
    marginBottom: 24
  },
  title: {
    fontFamily: 'System',
    fontSize: 28,
    fontWeight: '600',
    color: TEXT_DARK,
    textAlign: 'left',
    marginBottom: 12
  },
  subText: {
    fontFamily: 'System',
    fontSize: 16,
    color: TEXT_DARK,
    marginBottom: 20,
    lineHeight: 22,
  },
  emailText: {
    fontFamily: 'System',
    fontSize: 16,
    color: TEXT_DARK,
    marginBottom: 8,
    lineHeight: 22,
  },
  emailBold: {
    fontWeight: '600',
    color: TEXT_DARK,
  },
  noteText: {
    fontFamily: 'System',
    fontSize: 14,
    color: TEXT_MEDIUM,
    marginBottom: 32,
    lineHeight: 20,
  },
  link: {
    color: TEXT_DARK,
    fontWeight: '600',
  },
  codeInputWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 16,
    gap: 8,
  },
  codeInput: {
    borderWidth: 0,
    borderBottomWidth: 2,
    borderBottomColor: '#D1D5DB',
    flex: 1,
    height: 56,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: TEXT_DARK,
    backgroundColor: 'transparent',
  },
  timerText: {
    fontFamily: 'System',
    fontSize: 14,
    textAlign: 'center',
    color: TEXT_MEDIUM,
    marginBottom: 32,
    lineHeight: 20,
  },
  timerBold: {
    fontWeight: '700',
    color: TEXT_DARK,
  },
  continueBtn: {
    backgroundColor: PRIMARY_DARK,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 32,
    height: 56,
    justifyContent: 'center',
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'System',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_DARK,
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 14,
    color: TEXT_MEDIUM,
    textAlign: 'center',
    marginBottom: 24,
  },
  errorButton: {
    backgroundColor: PRIMARY_DARK,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  errorButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});