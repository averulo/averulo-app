import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export const SummaryBar = ({ summary, loading }) => {
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#000A63" />
      </View>
    );
  }

  if (!summary) return null;

  return (
    <View style={styles.row}>
      {Object.entries(summary).map(([key, val]) => (
        <View key={key} style={styles.pill}>
          <Text style={styles.label}>{formatKey(key)}</Text>
          <Text style={styles.value}>
            {typeof val === "number" && key.toLowerCase().includes("revenue")
              ? `₦${val.toLocaleString()}`
              : val}
          </Text>
        </View>
      ))}
    </View>
  );
};

const formatKey = (key) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#f3f4ff",
  },
  label: { fontSize: 10, color: "#6B7280" },
  value: { fontSize: 13, fontWeight: "700", color: "#000A63" },
  center: { alignItems: "center", marginBottom: 10 },
});