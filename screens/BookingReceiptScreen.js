import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useAuth } from "../hooks/useAuth";
import { API_BASE } from "../lib/api";

export default function BookingReceiptScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { bookingId } = route.params || {};
  const { token } = useAuth();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!bookingId || !token) return;

    const fetchBooking = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/bookings/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || `HTTP ${res.status}`);
        }

        const data = await res.json();
        setBooking(data);
      } catch (err) {
        console.error("❌ Error loading booking:", err);
        setError(err.message || "Failed to load booking");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, token]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000A63" />
      </View>
    );
  }

  if (error || !booking) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>{error || "Booking not found"}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: "#000A63", marginTop: 10 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { property, startDate, endDate, totalAmount, status, paymentRef, paymentStatus, currency } = booking;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000A63" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Receipt</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Booking Summary */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Booking Details</Text>
        <Text style={styles.label}>Property</Text>
        <Text style={styles.value}>{property?.title ?? "N/A"}</Text>

        <Text style={styles.label}>Location</Text>
        <Text style={styles.value}>{property?.city ?? "—"}</Text>

        <Text style={styles.label}>Check-in</Text>
        <Text style={styles.value}>
          {new Date(startDate).toLocaleDateString()}
        </Text>

        <Text style={styles.label}>Check-out</Text>
        <Text style={styles.value}>
          {new Date(endDate).toLocaleDateString()}
        </Text>

        <Text style={styles.label}>Status</Text>
        <Text style={[styles.value, styles.status(status)]}>
          {status ?? "Unknown"}
        </Text>
      </View>

      {/* Payment Info */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Payment Information</Text>
        <Text style={styles.label}>Reference</Text>
        <Text style={styles.value}>{paymentRef ?? "—"}</Text>

        <Text style={styles.label}>Status</Text>
        <Text style={styles.value}>
          {paymentStatus ?? "Unpaid"}
        </Text>

        <Text style={styles.label}>Amount</Text>
        <Text style={styles.value}>
          {currency || "₦"}
          {Number(totalAmount || 0).toLocaleString()}
        </Text>
      </View>

      {/* Button */}
      <TouchableOpacity
        style={styles.shareBtn}
        onPress={() => alert("Download or share receipt (coming soon)")}
      >
        <Ionicons name="download-outline" size={18} color="#fff" />
        <Text style={styles.shareText}>Download Receipt</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000A63",
  },
  card: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000A63",
    marginBottom: 10,
  },
  label: { fontSize: 13, color: "#6B7280", marginTop: 6 },
  value: { fontSize: 15, fontWeight: "500", color: "#111827" },
  status: (s) => ({
    color:
      s === "APPROVED"
        ? "green"
        : s === "REJECTED"
        ? "red"
        : s === "PENDING"
        ? "#EAB308"
        : "#555",
  }),
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000A63",
    paddingVertical: 14,
    borderRadius: 10,
  },
  shareText: { color: "#fff", fontWeight: "600", marginLeft: 6 },
});