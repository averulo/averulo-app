// screens/EditProfileScreen.js
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../hooks/useAuth";

const PRIMARY_DARK = "#04123C";
const TEXT_DARK = "#1F2937";
const TEXT_MEDIUM = "#6B7280";
const TEXT_LIGHT = "#9CA3AF";
const BORDER_GRAY = "#E5E7EB";
const DELETE_RED = "#DC2626";

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [image, setImage] = useState(user?.avatar || null);

  const userName = user?.name || "John Doe";
  const userEmail = user?.email || "JohnDoe@email.com";
  const isHost = user?.role === "HOST" || user?.role === "ADMIN";

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please allow access to your photos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      // TODO: Upload image to backend
    }
  }

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // TODO: Implement account deletion
            console.log("Account deletion requested");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate("SettingsScreen")}>
          <Ionicons name="settings-outline" size={28} color={TEXT_DARK} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Profile Photo Section */}
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
            <Image
              source={{
                uri: image || user?.avatar || "https://i.pravatar.cc/150?img=12",
              }}
              style={styles.avatar}
            />
            <View style={styles.cameraIcon}>
              <Ionicons name="camera" size={20} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{userEmail}</Text>

          {isHost && (
            <View style={styles.hostBadge}>
              <Text style={styles.hostBadgeText}>HOST</Text>
            </View>
          )}
        </View>

        {/* Menu Items */}
        <View style={styles.menuCard}>
          <MenuItem
            icon="person-outline"
            label={userName}
            sublabel="Full Name"
            onPress={() => {
              // TODO: Navigate to edit name screen
              console.log("Edit name");
            }}
          />
          <MenuItem
            icon="checkmark-circle-outline"
            label="Contact Verification"
            onPress={() => {
              // TODO: Navigate to contact verification screen
              console.log("Contact verification");
            }}
          />
          <MenuItem
            icon="business-outline"
            label="Hotel Information"
            onPress={() => {
              // TODO: Navigate to hotel information screen
              console.log("Hotel information");
            }}
          />
          <MenuItem
            icon="star-outline"
            label="Host Preferences"
            onPress={() => {
              // TODO: Navigate to host preferences screen
              console.log("Host preferences");
            }}
          />
          <MenuItem
            icon="home-outline"
            label="Property Management"
            onPress={() => {
              // TODO: Navigate to property management screen
              console.log("Property management");
            }}
          />
          <MenuItem
            icon="trash-outline"
            label="Delete Account"
            onPress={handleDeleteAccount}
            isDelete={true}
            showDivider={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({ icon, label, sublabel, onPress, isDelete = false, showDivider = true }) {
  return (
    <>
      <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <View style={styles.menuLeft}>
          <Ionicons
            name={icon}
            size={22}
            color={isDelete ? DELETE_RED : TEXT_MEDIUM}
          />
          <View style={styles.menuTextContainer}>
            <Text style={[styles.menuLabel, isDelete && styles.deleteText]}>
              {label}
            </Text>
            {sublabel && (
              <Text style={styles.menuSublabel}>{sublabel}</Text>
            )}
          </View>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={isDelete ? DELETE_RED : TEXT_LIGHT}
        />
      </TouchableOpacity>
      {showDivider && <View style={styles.divider} />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_GRAY,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: TEXT_DARK,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_GRAY,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E5E7EB",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: PRIMARY_DARK,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: TEXT_DARK,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
    marginBottom: 12,
  },
  hostBadge: {
    backgroundColor: PRIMARY_DARK,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
  },
  hostBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  menuCard: {
    marginHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  menuLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 15,
    fontFamily: "Manrope-Regular",
    color: TEXT_DARK,
  },
  menuSublabel: {
    fontSize: 12,
    fontFamily: "Manrope-Regular",
    color: TEXT_LIGHT,
    marginTop: 2,
  },
  deleteText: {
    color: DELETE_RED,
  },
  divider: {
    height: 1,
    backgroundColor: BORDER_GRAY,
  },
});
