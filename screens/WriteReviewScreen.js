// screens/WriteReviewScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createReview } from "../lib/api";
import { useAuth } from "../hooks/useAuth";

// Design colors
const PRIMARY_DARK = "#04123C";
const TEXT_DARK = "#012232";
const TEXT_MEDIUM = "#3E5663";
const TEXT_LIGHT = "#5F737D";
const BG_GRAY = "#F1F3F4";
const YELLOW = "#A36F00";

export default function WriteReviewScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { token } = useAuth();

  const { bookingId, propertyName } = route.params || {};

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (rating === 0) {
      Alert.alert("Rating required", "Please select a rating (1-5 stars)");
      return;
    }

    if (!bookingId) {
      Alert.alert("Error", "Booking information missing");
      return;
    }

    if (!token) {
      Alert.alert("Error", "You must be logged in to submit a review");
      return;
    }

    try {
      setSubmitting(true);
      await createReview(token, bookingId, rating, comment.trim() || undefined);

      Alert.alert(
        "Review Submitted!",
        "Thank you for sharing your experience.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error("Failed to submit review:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to submit review. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={PRIMARY_DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Write a Review</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Property Name */}
          <Text style={styles.propertyName}>{propertyName || "Property"}</Text>

          {/* Rating Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Rating</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  style={styles.starButton}
                >
                  <Ionicons
                    name={star <= rating ? "star" : "star-outline"}
                    size={40}
                    color={star <= rating ? YELLOW : TEXT_LIGHT}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.ratingText}>
              {rating === 0
                ? "Tap to rate"
                : rating === 1
                ? "Poor"
                : rating === 2
                ? "Fair"
                : rating === 3
                ? "Good"
                : rating === 4
                ? "Very Good"
                : "Excellent"}
            </Text>
          </View>

          {/* Comment Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Review (Optional)</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Share details about your stay..."
              placeholderTextColor={TEXT_LIGHT}
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{comment.length} / 2000</Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Review</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BG_GRAY,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Manrope",
    color: TEXT_DARK,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  propertyName: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Manrope",
    color: TEXT_DARK,
    marginBottom: 24,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Manrope",
    color: TEXT_DARK,
    marginBottom: 12,
  },
  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
  },
  starButton: {
    marginHorizontal: 8,
  },
  ratingText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Manrope",
    color: TEXT_MEDIUM,
    marginTop: 8,
  },
  textArea: {
    backgroundColor: BG_GRAY,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    fontFamily: "Manrope",
    color: TEXT_DARK,
    minHeight: 120,
  },
  charCount: {
    textAlign: "right",
    fontSize: 12,
    fontFamily: "Manrope",
    color: TEXT_LIGHT,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: PRIMARY_DARK,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Manrope",
    color: "#FFFFFF",
  },
});
