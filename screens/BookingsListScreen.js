// screens/BookingsListScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../hooks/useAuth";
import Constants from "expo-constants";

const API_BASE = Constants.expoConfig?.extra?.apiUrl || "http://192.168.100.6:4000";

const PRIMARY_DARK = "#04123C";
const TEXT_DARK = "#012232";
const TEXT_MEDIUM = "#3E5663";
const TEXT_LIGHT = "#5F737D";
const BG_GRAY = "#F1F3F4";
const BORDER_GRAY = "#D4DADC";

export default function BookingsListScreen() {
  const navigation = useNavigation();
  const { token, user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all"); // all, upcoming, completed

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  async function fetchBookings() {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/bookings/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch bookings");

      const data = await res.json();
      let filtered = data || [];

      // Apply filter
      if (filter === "upcoming") {
        filtered = filtered.filter(b => new Date(b.endDate) >= new Date());
      } else if (filter === "completed") {
        filtered = filtered.filter(b => new Date(b.endDate) < new Date());
      }

      setBookings(filtered);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      setBookings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function onRefresh() {
    setRefreshing(true);
    fetchBookings();
  }

  function getStatusColor(status) {
    switch (status?.toUpperCase()) {
      case "CONFIRMED":
        return "#10B981";
      case "PENDING":
        return "#F59E0B";
      case "CANCELLED":
        return "#EF4444";
      default:
        return TEXT_MEDIUM;
    }
  }

  function getPaymentStatusColor(status) {
    switch (status?.toUpperCase()) {
      case "SUCCESS":
        return "#10B981";
      case "PENDING":
        return "#F59E0B";
      case "FAILED":
        return "#EF4444";
      default:
        return TEXT_MEDIUM;
    }
  }

  function renderBookingCard({ item }) {
    const property = item.property || {};
    const imageUrl =
      property.images?.[0]?.url ||
      property.image ||
      "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg";

    const startDate = new Date(item.startDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const endDate = new Date(item.endDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const isUpcoming = new Date(item.endDate) >= new Date();

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("ViewBookingDetailsScreen", {
            booking: item,
            property: property,
            checkIn: startDate,
            checkOut: endDate,
            guestName: item.guestName || user?.name,
            email: item.guestEmail || user?.email,
            phone: item.guestPhone,
            notes: item.notes,
          })
        }
      >
        <Image source={{ uri: imageUrl }} style={styles.cardImage} />

        <View style={styles.cardContent}>
          {/* Property Title */}
          <Text style={styles.propertyTitle} numberOfLines={1}>
            {property.title || "Property"}
          </Text>

          {/* Booking Code */}
          <View style={styles.row}>
            <Ionicons name="receipt-outline" size={14} color={TEXT_MEDIUM} />
            <Text style={styles.bookingCode}>
              {item.bookingCode || item.id?.slice(0, 8)}
            </Text>
          </View>

          {/* Dates */}
          <View style={styles.row}>
            <Ionicons name="calendar-outline" size={14} color={TEXT_MEDIUM} />
            <Text style={styles.dateText}>
              {startDate} - {endDate}
            </Text>
          </View>

          {/* Status Row */}
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(item.status) + "20" },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(item.status) },
                ]}
              >
                {item.status || "Pending"}
              </Text>
            </View>

            {item.paymentStatus && (
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getPaymentStatusColor(item.paymentStatus) + "20" },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: getPaymentStatusColor(item.paymentStatus) },
                  ]}
                >
                  {item.paymentStatus}
                </Text>
              </View>
            )}
          </View>

          {/* Price */}
          <Text style={styles.price}>
            ₦{((item.totalAmount || 0) / 100).toLocaleString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="person-outline" size={64} color={TEXT_LIGHT} />
          <Text style={styles.emptyTitle}>Please log in</Text>
          <Text style={styles.emptySubtitle}>
            Sign in to view your bookings
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <TouchableOpacity onPress={onRefresh}>
          <Ionicons name="refresh" size={24} color={PRIMARY_DARK} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filter === "all" && styles.filterTabActive]}
          onPress={() => setFilter("all")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "all" && styles.filterTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === "upcoming" && styles.filterTabActive,
          ]}
          onPress={() => setFilter("upcoming")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "upcoming" && styles.filterTextActive,
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === "completed" && styles.filterTabActive,
          ]}
          onPress={() => setFilter("completed")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "completed" && styles.filterTextActive,
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bookings List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={PRIMARY_DARK} />
        </View>
      ) : bookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={64} color={TEXT_LIGHT} />
          <Text style={styles.emptyTitle}>No bookings yet</Text>
          <Text style={styles.emptySubtitle}>
            {filter === "upcoming"
              ? "You don't have any upcoming bookings"
              : filter === "completed"
              ? "You don't have any completed bookings"
              : "Start exploring properties to make your first booking"}
          </Text>
          {filter === "all" && (
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => navigation.navigate("MainTabs", { screen: "ExploreTab" })}
            >
              <Text style={styles.exploreButtonText}>Explore Properties</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={renderBookingCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={PRIMARY_DARK}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_GRAY,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Manrope-Bold",
    color: TEXT_DARK,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: BG_GRAY,
  },
  filterTabActive: {
    backgroundColor: PRIMARY_DARK,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Manrope-Medium",
    color: TEXT_MEDIUM,
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BORDER_GRAY,
  },
  cardImage: {
    width: 120,
    height: 140,
    backgroundColor: BG_GRAY,
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: TEXT_DARK,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  bookingCode: {
    fontSize: 12,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
  },
  dateText: {
    fontSize: 12,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
  },
  statusRow: {
    flexDirection: "row",
    gap: 8,
    marginVertical: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    textTransform: "capitalize",
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Manrope-Bold",
    color: TEXT_DARK,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Manrope-Bold",
    color: TEXT_DARK,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
    textAlign: "center",
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: PRIMARY_DARK,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: "#FFFFFF",
  },
  loginButton: {
    backgroundColor: PRIMARY_DARK,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: "#FFFFFF",
  },
});
