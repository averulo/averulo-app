import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../hooks/useAuth";
import { API_BASE } from "../lib/api";

const PRIMARY = "#000A63";
const BORDER = "#E5E7EB";
const MUTED = "#6B7280";

export default function AddPhoneScreen() {
  const { token, refreshUser } = useAuth();
  const navigation = useNavigation();
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!phone.trim()) {
      Alert.alert("Missing info", "Please enter your phone number.");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch(`${API_BASE}/api/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phone }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to update phone number.");
      }

      await refreshUser();
      Alert.alert("Phone added", "Your phone number has been saved.");
      navigation.goBack();
    } catch (err) {
      console.error("Phone update failed:", err);
      Alert.alert("Error", err.message || "Unable to save phone number.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Phone Number</Text>
          <View style={{ width: 24 }} />
        </View>

        <Text style={styles.desc}>
          Add your phone number to complete your profile.
        </Text>

        <TextInput
          placeholder="Enter phone number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          style={styles.input}
        />

        <TouchableOpacity
          style={[styles.saveBtn, saving && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveText}>
            {saving ? "Saving..." : "Save Phone Number"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  desc: { color: MUTED, marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    marginBottom: 20,
  },
  saveBtn: {
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "600" },
});