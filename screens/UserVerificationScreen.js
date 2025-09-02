import { Ionicons } from "@expo/vector-icons"; // <-- You forgot this!
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { Image, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const idTypes = [
  { label: "National Drivers Licence", value: "drivers-license" },
  { label: "Passport", value: "passport" },
  { label: "National Identification Number", value: "national-id" },
];

export default function UserVerificationScreen({ navigation }) {
  const [selectedIdType, setSelectedIdType] = useState(idTypes[0].value);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrow}>
          <Ionicons name="arrow-back" size={28} color="#0B1A63" />
        </TouchableOpacity>
        <Text style={styles.authSwitch}>Verify</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Text style={styles.skip}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Users Verification</Text>
        <Text style={styles.inputLabel}>Please select your preferred ID</Text>
        <View style={styles.dropdownBox}>
          <Picker
            selectedValue={selectedIdType}
            onValueChange={(itemValue) => setSelectedIdType(itemValue)}
            style={styles.picker}
            mode="dropdown"
            dropdownIconColor="#0B1A63"
          >
            {idTypes.map((type) => (
              <Picker.Item key={type.value} label={type.label} value={type.value} />
            ))}
          </Picker>
        </View>

        {/* Card for Illustration and Guidelines */}
        <View style={styles.illustrationCard}>
          <Image
            source={require("../assets/images/id-card-illustration.png")}
            style={styles.idCardImg}
            resizeMode="contain"
          />
          <Text style={styles.illustrationTitle}>Get your ID card ready</Text>
          <Text style={styles.illustrationSub}>
            You'll capture the front and back of the ID
          </Text>
          <View style={styles.guidelineRow}>
            <Image
              source={require("../assets/images/guidelines.png")}
              style={styles.guidelineImg}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.guidelineHint}>No Crop, No Blur, No Glare</Text>
        </View>

        {/* Please avoid using */}
        <View style={styles.bottomCard}>
          <Text style={styles.avoidTitle}>Please avoid using</Text>
          <Text style={styles.avoidItem}>• Expired ID</Text>
          <Text style={styles.avoidItem}>• Photocopied or printed ID</Text>
        </View>
      </View>

      {/* Continue Button */}
      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => navigation.navigate("TakePhotoOfID", { idType: selectedIdType })}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: Platform.OS === "ios" ? 16 : 10,
    height: 44,
  },
  backArrow: {
    padding: 0,
    marginRight: 6,
  },
  headerTitle: { fontSize: 18, color: "#0B1A63", fontWeight: "600" },
  skip: { fontSize: 16, color: "#0B1A63", fontWeight: "500" },

  content: { flex: 1, paddingHorizontal: 20 },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#0B1A63",
    textAlign: "left",
    marginTop: 16,
    marginBottom: 10,
  },
  inputLabel: { fontSize: 16, color: "#222", marginBottom: 5 },
  dropdownBox: {
    borderWidth: 1,
    borderColor: "#A5B4FC",
    borderRadius: 10,
    marginBottom: 22,
    justifyContent: "center",
    height: 50,
    overflow: "hidden",
  },
  picker: { height: 50, width: "100%" },

  // Card for Illustration & guidelines
  illustrationCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 20,
    alignItems: "center",
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  idCardImg: {
    width: 180, // bigger than before!
    height: 80,
    marginBottom: 10,
  },
  illustrationTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#0B1A63",
    marginTop: 4,
    marginBottom: 2,
    textAlign: "center",
  },
  illustrationSub: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginBottom: 12,
  },
  guidelineRow: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginTop: 6,
    marginBottom: 6,
  },
  guidelineImg: {
    width: 240,
    height: 50,
  },
  guidelineHint: {
    fontSize: 15,
    color: "#0B1A63",
    fontWeight: "600",
    marginTop: 3,
    textAlign: "center",
  },

  // Avoid using card
  bottomCard: {
    backgroundColor: "#F5F6FA",
    borderRadius: 10,
    padding: 15,
    marginTop: 22,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#F6E8CE",
    minHeight: 68,
  },
  avoidTitle: { color: "#C29215", fontWeight: "bold", fontSize: 15, marginBottom: 6 },
  avoidItem: { color: "#C29215", fontSize: 15, marginLeft: 10, marginBottom: 2 },

  bottomArea: {
    padding: 20,
    backgroundColor: "#fff",
  },
  continueBtn: {
    backgroundColor: "#0B1A63",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    marginBottom: Platform.OS === "ios" ? 0 : 8,
  },
  continueText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});