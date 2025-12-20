// screens/host/HostOnboardingScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY_DARK = "#04123C";
const TEXT_DARK = "#111827";
const TEXT_MEDIUM = "#6B7280";
const BORDER_GRAY = "#E5E7EB";

export default function HostOnboardingScreen() {
  const navigation = useNavigation();
  const [agreed, setAgreed] = useState(false);

  const handleLetsGo = () => {
    if (!agreed) {
      alert("Please agree to the terms by checking the box");
      return;
    }
    // Navigate to property creation
    navigation.navigate("CreatePropertyScreen");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* BACK BUTTON */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={TEXT_DARK} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* MAIN TITLE */}
        <Text style={styles.mainTitle}>Ready to Host?</Text>
        <Text style={styles.subtitle}>
          You're about to join thousands of property owners earning extra income
          by welcoming travelers
        </Text>

        {/* WHAT YOU'LL NEED SECTION */}
        <Text style={styles.sectionTitle}>What You'll Need to Get Started</Text>

        <RequirementItem
          text="Property photos (at least 5-10 high-quality images)"
        />
        <RequirementItem
          text="Property documents (ownership proof, permits if required)"
        />
        <RequirementItem text="Valid government ID" />
        <RequirementItem text="Property address and access instructions" />
        <RequirementItem text="Basic property details (rooms, bathrooms, amenities)" />

        {/* HOW HOSTING WORKS SECTION */}
        <Text style={styles.sectionTitle}>How Hosting Works</Text>

        <StepItem text="Create your listing with photos and description" />
        <StepItem text="Set your pricing and availability" />
        <StepItem text="Guests book and pay through the platform" />
        <StepItem text="You receive booking notifications" />
        <StepItem text="Welcome guests and provide great experience" />
        <StepItem text="Get paid automatically after guest check-in" />
      </ScrollView>

      {/* FIXED BOTTOM SECTION */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setAgreed(!agreed)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
            {agreed && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
          </View>
          <Text style={styles.checkboxText}>I understand!</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.letsGoButton, !agreed && styles.buttonDisabled]}
          onPress={handleLetsGo}
          disabled={!agreed}
        >
          <Text style={styles.letsGoButtonText}>Let's go</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// REQUIREMENT ITEM COMPONENT
function RequirementItem({ text }) {
  return (
    <View style={styles.requirementItem}>
      <View style={styles.bulletDot} />
      <Text style={styles.requirementText}>{text}</Text>
    </View>
  );
}

// STEP ITEM COMPONENT
function StepItem({ text }) {
  return (
    <View style={styles.stepItem}>
      <View style={styles.bulletDot} />
      <Text style={styles.stepText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  mainTitle: {
    fontSize: 28,
    fontWeight: "700",
    fontFamily: "Manrope-Bold",
    color: TEXT_DARK,
    marginTop: 24,
    marginBottom: 12,
    lineHeight: 36,
  },

  subtitle: {
    fontSize: 15,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
    lineHeight: 24,
    marginBottom: 32,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: TEXT_DARK,
    marginTop: 24,
    marginBottom: 16,
  },

  requirementItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    paddingLeft: 4,
  },

  stepItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    paddingLeft: 4,
  },

  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: TEXT_DARK,
    marginTop: 8,
    marginRight: 12,
  },

  requirementText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
    lineHeight: 22,
  },

  stepText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
    lineHeight: 22,
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 30,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: BORDER_GRAY,
  },

  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: BORDER_GRAY,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  checkboxChecked: {
    backgroundColor: PRIMARY_DARK,
    borderColor: PRIMARY_DARK,
  },

  checkboxText: {
    fontSize: 15,
    fontFamily: "Manrope-Medium",
    color: TEXT_DARK,
  },

  letsGoButton: {
    backgroundColor: PRIMARY_DARK,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  letsGoButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Manrope-Bold",
  },
});
