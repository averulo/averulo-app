import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";

export default function SearchBar({ search, setSearch, placeholder }) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={18} color="#6B7280" />
      <TextInput
        style={styles.input}
        placeholder={placeholder || "Search..."}
        placeholderTextColor="#9CA3AF"
        value={search}
        onChangeText={setSearch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 12,
    height: 40,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    color: "#111827",
    fontSize: 14,
  },
});