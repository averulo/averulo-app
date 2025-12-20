// screens/host/BecomeHostScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY_DARK = "#04123C";
const TEXT_DARK = "#012232";
const TEXT_MEDIUM = "#3E5663";

export default function BecomeHostScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* BACK BUTTON */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={TEXT_DARK} />
          </TouchableOpacity>
        </View>

        {/* ILLUSTRATION */}
        <View style={styles.illustrationContainer}>
          <Image
            source={require('../../assets/images/host-illustration.png')}
            style={styles.illustrationImage}
            resizeMode="cover"
          />
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
          onPress={() => navigation.navigate("HostOnboardingScreen")}
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
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  illustrationContainer: {
    width: "100%",
    height: 386,
    overflow: "hidden",
  },

  illustrationImage: {
    width: "100%",
    height: "100%",
  },

  content: {
    paddingHorizontal: 16,
    marginTop: 32,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Manrope-Bold",
    color: TEXT_DARK,
    lineHeight: 24,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    fontWeight: "300",
    fontFamily: "Manrope-Light",
    color: TEXT_MEDIUM,
    lineHeight: 16,
  },

  continueButton: {
    backgroundColor: PRIMARY_DARK,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginTop: "auto",
    marginBottom: 40,
    height: 56,
  },

  continueButtonText: {
    color: "#FCFEFE",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    lineHeight: 24,
  },
});
