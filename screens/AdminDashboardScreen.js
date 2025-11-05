import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useAuth } from "../hooks/useAuth";
import { API_BASE } from "../lib/api";

export default function AdminDashboardScreen() {
  const { token } = useAuth();
  const [data, setData] = useState({
  revenueTrend: [],
  bookingsTrend: [],
  summary: { totalUsers: 0, totalProperties: 0, totalBookings: 0, totalRevenue: 0 },
});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const fetchTrends = async () => {
  try {
    setLoading(true);
    const [trendsRes, summaryRes] = await Promise.all([
      fetch(`${API_BASE}/api/admin/analytics/trends`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${API_BASE}/api/admin/analytics/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);
    const trends = await trendsRes.json();
    const summary = await summaryRes.json();
    setData({ ...trends, ...summary });
  } catch (err) {
    console.error("Error fetching trends/summary:", err);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

  useEffect(() => {
    fetchTrends();
  }, [token]);

  const screenWidth = Dimensions.get("window").width - 32;

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000A63" />
        <Text style={styles.loadingText}>Loading analytics...</Text>
      </View>
    );

  return (
  <ScrollView
    contentContainerStyle={styles.container}
    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchTrends} />}
  >
    <Text style={styles.title}>Admin Analytics Dashboard</Text>

    {/* Summary Cards */}
    <View style={styles.cardsContainer}>
  <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("AdminUsersScreen")}>
    <Ionicons name="people" size={22} color="#000A63" />
    <Text style={styles.cardLabel}>Users</Text>
    <Text style={styles.cardValue}>{data.summary?.totalUsers ?? 0}</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("AdminPropertiesScreen")}>
    <Ionicons name="home" size={22} color="#000A63" />
    <Text style={styles.cardLabel}>Properties</Text>
    <Text style={styles.cardValue}>{data.summary?.totalProperties ?? 0}</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("AdminBookingsScreen")}>
    <Ionicons name="briefcase" size={22} color="#000A63" />
    <Text style={styles.cardLabel}>Bookings</Text>
    <Text style={styles.cardValue}>{data.summary?.totalBookings ?? 0}</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("AdminPaymentsScreen")}>
    <Ionicons name="cash" size={22} color="#16A34A" />
    <Text style={styles.cardLabel}>Revenue</Text>
    <Text style={styles.cardValue}>₦{data.summary?.totalRevenue?.toLocaleString() ?? 0}</Text>
  </TouchableOpacity>
</View>

{/* Charts Section */}
<View style={styles.chartCard}>
  <Text style={styles.cardTitle}>📊 Bookings Trend</Text>
  <LineChart
    data={{
      labels: data.bookingsTrend?.map((i) => i.month) || [],
      datasets: [{ data: data.bookingsTrend?.map((i) => i.count) || [] }],
    }}
    width={screenWidth}
    height={220}
    chartConfig={{
      backgroundColor: "#fff",
      backgroundGradientFrom: "#f9fafb",
      backgroundGradientTo: "#f9fafb",
      color: () => "#000A63",
      labelColor: () => "#333",
      propsForDots: { r: "5", strokeWidth: "2", stroke: "#000A63" },
    }}
    bezier
    style={styles.chart}
  />
</View>

<View style={styles.chartCard}>
  <Text style={styles.cardTitle}>💰 Revenue Trend</Text>
  <LineChart
    data={{
      labels: data.revenueTrend?.map((i) => i.month) || [],
      datasets: [{ data: data.revenueTrend?.map((i) => i.total) || [] }],
    }}
    width={screenWidth}
    height={220}
    yAxisLabel="₦"
    chartConfig={{
      backgroundColor: "#fff",
      backgroundGradientFrom: "#f9fafb",
      backgroundGradientTo: "#f9fafb",
      color: () => "#16A34A",
      labelColor: () => "#333",
      propsForDots: { r: "5", strokeWidth: "2", stroke: "#16A34A" },
    }}
    bezier
    style={styles.chart}
  />
</View>
</ScrollView>
);

}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 16, color: "#000A63" },
  chartCard: {
    marginBottom: 24,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    padding: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  chart: { borderRadius: 12 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { color: "#000A63", marginTop: 8 },
cardsContainer: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  marginBottom: 20,
},
card: {
  width: "48%",
  backgroundColor: "#f9fafb",
  padding: 12,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: "#eee",
  marginBottom: 10,
  alignItems: "center",
},
cardLabel: { fontSize: 13, color: "#6B7280" },
cardValue: { fontSize: 18, fontWeight: "700", color: "#000A63", marginTop: 4 },

});