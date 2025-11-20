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
import usePaginatedFetch from "../hooks/usePaginatedFetch";
import { exportToCsv } from "../utils/exportCsv";
import { exportToExcel } from "../utils/exportExcel";

export default function AdminUsersScreen() {
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
  } = usePaginatedFetch("/api/admin/users");

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000A63" />
        <Text style={{ marginTop: 8, color: "#000A63" }}>Loading users…</Text>
      </View>
    );

  const columns = [
    { label: "ID", value: "id" },
    { label: "Name", value: "name" },
    { label: "Email", value: "email" },
    { label: "Role", value: "role" },
    { label: "Created At", value: "createdAt" },
  ];

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>All Users ({items.length})</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity
            style={styles.exportBtn}
            onPress={() => exportToCsv("users.csv", columns, items)}
          >
            <Text style={styles.exportText}>CSV</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.exportBtn, { borderColor: "#16A34A" }]}
            onPress={() => exportToExcel("users.xlsx", columns, items)}
          >
            <Text style={[styles.exportText, { color: "#16A34A" }]}>Excel</Text>
          </TouchableOpacity>
        </View>
      </View>

      <SearchBar search={search} setSearch={setSearch} placeholder="Search by name or email" />
      <SortBar
        sortBy={sortBy}
        sortOrder={sortOrder}
        setSortBy={setSortBy}
        setSortOrder={setSortOrder}
        options={[
          { label: "Sort by Date", value: "createdAt" },
          { label: "Sort by Name", value: "name" },
        ]}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name || "—"}</Text>
            <Text style={styles.email}>{item.email}</Text>
            <Text style={{ color: "#6B7280" }}>Role: {item.role}</Text>
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
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  title: { fontSize: 18, fontWeight: "700", color: "#000A63" },
  exportBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: "#000A63" },
  exportText: { fontSize: 12, fontWeight: "600", color: "#000A63" },
  card: { backgroundColor: "#f9fafb", padding: 12, borderRadius: 8, borderWidth: 1, borderColor: "#eee", marginBottom: 10 },
  name: { fontWeight: "600", fontSize: 16 },
  email: { color: "#555" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { color: "crimson", marginBottom: 8 },
});