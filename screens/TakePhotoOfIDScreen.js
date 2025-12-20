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
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../hooks/useAuth";
import { uploadKyc } from "../lib/api";

const PRIMARY_BLUE = "#0094FF";

export default function TakePhotoOfIDScreen({ route }) {
  const navigation = useNavigation();
  const { idType } = route.params || {};
  const { token, refreshUser } = useAuth();

  const [frontPhoto, setFrontPhoto] = useState(null);
  const [backPhoto, setBackPhoto] = useState(null);
  const [currentStep, setCurrentStep] = useState("front");
  const [submitting, setSubmitting] = useState(false);

  // Open camera to capture ID
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

  // Submit both sides to backend
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

      // If this is host onboarding, navigate to selfie screen
      if (idType === "HOST_ID") {
        setSubmitting(false);
        navigation.navigate("TakePhotoOfPassport");
      } else {
        // Regular guest KYC - show host prompt
        Alert.alert(
          "Success!",
          "Your KYC has been submitted for verification!\n\nWould you like to become a host and start earning?",
          [
            {
              text: "Not Now",
              style: "cancel",
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: "MainTabs" }],
                });
              },
            },
            {
              text: "Become a Host",
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: "MainTabs" }],
                });
                // Navigate to host onboarding after a brief delay
                setTimeout(() => {
                  navigation.navigate("BecomeHostScreen");
                }, 500);
              },
            },
          ]
        );
      }
    } catch (err) {
      console.error("❌ KYC upload error:", err);
      Alert.alert("Error", err.message || "Failed to upload ID.");
    } finally {
      setSubmitting(false);
    }
  };

  // Reset to front
  const handleRetake = () => {
    setFrontPhoto(null);
    setBackPhoto(null);
    setCurrentStep("front");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Ionicons name="chevron-back" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Take a photo of your ID</Text>

      {/* Rectangular Image Preview */}
      <TouchableOpacity
        style={styles.imageWrapper}
        onPress={openCamera}
        disabled={submitting}
      >
        {currentStep === "front" ? (
          frontPhoto ? (
            <Image source={{ uri: frontPhoto }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="card" size={60} color="#555" />
              <Text style={styles.placeholderText}>Tap to capture front of ID</Text>
            </View>
          )
        ) : backPhoto ? (
          <Image source={{ uri: backPhoto }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="card" size={60} color="#555" />
            <Text style={styles.placeholderText}>Tap to capture back of ID</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Info Box */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>
          {currentStep === "front" ? "Front of ID" : "Back of ID"}
        </Text>
        <Text style={styles.infoText}>
          Center your ID in the frame and we'll take the photo automatically
        </Text>
      </View>

      {/* Retake Button */}
      {(frontPhoto || backPhoto) && !submitting && (
        <TouchableOpacity onPress={handleRetake} style={styles.retakeBtn}>
          <Text style={styles.retakeText}>Retake the Photo</Text>
        </TouchableOpacity>
      )}

      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          (!frontPhoto || !backPhoto || submitting) && styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={!frontPhoto || !backPhoto || submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Submit Photo</Text>
        )}
      </TouchableOpacity>

      {/* Uploading Overlay */}
      {submitting && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.overlayText}>Uploading your ID...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backBtn: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    marginBottom: 40,
  },
  imageWrapper: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "#fff",
    backgroundColor: "#1f1f1f",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 30,
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#888",
    fontSize: 14,
    fontFamily: "Manrope-Regular",
    marginTop: 12,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  infoBox: {
    backgroundColor: "#0F3D5C",
    padding: 16,
    borderRadius: 10,
    marginBottom: 24,
  },
  infoTitle: {
    color: "#fff",
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    fontSize: 15,
    marginBottom: 6,
  },
  infoText: {
    color: "#B8D4E8",
    fontSize: 13,
    fontFamily: "Manrope-Regular",
    lineHeight: 18,
  },
  retakeBtn: {
    alignItems: "center",
    marginBottom: 16,
  },
  retakeText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Manrope-Medium",
  },
  submitButton: {
    backgroundColor: PRIMARY_BLUE,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 20,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    fontSize: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Manrope-Regular",
    marginTop: 12,
  },
});
