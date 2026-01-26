// screens/host/HostStatisticsScreen.js
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
import Svg, { Circle } from "react-native-svg";
import { useAuth } from "../../hooks/useAuth";
import { API_BASE } from "../../lib/api";

const PRIMARY_DARK = "#04123C";
const TEXT_DARK = "#1F2937";
const TEXT_MEDIUM = "#6B7280";
const BORDER_GRAY = "#E5E7EB";
const BG_WHITE = "#FFFFFF";
const BG_LIGHT = "#F9FAFB";

export default function HostStatisticsScreen() {
  const navigation = useNavigation();
  const { token } = useAuth();
  const [selectedTab, setSelectedTab] = useState("stats");
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [token])
  );

  const fetchData = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [bookingsRes, propsRes] = await Promise.all([
        fetch(`${API_BASE}/api/bookings/host`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/api/properties`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (bookingsRes.ok) {
        const data = await bookingsRes.json();
        setBookings(data || []);
      }
      if (propsRes.ok) {
        const data = await propsRes.json();
        setProperties(data.data || data || []);
      }
    } catch (err) {
      console.log("Fetch stats error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats from bookings
  const totalEarnings = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0) / 100;
  const approvedBookings = bookings.filter(b => b.status === 'APPROVED').length;
  const totalBookings = bookings.length;
  const occupancyRate = totalBookings > 0 ? Math.min(100, Math.round((approvedBookings / Math.max(totalBookings, 1)) * 100)) : 0;

  // Get current month name
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentMonth = monthNames[new Date().getMonth()];

  const opportunities = [
    {
      id: 1,
      text: "Greet guests with a smile and personalized attention. Offer a welcome drink or a small gesture like fresh towels upon arrival.",
    },
    {
      id: 2,
      text: "Ensure rooms and public areas are spotless, well-lit, and smell fresh.",
    },
    {
      id: 3,
      text: "Note guest preferences (e.g., room temperature, pillow type, or special occasions) and personalize their stay.",
    },
  ];

  // Generate reviews from bookings (placeholder - would need review API)
  const reviews = bookings.slice(0, 3).map((b, i) => ({
    id: b.id,
    name: b.guest?.name || b.guest?.email || "Guest",
    room: `${b.property?.title || "Room"} • ${Math.ceil((new Date(b.endDate) - new Date(b.startDate)) / (1000 * 60 * 60 * 24))} nights`,
    rating: 4 + (i % 2),
    text: "Great stay! The property was exactly as described and the host was very responsive.",
    date: new Date(b.createdAt).toLocaleDateString(),
    image: `https://i.pravatar.cc/150?u=${b.guestId}`,
  }));

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
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title and Hotel Selector */}
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>Statistic</Text>
          <Text style={styles.hotelSelector}>{properties[0]?.title || "My Property"}</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => setSelectedTab("opportunities")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "opportunities" && styles.tabTextActive,
              ]}
            >
              Opportunities
            </Text>
            {selectedTab === "opportunities" && <View style={styles.tabUnderline} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            onPress={() => setSelectedTab("stats")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "stats" && styles.tabTextActive,
              ]}
            >
              Stats
            </Text>
            {selectedTab === "stats" && <View style={styles.tabUnderline} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            onPress={() => setSelectedTab("reviews")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "reviews" && styles.tabTextActive,
              ]}
            >
              Reviews
            </Text>
            {selectedTab === "reviews" && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        </View>

        {/* Resources Section */}
        {selectedTab === "opportunities" && (
          <>
            <Text style={styles.sectionTitle}>Resources for guest comfort</Text>

            {opportunities.map((item) => (
              <View key={item.id} style={styles.resourceCard}>
                <View style={styles.iconBox}>
                  <Ionicons name="bulb-outline" size={28} color="#FCD34D" />
                </View>
                <Text style={styles.resourceText}>{item.text}</Text>
              </View>
            ))}
          </>
        )}

        {selectedTab === "stats" && (
          <>
            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Add Reservation</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Check Availability</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>View Reports</Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={PRIMARY_DARK} />
                <Text style={styles.loadingText}>Loading statistics...</Text>
              </View>
            ) : (
              <>
                {/* Occupancy Chart - SVG Circle */}
                <View style={styles.chartContainer}>
                  <View style={styles.svgChartWrapper}>
                    <Svg width="220" height="220" viewBox="0 0 220 220">
                      {/* Background circle (light blue) */}
                      <Circle
                        cx="110"
                        cy="110"
                        r="96"
                        stroke="#E0F2FE"
                        strokeWidth="28"
                        fill="none"
                      />
                      {/* Progress circle (dark blue) */}
                      <Circle
                        cx="110"
                        cy="110"
                        r="96"
                        stroke="#3B82F6"
                        strokeWidth="28"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 96 * (occupancyRate / 100)} ${2 * Math.PI * 96}`}
                        strokeDashoffset="0"
                        rotation="-90"
                        origin="110, 110"
                        strokeLinecap="round"
                      />
                    </Svg>
                    {/* Center text */}
                    <View style={styles.svgChartText}>
                      <Text style={styles.chartPercentage}>{occupancyRate}%</Text>
                      <Text style={styles.chartLabel}>Occupancy</Text>
                    </View>
                  </View>
                </View>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{reviews.length > 0 ? "4★" : "N/A"}</Text>
                    <Text style={styles.statLabel}>Overall rating</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{totalBookings}</Text>
                    <Text style={styles.statLabel}>Bookings</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{approvedBookings}</Text>
                    <Text style={styles.statLabel}>Approved</Text>
                  </View>
                </View>

                {/* Financial Section */}
                <View style={styles.financialSection}>
                  <View style={styles.financialRow}>
                    <View style={styles.financialItem}>
                      <Text style={styles.financialAmount}>₦{totalEarnings.toLocaleString()}</Text>
                      <Text style={styles.financialLabel}>{currentMonth} earnings</Text>
                    </View>
                    <View style={styles.financialItem}>
                      <Text style={styles.financialAmount}>₦{totalEarnings.toLocaleString()}</Text>
                      <Text style={styles.financialLabel}>Total earnings</Text>
                    </View>
                    <View style={styles.financialItem}>
                      <Text style={styles.financialAmount}>{totalBookings}</Text>
                      <Text style={styles.financialLabel}>Total bookings</Text>
                    </View>
                  </View>

                  <TouchableOpacity style={styles.transactionLink}>
                    <Text style={styles.transactionLinkText}>View transaction history</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </>
        )}

        {selectedTab === "reviews" && (
          <>
            {reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Image
                    source={{ uri: review.image }}
                    style={styles.reviewAvatar}
                  />
                  <View style={styles.reviewHeaderInfo}>
                    <Text style={styles.reviewName}>{review.name}</Text>
                    <Text style={styles.reviewRoom}>{review.room}</Text>
                  </View>
                  <View style={styles.reviewStars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons
                        key={star}
                        name={star <= review.rating ? "star" : "star-outline"}
                        size={16}
                        color="#FCD34D"
                      />
                    ))}
                  </View>
                </View>
                <Text style={styles.reviewText}>{review.text}</Text>
                <Text style={styles.reviewDate}>{review.date}</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("HostDashboardScreen")}
        >
          <Ionicons name="home-outline" size={24} color={TEXT_MEDIUM} />
          <Text style={styles.navText}>Home</Text>
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

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="stats-chart" size={24} color={PRIMARY_DARK} />
          <Text style={[styles.navText, styles.navTextActive]}>Statistic</Text>
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
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: "700",
    fontFamily: "Manrope-Bold",
    color: TEXT_DARK,
  },
  hotelSelector: {
    fontSize: 15,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
  },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: BORDER_GRAY,
    marginBottom: 24,
  },
  tab: {
    marginRight: 32,
    paddingBottom: 12,
    position: "relative",
  },
  tabText: {
    fontSize: 15,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
  },
  tabTextActive: {
    color: TEXT_DARK,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
  },
  tabUnderline: {
    position: "absolute",
    bottom: -1,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: TEXT_DARK,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: TEXT_DARK,
    marginBottom: 20,
  },
  resourceCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    gap: 16,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: PRIMARY_DARK,
    alignItems: "center",
    justifyContent: "center",
  },
  resourceText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: BG_WHITE,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 13,
    fontFamily: "Manrope-Regular",
    color: TEXT_DARK,
  },
  chartContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  svgChartWrapper: {
    width: 220,
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  svgChartText: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  chartPercentage: {
    fontSize: 48,
    fontWeight: "700",
    fontFamily: "Manrope-Bold",
    color: TEXT_DARK,
    marginBottom: 4,
  },
  chartLabel: {
    fontSize: 16,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 40,
    paddingBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_GRAY,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: TEXT_DARK,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
  },
  financialSection: {
    marginBottom: 24,
  },
  financialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  financialItem: {
    flex: 1,
  },
  financialAmount: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Manrope-Bold",
    color: TEXT_DARK,
    marginBottom: 4,
  },
  financialLabel: {
    fontSize: 13,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
  },
  transactionLink: {
    paddingVertical: 8,
  },
  transactionLinkText: {
    fontSize: 15,
    fontFamily: "Manrope-Regular",
    color: "#B45309",
  },
  reviewCard: {
    backgroundColor: BG_LIGHT,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  reviewAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E5E7EB",
    marginRight: 12,
  },
  reviewHeaderInfo: {
    flex: 1,
  },
  reviewName: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: TEXT_DARK,
    marginBottom: 2,
  },
  reviewRoom: {
    fontSize: 13,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
  },
  reviewStars: {
    flexDirection: "row",
    gap: 2,
  },
  reviewText: {
    fontSize: 14,
    fontFamily: "Manrope-Regular",
    color: TEXT_DARK,
    lineHeight: 20,
    marginBottom: 12,
  },
  reviewDate: {
    fontSize: 13,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
    marginTop: 12,
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
