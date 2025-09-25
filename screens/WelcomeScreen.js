import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      {/* Top instruction */}
      <Text style={styles.topInstruction}>Log in or sign up</Text>

      {/* Back arrow */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
        <Ionicons name="chevron-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Welcome!</Text>

      {/* Label */}
      <Text style={styles.label}>Email</Text>

      {/* Email Input */}
      <TextInput
        placeholder="Yourname@gmail.com"
        placeholderTextColor="#aaa"
        style={styles.input}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Continue Button */}
      <TouchableOpacity
        style={[styles.continueBtn, { backgroundColor: email ? '#000A63' : '#9AA9F2' }]}
        disabled={!email}
        onPress={() => {
          // Handle continue logic here (navigate to OTP or dashboard)
        }}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>

      {/* OR divider */}
      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>or</Text>
        <View style={styles.line} />
      </View>

      {/* Social Options */}
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Image source={require('../assets/icons/guest.png')} style={styles.icon} />
          <Text style={styles.socialText}>Continue as Guest</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
          <Image source={require('../assets/icons/google.png')} style={styles.icon} />
          <Text style={styles.socialText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
          <Image source={require('../assets/icons/apple.png')} style={styles.icon} />
          <Text style={styles.socialText}>Continue with Apple</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
          <Image source={require('../assets/icons/facebook.png')} style={styles.icon} />
          <Text style={styles.socialText}>Continue with Facebook</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom link */}
      <View style={styles.bottomTextContainer}>
        <Text style={styles.bottomText}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signUpText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  topInstruction: {
  position: 'absolute',
  top: 10,
  alignSelf: 'center',
  color: '#6e7b8c',
  fontSize: 13,
  zIndex: 10,
},
  backIcon: {
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    textAlign: 'left',
    marginBottom: 24,
    color: '#2b2b2b',
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#2b2b2b',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    color: '#000',
  },
  continueBtn: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  continueText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  orText: {
    marginHorizontal: 10,
    color: '#999',
    fontSize: 14,
  },
  socialContainer: {
    gap: 12,
  },
  socialButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  socialText: {
    fontWeight: '500',
    fontSize: 15,
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  bottomTextContainer: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  bottomText: {
    color: '#888',
    fontSize: 13,
  },
  signUpText: {
    color: '#000A63',
    fontWeight: '600',
    fontSize: 13,
  },
});