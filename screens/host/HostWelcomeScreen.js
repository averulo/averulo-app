// screens/host/HostWelcomeScreen.js
import { useNavigation } from "@react-navigation/native";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../hooks/useAuth";

const PRIMARY_DARK = "#04123C";
const TEXT_DARK = "#1F2937";
const TEXT_MEDIUM = "#6B7280";
const BG_WHITE = "#FFFFFF";

export default function HostWelcomeScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const userName = user?.name || "John Peter";

  const handleContinue = () => {
    // Navigate to host dashboard
    navigation.navigate("HostDashboardScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Hero Image */}
        <Image
          source={{
            uri: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
          }}
          style={styles.heroImage}
          resizeMode="cover"
        />

        {/* Welcome Text */}
        <View style={styles.textContainer}>
          <Text style={styles.welcomeTitle}>Welcome, {userName}</Text>
          <Text style={styles.welcomeSubtitle}>
            We are excited for you to be part of our family
          </Text>
        </View>
      </View>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBF4F8",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  heroImage: {
    width: "100%",
    height: "60%",
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
  },
  textContainer: {
    marginTop: 40,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "700",
    fontFamily: "Manrope-Bold",
    color: TEXT_DARK,
    textAlign: "center",
    marginBottom: 12,
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
    textAlign: "center",
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  continueButton: {
    backgroundColor: PRIMARY_DARK,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  continueButtonText: {
    color: BG_WHITE,
    fontSize: 17,
    fontWeight: "700",
    fontFamily: "Manrope-Bold",
  },
});
