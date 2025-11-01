import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../hooks/useAuth";
import { uploadKyc } from "../lib/api";

export default function TakePhotoOfIDScreen({ route }) {
  const navigation = useNavigation();
  const { idType } = route.params || {};
  const { token, refreshUser } = useAuth();

  const [frontPhoto, setFrontPhoto] = useState(null);
  const [backPhoto, setBackPhoto] = useState(null);
  const [currentStep, setCurrentStep] = useState("front");
  const [submitting, setSubmitting] = useState(false);

  // ✅ open camera to capture ID
  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Camera access is needed!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 2],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const uri = result.assets[0].uri;
      if (currentStep === "front") {
        setFrontPhoto(uri);
        setCurrentStep("back");
      } else {
        setBackPhoto(uri);
      }
    }
  };

  // ✅ Submit both sides to backend
  const handleSubmit = async () => {
    if (!frontPhoto || !backPhoto) {
      return Alert.alert("Missing photo", "Please capture both sides of your ID.");
    }
    if (!token) {
      return Alert.alert("Error", "You must be logged in to upload your ID.");
    }

    try {
      setSubmitting(true);
      Alert.alert("Uploading", "Please wait while we upload your ID...");

      const result = await uploadKyc(token, idType || "UNKNOWN", frontPhoto, backPhoto);
      console.log("✅ KYC Upload result:", result);

      await refreshUser();
      Alert.alert("Success", "Your KYC has been submitted for verification!");

      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (err) {
      console.error("❌ KYC upload error:", err);
      Alert.alert("Error", err.message || "Failed to upload ID.");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Reset both photos
  const handleRetake = () => {
    setFrontPhoto(null);
    setBackPhoto(null);
    setCurrentStep("front");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Take a photo of your ID</Text>
      </View>

      {/* Image Preview */}
      <TouchableOpacity
        style={styles.imageWrapper}
        onPress={openCamera}
        disabled={submitting}
      >
        <Image
          source={
            currentStep === "front"
              ? frontPhoto
                ? { uri: frontPhoto }
                : require("../assets/images/id-card-illustration.png")
              : backPhoto
              ? { uri: backPhoto }
              : require("../assets/images/id-card-illustration.png")
          }
          style={styles.image}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Info Box */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>
          {currentStep === "front" ? "Front of ID" : "Back of ID"}
        </Text>
        <Text style={styles.infoText}>
          Center your ID in the frame and we’ll take the photo automatically.
        </Text>
      </View>

      {/* Retake Button */}
      {(frontPhoto || backPhoto) && !submitting && (
        <TouchableOpacity onPress={handleRetake}>
          <Text style={styles.retakeText}>Retake Photo(s)</Text>
        </TouchableOpacity>
      )}

      {/* Submit */}
      {frontPhoto && backPhoto && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.submitButton, submitting && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Submit Photos</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Uploading Overlay */}
      {submitting && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.overlayText}>Uploading your ID...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", paddingHorizontal: 20, paddingTop: 50 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 30 },
  title: { color: "#fff", fontSize: 20, fontWeight: "600", marginLeft: 10 },
  imageWrapper: { alignItems: "center", marginBottom: 20 },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#1E293B",
    backgroundColor: "#1E293B",
  },
  infoBox: { backgroundColor: "#0F2D52", padding: 15, borderRadius: 10, marginBottom: 20 },
  infoTitle: { color: "white", fontWeight: "600", marginBottom: 5 },
  infoText: { color: "white", fontSize: 14 },
  retakeText: { color: "white", fontSize: 16, textAlign: "center", marginBottom: 20 },
  footer: { marginTop: "auto", marginBottom: 20 },
  submitButton: { backgroundColor: "#0094FF", padding: 16, borderRadius: 8 },
  submitText: { color: "white", fontSize: 16, fontWeight: "bold", textAlign: "center" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayText: { color: "#fff", fontSize: 16, marginTop: 10 },
});