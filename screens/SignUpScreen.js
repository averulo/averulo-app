import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect, useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Platform, Pressable,
  ScrollView, StyleSheet, Text, TextInput, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const API = process.env.EXPO_PUBLIC_API_BASE_URL || '';

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmVisible, setConfirmVisible] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    // @ts-ignore
    navigation.setOptions?.({ headerShown: false });
  }, [navigation]);

  const isValidEmail = (e) => /\S+@\S+\.\S+/.test(e);
  const canSend = isValidEmail(email); // ONLY email gates the button

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };

  const handleSubmit = async () => {
    console.log('[PRESS] Continue tapped. canSend=', canSend, 'loading=', loading);
    if (!canSend) {
      Alert.alert('Invalid email', 'Enter a valid email to continue.');
      return;
    }
    if (!API) {
      Alert.alert('Missing API', 'EXPO_PUBLIC_API_BASE_URL is not set. Check .env and restart Expo.');
      return;
    }

    try {
      setLoading(true);
      console.log('[NETWORK] POST', `${API}/send-otp`, { email });

      const res = await fetch(`${API}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      let data = {};
      try { data = await res.json(); } catch { /* ignore parse errors */ }

      console.log('[NETWORK] status:', res.status, 'data:', data);

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || `Failed to send OTP (${res.status})`);
      }

      // @ts-ignore
      navigation.navigate('OtpScreen', {
        email,
        name,
        dob: formatDate(dob),
      });
    } catch (e) {
      console.log('[ERROR] send-otp:', e);
      Alert.alert('Error', String(e?.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Show API value so we KNOW we’re hitting the right place */}
      <Text style={styles.debug}>API: {API || '(not set)'}</Text>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          // ensure scroll content doesn't sit on top of footer
          style={{ flex: 1 }}
        >
          <Text style={styles.title}>Sign up</Text>

          <Text style={styles.label}>Name</Text>
          <TextInput
            placeholder="Your name"
            style={[styles.input, focusedField === 'name' && styles.focusedInput]}
            value={name}
            onChangeText={setName}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField('')}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="Email address"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={[styles.input, focusedField === 'email' && styles.focusedInput]}
            value={email}
            onChangeText={setEmail}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField('')}
          />

          <Text style={styles.label}>Date of birth (mm/dd/yyyy)</Text>
          <Pressable onPress={() => setShowPicker(true)} style={styles.datePicker}>
            <Text style={{ color: dob ? '#000' : '#aaa', fontSize: 16 }}>
              {dob ? formatDate(dob) : 'MM/DD/YYYY'}
            </Text>
            <Ionicons name="calendar-outline" size={20} color="#888" />
          </Pressable>

          {showPicker && (
            <DateTimePicker
              value={dob || new Date()}
              mode="date"
              display="default"
              onChange={(_, selectedDate) => {
                setShowPicker(false);
                if (selectedDate) setDob(selectedDate);
              }}
            />
          )}

          {/* Keep password fields for visuals — NOT required to send OTP */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              placeholder="********"
              secureTextEntry={!isPasswordVisible}
              style={[styles.plainInput, focusedField === 'password' && styles.focusedInput]}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField('')}
            />
            <Pressable onPress={() => setPasswordVisible(!isPasswordVisible)}>
              <Ionicons name={isPasswordVisible ? 'eye-off' : 'eye'} size={20} color="#888" />
            </Pressable>
          </View>

          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              placeholder="********"
              secureTextEntry={!isConfirmVisible}
              style={[styles.plainInput, focusedField === 'confirmPassword' && styles.focusedInput]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onFocus={() => setFocusedField('confirmPassword')}
              onBlur={() => setFocusedField('')}
            />
            <Pressable onPress={() => setConfirmVisible(!isConfirmVisible)}>
              <Ionicons name={isConfirmVisible ? 'eye-off' : 'eye'} size={20} color="#888" />
            </Pressable>
          </View>

          <Text style={styles.agreement}>
            By selecting Continue, I agree to Averulo’s <Text style={styles.link}>Terms of Service</Text>,{' '}
            <Text style={styles.link}>Payments Terms of Service</Text>, and{' '}
            <Text style={styles.link}>Nondiscretionary Policy</Text>, and acknowledge the{' '}
            <Text style={styles.link}>Privacy Policy</Text>.
          </Text>

          {/* Add bottom spacer so content isn't hidden behind the sticky footer */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Sticky footer button that ALWAYS gets touches */}
        <View style={styles.footer} pointerEvents="box-none">
          <Pressable
            onPress={handleSubmit}
            onPressIn={() => console.log('[PRESS] onPressIn')}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            disabled={!canSend || loading}
            style={[
              styles.cta,
              (!canSend || loading) ? styles.ctaDisabled : styles.ctaEnabled,
            ]}
          >
            <Text style={styles.ctaText}>{loading ? 'Sending…' : 'Continue'}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  flex: { flex: 1 },
  debug: { textAlign: 'center', fontSize: 12, color: '#666', paddingTop: 6 },
  container: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 0 },
  title: { fontSize: 26, fontWeight: 'bold', marginVertical: 16 },
  label: { fontSize: 14, marginBottom: 6, color: '#333' },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 10,
    paddingVertical: 12, paddingHorizontal: 16, marginBottom: 16, fontSize: 16,
  },
  focusedInput: { borderColor: '#9333EA' },
  datePicker: {
    flexDirection: 'row', alignItems: 'center', borderColor: '#ccc', borderWidth: 1,
    padding: 12, borderRadius: 10, marginBottom: 20, justifyContent: 'space-between',
  },
  passwordWrapper: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ccc',
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 20,
  },
  plainInput: { flex: 1, fontSize: 16, color: '#000' },
  agreement: { fontSize: 12, color: '#666', marginTop: 10, marginBottom: 12 },
  link: { color: '#000A63', fontWeight: '500' },

  footer: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e7eb',
  },
  cta: {
    height: 52,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaEnabled: { backgroundColor: '#000A63' },
  ctaDisabled: { backgroundColor: '#A5B4FC' },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});