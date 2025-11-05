import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../hooks/useAuth";
import { API_BASE } from "../lib/api"; // 👈 your existing base URL helper


const PRIMARY = "#000A63";
const BORDER = "#E5E7EB";
const MUTED = "#6B7280";

export default function EditProfileScreen() {
  const { user, token, refreshUser } = useAuth(); // ✅ we use token for auth + refresh user data
  const navigation = useNavigation();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [image, setImage] = useState(user?.avatar || null);
  const [saving, setSaving] = useState(false);

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please allow access to your photos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  const handleSave = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert("Missing info", "Please fill in all fields.");
      return;
    }

    try {
      setSaving(true);

      // 🔧 Create form data (in case you add image upload later)
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);

      // Optional: attach profile image if selected (you can skip for now)
      if (image && !image.startsWith("http")) {
        const filename = image.split("/").pop();
        const type = `image/${filename.split(".").pop()}`;
        formData.append("avatar", {
          uri: image,
          name: filename,
          type,
        });
      }

      const res = await fetch(`${API_BASE}/api/users/me`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          // 👇 Only include content-type for JSON body — FormData sets its own boundary
        },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to update profile");
      }

      await refreshUser(); // ✅ re-fetch latest user from /api/me
      Alert.alert("Profile updated", "Your changes have been saved successfully!");
      navigation.goBack();
    } catch (err) {
      console.error("Profile update failed:", err);
      Alert.alert("Error", err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Avatar */}
        <TouchableOpacity onPress={pickImage} style={styles.avatarWrap}>
          <Image
            source={image ? { uri: image } : require("../assets/icons/guest.png")}
            style={styles.avatar}
          />
          <View style={styles.cameraIcon}>
            <Ionicons name="camera" size={18} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Email (read-only)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: "#F9FAFB", color: "#6B7280" }]}
            value={user?.email || ""}
            editable={false}
          />
        </View>

        {/* Save button */}
        <TouchableOpacity
          style={[styles.saveBtn, saving && { opacity: 0.6 }]}
          disabled={saving}
          onPress={handleSave}
        >
          <Text style={styles.saveText}>
            {saving ? "Saving..." : "Save Changes"}
          </Text>
        </TouchableOpacity>
        {/* 🧠 Admin-only buttons */}
        {user?.role === "ADMIN" && (
          <>
            <TouchableOpacity
              onPress={() => navigation.navigate("AdminKycDashboard")}
              style={{
                backgroundColor: "#111827",
                paddingVertical: 14,
                borderRadius: 10,
                alignItems: "center",
                marginTop: 15,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                Go to KYC Dashboard
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                padding: 14,
                backgroundColor: "#000A63",
                borderRadius: 10,
                marginTop: 20,
                alignItems: "center",
              }}
              onPress={() => navigation.navigate("AdminDashboard")}
            >
              <Text
                style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}
              >
                Go to Admin Dashboard
              </Text>
            </TouchableOpacity>
          </>
          
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  avatarWrap: { alignSelf: "center", marginBottom: 20 },
  avatar: { width: 90, height: 90, borderRadius: 45 },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: PRIMARY,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  form: { gap: 14 },
  label: { color: MUTED, fontSize: 13, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: "#111827",
  },
  saveBtn: {
    marginTop: 30,
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "600" },
});