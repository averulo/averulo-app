// screens/MyBookingsScreen.js
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../hooks/useAuth";
import { API_BASE } from "../lib/api";

export default function MyBookingsScreen() {
  const { token } = useAuth();
  const navigation = useNavigation();

  const [bookings, setBookings] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const BASE = API_BASE || "http://192.168.100.6:4000";

  // ✅ Fetch bookings + analytics
  const fetchBookings = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);

    try {
      const [bRes, aRes] = await Promise.all([
        axios.get(`${BASE}/api/bookings/me`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BASE}/api/bookings/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setBookings(bRes.data || []);
      setSummary(aRes.data?.summary || null);
    } catch (err) {
      console.log("Error loading bookings:", err?.message || err);
      setError("Failed to load bookings. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [token]);

  // ✅ Filters
  const filters = ["All", "Pending", "Approved", "Rejected", "Cancelled"];

  const filtered = useMemo(() => {
    if (activeFilter === "All") return bookings;
    const want = activeFilter.toUpperCase();
    return bookings.filter((b) => b.status === want);
  }, [bookings, activeFilter]);

  // ✅ Refresh control
  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  // ✅ Dummy fallback (optional)
  const dummyData = [
    {
      id: "b1",
      property: { title: "Banana Island Villa", city: "Lagos", nightlyPrice: 150000 },
      startDate: "2025-10-15",
      endDate: "2025-10-17",
      status: "APPROVED",
    },
    {
      id: "b2",
      property: { title: "Eko Pearl Tower", city: "Victoria Island", nightlyPrice: 120000 },
      startDate: "2025-11-01",
      endDate: "2025-11-05",
      status: "PENDING",
    },
    {
      id: "b3",
      property: { title: "Lekki Luxury Suite", city: "Lekki Phase 1", nightlyPrice: 95000 },
      startDate: "2025-09-20",
      endDate: "2025-09-22",
      status: "REJECTED",
    },
  ];

  const displayData = filtered.length === 0 && !loading ? dummyData : filtered;

  // ✅ Early states
  if (!token) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#000A63", textAlign: "center", fontWeight: "600" }}>
          Please sign in to view your bookings.
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000A63" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>{error}</Text>
        <TouchableOpacity onPress={fetchBookings} style={styles.retryBtn}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Summary */}
      {summary && (
        <View style={styles.summaryBox}>
          <Text style={styles.summaryText}>
            Total Bookings: {summary.totalBookings} | Total Spent: ₦
            {Number(summary.totalSpent || 0).toLocaleString()}
          </Text>
        </View>
      )}

      {/* Filters */}
      <View style={styles.filterRow}>
        {filters.map((status) => (
          <TouchableOpacity
            key={status}
            onPress={() => setActiveFilter(status)}
            style={[
              styles.filterBtn,
              activeFilter === status && styles.filterActive,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === status && styles.filterTextActive,
              ]}
            >
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Booking List */}
      <FlatList
        data={displayData}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No bookings found.</Text>
        }
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => {
        const prop = item.property || {};
        const statusStyle =
            item.status === "APPROVED"
            ? styles.approved
            : item.status === "REJECTED"
            ? styles.rejected
            : item.status === "CANCELLED"
            ? styles.cancelled
            : styles.pending;

        return (
            <TouchableOpacity
            onPress={() =>
                navigation.navigate("PropertyDetailsScreen", { id: prop.id })
            }
            >
            <View style={[styles.card, statusStyle]}>
                <Text style={styles.title}>{prop.title ?? "Untitled stay"}</Text>
                <Text style={styles.city}>{prop.city ?? "-"}</Text>
                <Text style={styles.dates}>
                {new Date(item.startDate).toLocaleDateString()} –{" "}
                {new Date(item.endDate).toLocaleDateString()}
                </Text>
                {prop.nightlyPrice != null && (
                <Text style={styles.price}>
                    ₦{Number(prop.nightlyPrice).toLocaleString()}/night
                </Text>
                )}
                <Text style={styles.status}>{item.status}</Text>

                {/* 👇 Add your View Receipt button right here */}
                <TouchableOpacity
                onPress={() =>
                    navigation.navigate("BookingReceipt", { bookingId: item.id })
                }
                style={styles.receiptBtn}
                >
                <Text style={styles.receiptText}>View Receipt</Text>
                </TouchableOpacity>
            </View>
            </TouchableOpacity>
        );
        }}
      />
      </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  summaryBox: {
    backgroundColor: "#000A63",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  summaryText: { color: "#fff", fontWeight: "600", textAlign: "center" },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  filterBtn: {
    borderWidth: 1,
    borderColor: "#000A63",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginVertical: 4,
  },
  filterActive: { backgroundColor: "#000A63" },
  filterText: { color: "#000A63", fontSize: 13, fontWeight: "500" },
  filterTextActive: { color: "#fff" },
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  approved: { borderLeftColor: "green", borderLeftWidth: 4 },
  pending: { borderLeftColor: "#EAB308", borderLeftWidth: 4 },
  rejected: { borderLeftColor: "red", borderLeftWidth: 4 },
  cancelled: { borderLeftColor: "#555", borderLeftWidth: 4 },
  title: { fontSize: 16, fontWeight: "bold" },
  city: { color: "#666" },
  dates: { fontSize: 13, color: "#444" },
  price: { marginTop: 4, fontWeight: "500" },
  status: {
    marginTop: 4,
    textTransform: "capitalize",
    fontWeight: "bold",
    color: "#000A63",
  },
  empty: { textAlign: "center", marginTop: 30, color: "#666" },
  retryBtn: {
    marginTop: 10,
    backgroundColor: "#000A63",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryText: { color: "#fff", fontWeight: "600" },
  receiptBtn: {
  marginTop: 8,
  alignSelf: "flex-start",
  backgroundColor: "#000A63",
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 8,
},
receiptText: {
  color: "#fff",
  fontWeight: "600",
  fontSize: 13,
},
});