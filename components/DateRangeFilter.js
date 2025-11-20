import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function DateRangeFilter({ filters, setFilters }) {
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);

  const handleSelect = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value ? new Date(value).toISOString().split("T")[0] : "",
    }));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.dateBox} onPress={() => setShowFrom(true)}>
        <Text style={styles.label}>From</Text>
        <Text style={styles.value}>
          {filters.fromDate ? filters.fromDate : "Select"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.dateBox} onPress={() => setShowTo(true)}>
        <Text style={styles.label}>To</Text>
        <Text style={styles.value}>
          {filters.toDate ? filters.toDate : "Select"}
        </Text>
      </TouchableOpacity>

      {showFrom && (
        <DateTimePicker
          value={filters.fromDate ? new Date(filters.fromDate) : new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowFrom(false);
            if (date) handleSelect("fromDate", date);
          }}
        />
      )}
      {showTo && (
        <DateTimePicker
          value={filters.toDate ? new Date(filters.toDate) : new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowTo(false);
            if (date) handleSelect("toDate", date);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dateBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#000A63",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
  },
  label: { color: "#000A63", fontWeight: "600", fontSize: 12 },
  value: { color: "#111827", fontWeight: "500", marginTop: 2 },
});