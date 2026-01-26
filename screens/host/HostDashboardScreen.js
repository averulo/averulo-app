// screens/host/HostDashboardScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useState, useCallback } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../hooks/useAuth";
import { API_BASE } from "../../lib/api";

const PRIMARY_DARK = "#04123C";
const TEXT_DARK = "#1F2937";
const TEXT_MEDIUM = "#6B7280";
const TEXT_LIGHT = "#9CA3AF";
const BORDER_GRAY = "#E5E7EB";
const BG_WHITE = "#FFFFFF";
const BG_LIGHT = "#F9FAFB";

export default function HostDashboardScreen() {
  const navigation = useNavigation();
  const { user, token } = useAuth();

  const [selectedTab, setSelectedTab] = useState("currently");
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);

  const userName = user?.name || "Host";

  // Fetch host data when screen focuses
  useFocusEffect(
    useCallback(() => {
      fetchHostData();
    }, [token])
  );

  const fetchHostData = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch properties and bookings in parallel
      const [propsRes, bookingsRes] = await Promise.all([
        fetch(`${API_BASE}/api/properties?hostId=${user?.sub || user?.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/api/bookings/host`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (propsRes.ok) {
        const propsData = await propsRes.json();
        setProperties(propsData.data || propsData || []);
      }

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData || []);
      }
    } catch (err) {
      console.log("Host data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Get first property or show placeholder
  const property = properties[0] || null;

  // Count bookings by status
  const today = new Date();
  const checkedOutCount = bookings.filter(b =>
    b.status === 'COMPLETED' || new Date(b.endDate) < today
  ).length;
  const currentCount = bookings.filter(b =>
    b.status === 'APPROVED' &&
    new Date(b.startDate) <= today &&
    new Date(b.endDate) >= today
  ).length;
  const futureCount = bookings.filter(b =>
    (b.status === 'PENDING' || b.status === 'APPROVED') &&
    new Date(b.startDate) > today
  ).length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="home" size={24} color={PRIMARY_DARK} />
          <Text style={styles.headerTitle}>Averulo limited</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => {
              // Switch to guest mode - navigate to main app
              navigation.reset({
                index: 0,
                routes: [{ name: 'MainTabs' }],
              });
            }}
          >
            <Ionicons name="swap-horizontal" size={22} color={PRIMARY_DARK} />
            <Text style={styles.switchButtonText}>Switch to Guest</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <Text style={styles.greeting}>
          Hey {userName}, Ready for your next guest
        </Text>

        {/* Welcome Card */}
        {loading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={PRIMARY_DARK} />
            <Text style={styles.loadingText}>Loading your properties...</Text>
          </View>
        ) : property ? (
          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeText}>Welcome!</Text>
            <Image
              source={{ uri: property.images?.[0]?.url || property.image || "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg" }}
              style={styles.propertyImage}
              resizeMode="cover"
            />
            <View style={styles.propertyInfo}>
              <View style={styles.propertyDetails}>
                <Text style={styles.propertyName}>{property.title || property.name}</Text>
                <Text style={styles.propertyRoom}>{property.city || "Your Property"}</Text>
              </View>
              <Text style={styles.propertyPrice}>₦{(property.nightlyPrice || 0).toLocaleString()}</Text>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.welcomeCard}
            onPress={() => navigation.navigate("CreatePropertyScreen")}
          >
            <Text style={styles.welcomeText}>Get Started!</Text>
            <View style={styles.emptyPropertyCard}>
              <Ionicons name="add-circle-outline" size={48} color={PRIMARY_DARK} />
              <Text style={styles.emptyPropertyText}>Create your first property listing</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* View Bookings Button */}
        <TouchableOpacity
          style={styles.viewBookingsButton}
          onPress={() => navigation.navigate("HostBookingsScreen")}
        >
          <Text style={styles.viewBookingsText}>View Bookings</Text>
        </TouchableOpacity>

        {/* Your Reservation Section */}
        <View style={styles.reservationSection}>
          <Text style={styles.sectionTitle}>Your Reservation</Text>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, selectedTab === "checked-out" && styles.tabActive]}
              onPress={() => setSelectedTab("checked-out")}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === "checked-out" && styles.tabTextActive,
                ]}
              >
                Checked out ({checkedOutCount})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, selectedTab === "currently" && styles.tabActive]}
              onPress={() => setSelectedTab("currently")}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === "currently" && styles.tabTextActive,
                ]}
              >
                Currently guests ({currentCount})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, selectedTab === "future" && styles.tabActive]}
              onPress={() => setSelectedTab("future")}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === "future" && styles.tabTextActive,
                ]}
              >
                Future guest ({futureCount})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Empty State */}
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              You don't have any guests checking{"\n"}out today or tomorrow
            </Text>
          </View>
        </View>

        {/* All Reservation */}
        <TouchableOpacity
          style={styles.allReservationButton}
          onPress={() => navigation.navigate("HostBookingsScreen")}
        >
          <Text style={styles.allReservationText}>All reservation ({bookings.length})</Text>
        </TouchableOpacity>

        {/* Reviews Section */}
        <View style={styles.reviewsSection}>
          <Text style={styles.reviewsTitle}>Reviews</Text>
          <View style={styles.reviewsButtons}>
            <TouchableOpacity style={styles.reviewButton}>
              <Text style={styles.reviewButtonText}>New review</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reviewButton}>
              <Text style={styles.reviewButtonText}>Read</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color={PRIMARY_DARK} />
          <Text style={[styles.navText, styles.navTextActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("ChatScreen")}
        >
          <Ionicons name="chatbubble-outline" size={24} color={TEXT_MEDIUM} />
          <Text style={styles.navText}>Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("HostCalendarScreen")}
        >
          <Ionicons name="calendar-outline" size={24} color={TEXT_MEDIUM} />
          <Text style={styles.navText}>Calendar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("HostStatisticsScreen")}
        >
          <Ionicons name="stats-chart-outline" size={24} color={TEXT_MEDIUM} />
          <Text style={styles.navText}>Statistic</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_WHITE,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_GRAY,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: TEXT_DARK,
  },
  headerRight: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: BG_LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  switchButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: BG_LIGHT,
    borderWidth: 1,
    borderColor: PRIMARY_DARK,
  },
  switchButtonText: {
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: PRIMARY_DARK,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 13,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
    marginTop: 16,
    marginBottom: 16,
  },
  welcomeCard: {
    backgroundColor: BG_WHITE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    padding: 16,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Manrope-Bold",
    color: TEXT_DARK,
    marginBottom: 12,
  },
  propertyImage: {
    width: "100%",
    height: 160,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
    marginBottom: 12,
  },
  propertyInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  propertyDetails: {
    flex: 1,
  },
  propertyName: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Manrope-Medium",
    color: TEXT_DARK,
    marginBottom: 4,
  },
  propertyRoom: {
    fontSize: 12,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
  },
  propertyPrice: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Manrope-Bold",
    color: TEXT_DARK,
  },
  loadingCard: {
    backgroundColor: BG_WHITE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    padding: 40,
    marginBottom: 16,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 14,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
    marginTop: 12,
  },
  emptyPropertyCard: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyPropertyText: {
    fontSize: 14,
    fontFamily: "Manrope-Medium",
    color: TEXT_MEDIUM,
    marginTop: 12,
    textAlign: "center",
  },
  viewBookingsButton: {
    backgroundColor: BG_WHITE,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 24,
  },
  viewBookingsText: {
    fontSize: 15,
    fontWeight: "500",
    fontFamily: "Manrope-Medium",
    color: TEXT_DARK,
  },
  reservationSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Manrope-Bold",
    color: TEXT_DARK,
    marginBottom: 16,
  },
  tabs: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: BG_LIGHT,
  },
  tabActive: {
    backgroundColor: PRIMARY_DARK,
  },
  tabText: {
    fontSize: 12,
    fontFamily: "Manrope-Medium",
    color: TEXT_MEDIUM,
  },
  tabTextActive: {
    color: BG_WHITE,
  },
  emptyState: {
    backgroundColor: BG_LIGHT,
    borderRadius: 12,
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
    textAlign: "center",
    lineHeight: 20,
  },
  allReservationButton: {
    backgroundColor: BG_WHITE,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  allReservationText: {
    fontSize: 15,
    fontWeight: "500",
    fontFamily: "Manrope-Medium",
    color: TEXT_DARK,
  },
  reviewsSection: {
    marginBottom: 24,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Manrope-Bold",
    color: TEXT_DARK,
    marginBottom: 16,
  },
  reviewsButtons: {
    flexDirection: "row",
    gap: 12,
  },
  reviewButton: {
    flex: 1,
    backgroundColor: BG_WHITE,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  reviewButtonText: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Manrope-Medium",
    color: TEXT_DARK,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: BORDER_GRAY,
    backgroundColor: BG_WHITE,
  },
  navItem: {
    alignItems: "center",
    gap: 4,
  },
  navText: {
    fontSize: 11,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
  },
  navTextActive: {
    color: PRIMARY_DARK,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
  },
});
