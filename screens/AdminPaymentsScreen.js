import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import SearchBar from "../components/SearchBar";
import SortBar from "../components/SortBar";
import { SummaryBar } from "../components/SummaryBar";
import useAdminSummary from "../hooks/useAdminSummary";
import { useAuth } from "../hooks/useAuth";
import usePaginatedFetch from "../hooks/usePaginatedFetch";
import { API_BASE } from "../lib/api";
import { exportToCsv } from "../utils/exportCsv";
import { exportToExcel } from "../utils/exportExcel";

export default function AdminPaymentsScreen() {
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
  } = usePaginatedFetch("/api/admin/payments");

  // ✅ Reuse summary hook
  const { summary, loadingSummary, fetchSummary } = useAdminSummary(
    "/api/admin/payments/summary"
  );

  const wrappedOnRefresh = async () => {
    await onRefresh();
    await fetchSummary();
  };

  // ✅ Confirmation helper
  const confirmAction = (message, onConfirm) => {
    Alert.alert(
      "Confirm Action",
      message,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", style: "destructive", onPress: onConfirm },
      ],
      { cancelable: true }
    );
  };

  // ✅ Update payment status
  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/payments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (json.ok) {
        alert(`✅ Payment marked as ${status}`);
        wrappedOnRefresh();
      } else {
        alert(json.message || "Failed to update payment");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  // ✅ Delete payment
  const deletePayment = async (id) => {
    confirmAction("Delete this payment record permanently?", async () => {
      try {
        const res = await fetch(`${API_BASE}/api/admin/payments/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.ok) {
          alert("🗑️ Payment deleted!");
          wrappedOnRefresh();
        } else {
          alert(json.message || "Delete failed");
        }
      } catch (err) {
        console.error(err);
        alert("Network error");
      }
    });
  };

  // ✅ Export columns
  const columns = [
    { label: "ID", value: "id" },
    { label: "Booking", value: (p) => p.booking?.id || "" },
    { label: "Property", value: (p) => p.booking?.property?.title || "" },
    { label: "User", value: (p) => p.booking?.user?.email || "" },
    { label: "Amount", value: "amount" },
    { label: "Status", value: "status" },
    { label: "Created At", value: "createdAt" },
  ];

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000A63" />
        <Text style={{ marginTop: 8, color: "#000A63" }}>Loading payments…</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>All Payments ({items.length})</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity
            style={styles.exportBtn}
            onPress={() => exportToCsv("payments.csv", columns, items)}
          >
            <Text style={styles.exportText}>CSV</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.exportBtn, { borderColor: "#16A34A" }]}
            onPress={() => exportToExcel("payments.xlsx", columns, items)}
          >
            <Text style={[styles.exportText, { color: "#16A34A" }]}>Excel</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Summary */}
      <SummaryBar summary={summary} loading={loadingSummary} />

      {/* Search + Sort */}
      <SearchBar
        search={search}
        setSearch={setSearch}
        placeholder="Search by user, property, or booking"
      />
      <SortBar
        sortBy={sortBy}
        sortOrder={sortOrder}
        setSortBy={setSortBy}
        setSortOrder={setSortOrder}
        options={[
          { label: "Sort by Date", value: "createdAt" },
          { label: "Sort by Amount", value: "amount" },
        ]}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      {/* Payment List */}
      <FlatList
        data={items}
        keyExtractor={(i, index) =>
          i.id ? `${i.id}-${index}` : `payment-${index}`
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>
              ₦{item.amount?.toLocaleString() || 0}
            </Text>
            <Text style={styles.email}>
              {item.booking?.property?.title || "—"}
            </Text>
            <Text style={{ color: "#6B7280" }}>Status: {item.status}</Text>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: "#16A34A" }]}
                onPress={() =>
                  confirmAction(
                    "Mark this payment as VERIFIED?",
                    () => updateStatus(item.id, "VERIFIED")
                  )
                }
              >
                <Text style={styles.actionText}>Verify</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: "#2563eb" }]}
                onPress={() =>
                  confirmAction(
                    "Refund this payment?",
                    () => updateStatus(item.id, "REFUNDED")
                  )
                }
              >
                <Text style={styles.actionText}>Refund</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: "#dc2626" }]}
                onPress={() => deletePayment(item.id)}
              >
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={wrappedOnRefresh} />
        }
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
  name: { fontWeight: "600", fontSize: 16, color: "#000A63" },
  email: { color: "#555" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { color: "crimson", marginBottom: 8 },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
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