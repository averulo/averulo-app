// screens/host/BecomeHostScreen.js
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY_DARK = "#000A63";

export default function BecomeHostScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* TOP: LOG IN LINK */}
        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.loginText}>Log in</Text>
        </TouchableOpacity>

        {/* ILLUSTRATION */}
        <View style={styles.illustrationContainer}>
          {/* TODO: Add host-onboarding.png to assets folder */}
          <View style={styles.illustrationPlaceholder}>
            <Text style={styles.illustrationEmoji}>🏠</Text>
            <Text style={styles.illustrationEmoji}>✅</Text>
            <Text style={styles.illustrationEmoji}>📅</Text>
          </View>
        </View>

        {/* CONTENT */}
        <View style={styles.content}>
          <Text style={styles.title}>Become a Host in 5 min</Text>
          <Text style={styles.subtitle}>
            Join us. We'll help you every steps of the way
          </Text>
        </View>

        {/* CONTINUE BUTTON */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.navigate("HostOnboardingFlow")}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  loginLink: {
    alignSelf: "flex-start",
    paddingVertical: 8,
  },

  loginText: {
    fontSize: 16,
    color: PRIMARY_DARK,
    fontFamily: "Manrope-Medium",
  },

  illustrationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 40,
  },

  illustration: {
    width: "100%",
    height: "100%",
    maxHeight: 400,
  },

  illustrationPlaceholder: {
    width: "100%",
    height: 300,
    backgroundColor: "#F0F4FF",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 20,
  },

  illustrationEmoji: {
    fontSize: 60,
  },

  content: {
    marginBottom: 40,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    fontFamily: "Manrope-Bold",
    color: "#111",
    marginBottom: 12,
    lineHeight: 40,
  },

  subtitle: {
    fontSize: 16,
    fontFamily: "Manrope-Regular",
    color: "#6B7280",
    lineHeight: 24,
  },

  continueButton: {
    backgroundColor: PRIMARY_DARK,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },

  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Manrope-Bold",
  },
});
