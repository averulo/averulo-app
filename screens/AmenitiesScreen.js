// screens/AmenitiesScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY = "#000A63";
const MUTED = "#6B7280";

export default function AmenitiesScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { amenities } = route.params || {};

  // You can later pass real amenities from backend.
  const data = amenities || {
    room: ["Air conditioning", "Flat-screen TV", "Wardrobe", "Work desk"],
    bathroom: ["Private bathroom", "Hot shower", "Free toiletries", "Towels"],
    general: ["Free Wi-Fi", "24/7 front desk", "Daily housekeeping"],
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Amenities</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Room amenities</Text>
          {data.room.map((item, idx) => (
            <View key={idx} style={styles.amenityRow}>
              <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
              <Text style={styles.amenityText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bathroom</Text>
          {data.bathroom.map((item, idx) => (
            <View key={idx} style={styles.amenityRow}>
              <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
              <Text style={styles.amenityText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          {data.general.map((item, idx) => (
            <View key={idx} style={styles.amenityRow}>
              <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
              <Text style={styles.amenityText}>{item}</Text>
            </View>
          ))}
        </View>
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
    marginBottom: 8,
  },
  amenityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  amenityText: {
    marginLeft: 8,
    fontSize: 13,
    color: MUTED,
  },
});