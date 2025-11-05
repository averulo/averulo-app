// screens/AdminKycDashboardScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../hooks/useAuth";
import { API_BASE } from "../lib/api";

const PRIMARY = "#000A63";
const BORDER = "#E5E7EB";
const MUTED = "#6B7280";

export default function AdminKycDashboardScreen() {
  const { token } = useAuth();
  const navigation = useNavigation();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [activeTab, setActiveTab] = useState("PENDING");
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/kyc/${activeTab.toLowerCase()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.ok) setUsers(data.users || []);
    } catch (err) {
      console.error("Fetch KYC failed:", err);
      Alert.alert("Error", "Failed to load KYC list.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (userId, action) => {
    Alert.alert(
      `${action === "APPROVE" ? "Approve" : "Reject"} KYC`,
      `Are you sure you want to ${action.toLowerCase()} this user?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            setProcessingId(userId);
            try {
              const res = await fetch(`${API_BASE}/api/admin/kyc/${userId}`, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ action }),
              });
              const data = await res.json();
              if (data.ok) {
                Alert.alert("Success", `User KYC ${action.toLowerCase()}d.`);
                fetchUsers();
              } else {
                Alert.alert("Error", data.message || "Failed to update KYC.");
              }
            } catch (err) {
              console.error("KYC action error:", err);
              Alert.alert("Error", "Server error.");
            } finally {
              setProcessingId(null);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchUsers();
  }, [token, activeTab]);

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.name && u.name.toLowerCase().includes(search.toLowerCase()))
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.email}>{item.email}</Text>
      <Text style={styles.meta}>
        Created: {new Date(item.createdAt).toLocaleDateString()}
      </Text>

      <View style={styles.imageRow}>
        {item.kycFrontUrl ? (
          <Image source={{ uri: item.kycFrontUrl }} style={styles.image} />
        ) : (
          <View style={styles.noImage}>
            <Text>No Front</Text>
          </View>
        )}
        {item.kycBackUrl ? (
          <Image source={{ uri: item.kycBackUrl }} style={styles.image} />
        ) : (
          <View style={styles.noImage}>
            <Text>No Back</Text>
          </View>
        )}
      </View>

      {activeTab === "PENDING" && (
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={[styles.btn, styles.reject]}
            disabled={processingId === item.id}
            onPress={() => handleAction(item.id, "REJECT")}
          >
            <Text style={styles.btnText}>Reject</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.approve]}
            disabled={processingId === item.id}
            onPress={() => handleAction(item.id, "APPROVE")}
          >
            <Text style={styles.btnText}>Approve</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.title}>KYC Dashboard</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {["PENDING", "VERIFIED", "REJECTED"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tab,
              activeTab === tab && {
                borderBottomColor: PRIMARY,
                borderBottomWidth: 2,
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab ? PRIMARY : MUTED },
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#555" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by email or name..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={PRIMARY} />
        </View>
      ) : filteredUsers.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ color: MUTED }}>
            No {activeTab.toLowerCase()} KYCs 🎉
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchUsers} />
          }
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: BORDER,
  },
  title: { fontSize: 18, fontWeight: "700", color: PRIMARY },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderColor: BORDER,
    marginBottom: 8,
  },
  tab: { paddingVertical: 10 },
  tabText: { fontWeight: "600" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  searchInput: { flex: 1, paddingVertical: 8, marginLeft: 6 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { padding: 16 },
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
    elevation: 1,
  },
  email: { fontWeight: "700", color: PRIMARY },
  meta: { color: "#555", fontSize: 13, marginBottom: 8 },
  imageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  image: { width: "48%", height: 120, borderRadius: 10 },
  noImage: {
    width: "48%",
    height: 120,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  btnRow: { flexDirection: "row", justifyContent: "space-between" },
  btn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  approve: { backgroundColor: "#16A34A" },
  reject: { backgroundColor: "#DC2626" },
  btnText: { color: "#fff", fontWeight: "600" },
});