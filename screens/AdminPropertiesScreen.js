import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import SearchBar from "../components/SearchBar";
import SortBar from "../components/SortBar";
import { useAuth } from "../hooks/useAuth";
import usePaginatedFetch from "../hooks/usePaginatedFetch";
import { API_BASE } from "../lib/api";
import { exportToCsv } from "../utils/exportCsv";
import { exportToExcel } from "../utils/exportExcel";

export default function AdminPropertiesScreen() {
  const { token } = useAuth();
  const {
    items,
    loading,
    loadingMore,
    refreshing,
    error,
    onRefresh,
    onEndReached,
    search,
    setSearch,
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
  } = usePaginatedFetch("/api/admin/properties");

  // ✅ Update property status (approve/hide)
  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/properties/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (json.ok) {
        alert(`✅ Property ${status.toLowerCase()}!`);
        onRefresh();
      } else {
        alert(json.message || "Failed to update property");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  // ✅ Delete property
  const deleteProperty = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/properties/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.ok) {
        alert("🗑️ Property deleted!");
        onRefresh();
      } else {
        alert(json.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000A63" />
        <Text style={{ marginTop: 8, color: "#000A63" }}>Loading properties…</Text>
      </View>
    );

  const columns = [
    { label: "ID", value: "id" },
    { label: "Title", value: "title" },
    { label: "City", value: "city" },
    { label: "Status", value: "status" },
    { label: "Host", value: (p) => p.host?.email || "" },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>All Properties ({items.length})</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity
            style={styles.exportBtn}
            onPress={() => exportToCsv("properties.csv", columns, items)}
          >
            <Text style={styles.exportText}>CSV</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.exportBtn, { borderColor: "#16A34A" }]}
            onPress={() => exportToExcel("properties.xlsx", columns, items)}
          >
            <Text style={[styles.exportText, { color: "#16A34A" }]}>Excel</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search + Sort */}
      <SearchBar search={search} setSearch={setSearch} placeholder="Search by title, city, or host" />
      <SortBar
        sortBy={sortBy}
        sortOrder={sortOrder}
        setSortBy={setSortBy}
        setSortOrder={setSortOrder}
        options={[
          { label: "Sort by Date", value: "createdAt" },
          { label: "Sort by Status", value: "status" },
        ]}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      {/* Property List */}
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.title}</Text>
            <Text style={styles.email}>Host: {item.host?.email || "—"}</Text>
            <Text style={{ color: "#6B7280" }}>Status: {item.status}</Text>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: "#16A34A" }]}
                onPress={() => updateStatus(item.id, "APPROVED")}
              >
                <Text style={styles.actionText}>Approve</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: "#f59e0b" }]}
                onPress={() => updateStatus(item.id, "HIDDEN")}
              >
                <Text style={styles.actionText}>Hide</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: "#dc2626" }]}
                onPress={() => deleteProperty(item.id)}
              >
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onEndReachedThreshold={0.4}
        onEndReached={onEndReached}
        ListFooterComponent={
          loadingMore && (
            <View style={{ paddingVertical: 12 }}>
              <ActivityIndicator color="#000A63" />
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: { fontSize: 18, fontWeight: "700", color: "#000A63" },
  exportBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#000A63",
  },
  exportText: { fontSize: 12, fontWeight: "600", color: "#000A63" },
  card: {
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 10,
  },
  name: { fontWeight: "600", fontSize: 16 },
  email: { color: "#555" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { color: "crimson", marginBottom: 8 },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    marginHorizontal: 4,
    alignItems: "center",
  },
  actionText: { color: "#fff", fontWeight: "600", fontSize: 12 },
});