import { Picker } from "@react-native-picker/picker";
import { StyleSheet, Text, View } from "react-native";

export default function SortBar({ sortBy, sortOrder, setSortBy, setSortOrder, options = [] }) {
  return (
    <View style={styles.sortRow}>
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Sort By</Text>
        <Picker
          selectedValue={sortBy}
          style={styles.picker}
          onValueChange={(v) => setSortBy(v)}
        >
          {options.map((opt) => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Order</Text>
        <Picker
          selectedValue={sortOrder}
          style={styles.picker}
          onValueChange={(v) => setSortOrder(v)}
        >
          <Picker.Item label="Descending" value="desc" />
          <Picker.Item label="Ascending" value="asc" />
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sortRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 12,
  },
  pickerContainer: { flex: 1 },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#000A63",
    marginBottom: 4,
  },
  picker: {
    height: 40,
    backgroundColor: "#f2f4f7",
    borderRadius: 8,
    color: "#000",
  },
});