// screens/MyBookingsScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../hooks/useAuth";

const PRIMARY = "#000A63";
const MUTED = "#6B7280";
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function MyBookingsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user, token } = useAuth();

  const { property } = route.params || {};
  if (!property) {
    return (
      <View style={styles.center}>
        <Text>No property selected.</Text>
      </View>
    );
  }

  const basePrice = property.price || 0;

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [requests, setRequests] = useState("");

  const [extras, setExtras] = useState({
    earlyCheckIn: false,
    lateCheckout: false,
    airportPickup: false,
    valetParking: false,
    rides: false,
    birthday: false,
    flowers: false,
    customCall: false,
    wheelchairRoom: false,
    grabBars: false,
  });

  const [total, setTotal] = useState(basePrice);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const extraCost =
      (extras.earlyCheckIn ? 15000 : 0) +
      (extras.lateCheckout ? 15000 : 0) +
      (extras.airportPickup ? 20000 : 0) +
      (extras.valetParking ? 10000 : 0) +
      (extras.rides ? 8000 : 0) +
      (extras.birthday ? 12000 : 0) +
      (extras.flowers ? 10000 : 0) +
      (extras.customCall ? 5000 : 0);

    setTotal(basePrice + extraCost);
  }, [extras, basePrice]);

  const toggleChip = (key) => {
    setExtras((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleBookNow = async () => {
    if (!name || !email || !phone) {
      alert("Fill name, email & phone.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://192.168.100.6:4000/api/bookings",
        {
          propertyId: property.id,
          name,
          email,
          phone,
          requests,
          extras,
          total,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        navigation.navigate("BookingSuccess", { booking: res.data.booking });
      } else {
        alert(res.data.message || "Booking failed");
      }
    } catch {
      alert("Unable to book");
    } finally {
      setLoading(false);
    }
  };

  const descriptionText =
    property.description ||
    "Hotel with free parking, well-lit rooms and recreation park nearby.";

  const heroImage =
    property.images?.[0]?.url ||
    "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg";

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* HERO IMAGE */}
      <View style={styles.heroContainer}>
        <Image source={{ uri: heroImage }} style={styles.heroImage} />
        <View style={styles.heroOverlay}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconCircle}
          >
            <Ionicons name="arrow-back" size={20} color="#111827" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconCircle}>
            <Ionicons name="heart-outline" size={20} color="#111827" />
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        {/* Top summary */}
        <Text style={styles.propertyTitle}>{property.title}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.pricePrimary}>₦{basePrice.toLocaleString()}</Text>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color="#FBBF24" />
            <Text style={styles.ratingText}>
              {property.avgRating?.toFixed(1) || "4.5"}
            </Text>
          </View>
        </View>

        <Text style={styles.description}>{descriptionText}</Text>

        {/* WHO IS THE GUEST */}
        <Text style={styles.sectionTitle}>Who’s the guest?</Text>

        <Text style={styles.fieldLabel}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="John Peter"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.fieldLabel}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="johnpeter200@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.fieldLabel}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="07012345678"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        {/* SPECIAL REQUESTS */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
          Make special requests
        </Text>

        {/* GROUPS EXACTLY LIKE FIGMA */}
        {renderGroup("Check-in and Check-out", [
          { key: "earlyCheckIn", label: "Early check-in" },
          { key: "lateCheckout", label: "Late check-out" },
        ])}

        {renderGroup("Transportation and Parking", [
          { key: "airportPickup", label: "Airport pick-up or drop-off" },
          { key: "valetParking", label: "Valet parking" },
          { key: "rides", label: "Rides" },
        ])}

        {renderGroup("Special Occasions", [
          { key: "birthday", label: "Birthday" },
          { key: "flowers", label: "Flowers in the room" },
          { key: "customCall", label: "Customized call" },
        ])}

        {renderGroup("Accessibility Needs", [
          { key: "wheelchairRoom", label: "Wheelchair-accessible room" },
          { key: "grabBars", label: "Grab bars in the tub" },
        ])}

        {/* TEXTAREA */}
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Add notes (e.g. room preference)"
          multiline
          value={requests}
          onChangeText={setRequests}
        />

        {/* BOTTOM SUMMARY */}
        <View style={styles.bottomSummary}>
          <Text style={styles.bottomTitle}>{property.title}</Text>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color="#FBBF24" />
            <Text style={styles.ratingText}>
              {property.avgRating?.toFixed(1) || "4.5"}
            </Text>
          </View>

          <Text style={styles.bottomPrice}>
            ₦{basePrice.toLocaleString()}
          </Text>

          <Text style={styles.description}>{descriptionText}</Text>
        </View>

        {/* TOTAL */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₦{total.toLocaleString()}</Text>
        </View>

        {/* BOOK NOW */}
        <TouchableOpacity
          style={[styles.bookBtn, loading && { opacity: 0.7 }]}
          onPress={handleBookNow}
          disabled={loading}
        >
          <Text style={styles.bookText}>
            {loading ? "Processing..." : "BOOK NOW"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  function renderGroup(title, items) {
    return (
      <>
        <Text style={styles.groupLabel}>{title}</Text>
        <View style={styles.chipWrap}>
          {items.map((i) => (
            <Chip
              key={i.key}
              label={i.label}
              active={extras[i.key]}
              onPress={() => toggleChip(i.key)}
            />
          ))}
        </View>
      </>
    );
  }
}

function Chip({ label, active, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, active && { backgroundColor: PRIMARY }]}
    >
      <Text style={[styles.chipText, active && { color: "#fff" }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  heroContainer: { width: SCREEN_WIDTH, height: 220 },
  heroImage: { width: "100%", height: "100%" },
  heroOverlay: {
    position: "absolute",
    top: 40,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },

  content: { paddingHorizontal: 24, paddingTop: 20 },

  propertyTitle: { fontSize: 20, fontWeight: "700", color: "#111827" },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    marginBottom: 10,
    alignItems: "center",
  },
  pricePrimary: { fontSize: 20, fontWeight: "700", color: PRIMARY },

  ratingRow: { flexDirection: "row", alignItems: "center" },
  ratingText: { marginLeft: 4, fontSize: 13, color: MUTED },

  description: {
    fontSize: 13,
    color: MUTED,
    lineHeight: 18,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: PRIMARY,
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 13,
    color: MUTED,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 12,
  },
  textarea: {
    height: 90,
    textAlignVertical: "top",
    marginTop: 8,
  },

  groupLabel: {
    fontSize: 11,
    color: MUTED,
    marginTop: 12,
    marginBottom: 6,
  },

  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
  },
  chipText: { fontSize: 13, color: "#111827" },

  bottomSummary: { marginTop: 28 },
  bottomTitle: { fontSize: 13, fontWeight: "600", color: "#111827" },
  bottomPrice: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: "700",
    color: PRIMARY,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    alignItems: "center",
  },
  totalLabel: { fontSize: 16, fontWeight: "600", color: "#111827" },
  totalValue: { fontSize: 18, fontWeight: "700", color: PRIMARY },

  bookBtn: {
    backgroundColor: PRIMARY,
    marginTop: 16,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
  },
  bookText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});