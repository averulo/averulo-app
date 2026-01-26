import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useLayoutEffect, useState } from 'react';
import { API_BASE } from '../lib/api';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmVisible, setConfirmVisible] = useState(false);

  const isStrongPassword = password.length >= 8;
  const allFieldsFilled =
    name  && email && dob && isStrongPassword && confirmPassword === password;

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  };

  const handleSubmit = async () => {
  if (!allFieldsFilled) return;

  try {
    const res = await axios.post(`${API_BASE}/api/send-otp`, { email });

    if (res.data.success) {
      console.log("✅ OTP sent successfully:", res.data);

      // Show dev OTP (for development only)
      if (res.data.devOtp) {
        console.log("🧩 DEV OTP:", res.data.devOtp);
        alert(`🧩 Dev OTP: ${res.data.devOtp}`);
      }

      navigation.navigate('OtpScreen', {
        name,
        email,
        dob: formatDate(dob),
        devOtp: res.data.devOtp || null,
      });
    } else {
      alert("OTP failed to send: " + res.data.message);
    }
    } catch (err) {
      console.error('Failed to send OTP', err);
      alert('Failed to send OTP. Please try again.');
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Text style={styles.authSwitch}>Log in or Sign up</Text>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={[styles.container, { paddingBottom: 400 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Sign up</Text>

          <Text style={styles.label}>Name</Text>
          <TextInput
            placeholder="Enter your first and last name"
            style={[styles.input, focusedField === 'name' && styles.focusedInput]}
            value={name}
            onChangeText={setName}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField('')}
          />

          <Text style={styles.label}>Email</Text>
            <TextInput
            placeholder="Enter your email address"
            keyboardType="email-address"
            autoCapitalize="none"
            style={[styles.input, focusedField === 'email' && styles.focusedInput]}
            value={email}
            onChangeText={setEmail}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField('')}
            />

          <Text style={styles.label}>Year of birth (mm/dd/yyyy)</Text>
          <Pressable onPress={() => setShowPicker(true)} style={styles.datePicker}>
            <Text style={{ color: dob ? '#000' : '#aaa', fontSize: 16 }}>
              {dob ? formatDate(dob) : 'MM/DD/YYYY'}
            </Text>
            <Ionicons name="calendar-outline" size={20} color="#888" />
          </Pressable>

          {showPicker && (
            <DateTimePicker
              value={dob || new Date(new Date().setFullYear(new Date().getFullYear() - 18))}
              mode="date"
              display="default"
              maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 18))}
              minimumDate={new Date(1900, 0, 1)}
              onChange={(event, selectedDate) => {
                setShowPicker(false);
                if (selectedDate) {
                  // Validate age is at least 18
                  const today = new Date();
                  const age = today.getFullYear() - selectedDate.getFullYear();
                  const monthDiff = today.getMonth() - selectedDate.getMonth();
                  const dayDiff = today.getDate() - selectedDate.getDate();

                  const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

                  if (actualAge < 18) {
                    alert('You must be at least 18 years old to sign up.');
                    return;
                  }
                  setDob(selectedDate);
                }
              }}
            />
          )}

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              placeholder="Create a password (min. 8 characters)"
              secureTextEntry={!isPasswordVisible}
              style={[styles.plainInput, focusedField === 'password' && styles.focusedInput]}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField('')}
              autoCapitalize="none"
              autoCorrect={false}
              importantForAutofill="no"
              textContentType="oneTimeCode" // 👈 this is the trick to block iOS password autofill
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!isPasswordVisible)}>
              <Ionicons name={isPasswordVisible ? 'eye-off' : 'eye'} size={20} color="#888" />
            </TouchableOpacity>
          </View>
          {password ? (
            <Text style={{ color: isStrongPassword ? 'green' : 'red', marginBottom: 10 }}>
              {isStrongPassword ? '✓ Password Strength' : 'Password must be at least 8 characters'}
            </Text>
          ) : null}

          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              placeholder="Re-enter your password"
              secureTextEntry={!isConfirmVisible}
              style={[styles.plainInput, focusedField === 'confirmPassword' && styles.focusedInput]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onFocus={() => setFocusedField('confirmPassword')}
              onBlur={() => setFocusedField('')}
              autoCapitalize="none"
              autoCorrect={false}
              importantForAutofill="no"
              textContentType="oneTimeCode"
            />
            <TouchableOpacity onPress={() => setConfirmVisible(!isConfirmVisible)}>
              <Ionicons name={isConfirmVisible ? 'eye-off' : 'eye'} size={20} color="#888" />
            </TouchableOpacity>
          </View>

          <View style={styles.agreementContainer}>
            <Text style={styles.agreement}>
              By selecting Continue, I agree to Averulo's{' '}
            </Text>
            <TouchableOpacity onPress={() => alert('Terms of Service - Coming soon')}>
              <Text style={styles.link}>Terms of Service</Text>
            </TouchableOpacity>
            <Text style={styles.agreement}>, </Text>
            <TouchableOpacity onPress={() => alert('Payments Terms of Service - Coming soon')}>
              <Text style={styles.link}>Payments Terms of Service</Text>
            </TouchableOpacity>
            <Text style={styles.agreement}>, and </Text>
            <TouchableOpacity onPress={() => alert('Nondiscretionary Policy - Coming soon')}>
              <Text style={styles.link}>Nondiscretionary Policy</Text>
            </TouchableOpacity>
            <Text style={styles.agreement}>, and acknowledge the </Text>
            <TouchableOpacity onPress={() => alert('Privacy Policy - Coming soon')}>
              <Text style={styles.link}>Privacy Policy</Text>
            </TouchableOpacity>
            <Text style={styles.agreement}>.</Text>
          </View>
        </ScrollView>

        <View style={{ padding: 20 }}>
          <TouchableOpacity
            disabled={!allFieldsFilled}
            style={[
              styles.continueBtn,
              { backgroundColor: allFieldsFilled ? '#000A63' : '#A5B4FC' },
            ]}
            onPress={handleSubmit}
          >
            <Text style={styles.continueText}>Continue</Text>

          </TouchableOpacity>

          {/* Login Link */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={styles.loginLinkContainer}
          >
            <Text style={styles.loginLinkText}>
              Already have an account? <Text style={styles.loginLinkBold}>Log in</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    marginTop: 40,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
  },
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
    borderColor: '#9333EA',
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 20,
  },
  agreementContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    marginBottom: 20,
  },
  agreement: {
    fontSize: 12,
    color: '#666',
  },
  link: {
    color: '#000A63',
    fontWeight: '500',
    fontSize: 12,
  },
  continueBtn: {
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  authSwitch: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 12,
  },
  loginLinkContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: 14,
    color: '#666',
  },
  loginLinkBold: {
    color: '#000A63',
    fontWeight: '600',
  },
});