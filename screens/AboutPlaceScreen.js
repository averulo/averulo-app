// screens/AboutPlaceScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MUTED = "#6B7280";

export default function AboutPlaceScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { description, sections } = route.params || {};

  // You can later pass richer content from backend.
  const content = sections || [
    {
      title: "The space",
      body:
        description ||
        "Spacious modern apartment with a cozy living area, comfortable bedroom and well-equipped kitchen. Perfect for both short and long stays.",
    },
    {
      title: "During your stay",
      body:
        "You’ll have full privacy but can reach the host anytime for support, recommendations or help with transportation.",
    },
    {
      title: "Guest access",
      body:
        "Guests have access to the entire apartment, including living room, bedroom, kitchen and balcony. Parking is available on site.",
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About this place</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {content.map((section, idx) => (
          <View key={idx} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 6,
  },
  sectionBody: {
    fontSize: 13,
    color: MUTED,
    lineHeight: 18,
  },
});