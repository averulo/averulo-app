// screens/host/HostReviewsScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
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
import { getHostReviews, replyToReview } from "../../lib/api";
import { useAuth } from "../../hooks/useAuth";

const PRIMARY_DARK = "#04123C";
const TEXT_DARK = "#012232";
const TEXT_MEDIUM = "#3E5663";
const TEXT_LIGHT = "#5F737D";
const BG_GRAY = "#F1F3F4";
const BORDER_GRAY = "#D4DADC";
const BLUE = "#0094FF";
const GOLD = "#FFC107";

export default function HostReviewsScreen() {
  const navigation = useNavigation();
  const { token, user } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null); // reviewId being replied to
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getHostReviews(token);
      setReviews(data || []);
    } catch (err) {
      console.error("Failed to fetch host reviews:", err);
      Alert.alert("Error", err.message || "Failed to load reviews");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitReply(reviewId) {
    if (!replyText.trim()) {
      Alert.alert("Required", "Please enter a reply");
      return;
    }

    if (replyText.length > 1000) {
      Alert.alert("Too Long", "Reply must be 1000 characters or less");
      return;
    }

    try {
      setSubmitting(true);
      await replyToReview(token, reviewId, replyText.trim());

      // Update local state
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId ? { ...r, reply: replyText.trim() } : r
        )
      );

      setReplyText("");
      setReplyingTo(null);
      Alert.alert("Success", "Your reply has been posted");
    } catch (err) {
      console.error("Failed to submit reply:", err);
      Alert.alert("Error", err.message || "Failed to post reply");
    } finally {
      setSubmitting(false);
    }
  }

  function renderReviewCard({ item }) {
    const review = item;
    const isReplying = replyingTo === review.id;
    const hasReply = !!review.reply;

    const guestName = review.guest?.name || "Guest";
    const propertyTitle = review.property?.title || "Property";
    const date = new Date(review.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return (
      <View style={styles.reviewCard}>
        {/* Header */}
        <View style={styles.reviewHeader}>
          <View style={styles.reviewHeaderLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {guestName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={styles.guestName}>{guestName}</Text>
              <Text style={styles.propertyName}>{propertyTitle}</Text>
            </View>
          </View>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color={GOLD} />
            <Text style={styles.ratingText}>{review.rating}</Text>
          </View>
        </View>

        {/* Review Content */}
        <Text style={styles.reviewDate}>{date}</Text>
        {review.comment && (
          <Text style={styles.reviewComment}>{review.comment}</Text>
        )}

        {/* Existing Reply */}
        {hasReply && (
          <View style={styles.replyContainer}>
            <View style={styles.replyHeader}>
              <Ionicons name="return-down-forward" size={16} color={BLUE} />
              <Text style={styles.replyLabel}>Your reply</Text>
            </View>
            <Text style={styles.replyText}>{review.reply}</Text>
          </View>
        )}

        {/* Reply Input */}
        {!hasReply && (
          <>
            {isReplying ? (
              <View style={styles.replyInputContainer}>
                <TextInput
                  style={styles.replyInput}
                  placeholder="Write your reply (max 1000 characters)..."
                  placeholderTextColor={TEXT_LIGHT}
                  value={replyText}
                  onChangeText={setReplyText}
                  multiline
                  maxLength={1000}
                />
                <View style={styles.replyActions}>
                  <Text style={styles.charCount}>
                    {replyText.length}/1000
                  </Text>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setReplyingTo(null);
                      setReplyText("");
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      submitting && styles.submitButtonDisabled,
                    ]}
                    onPress={() => handleSubmitReply(review.id)}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.submitButtonText}>Post Reply</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.replyButton}
                onPress={() => setReplyingTo(review.id)}
              >
                <Ionicons
                  name="chatbubble-outline"
                  size={16}
                  color={PRIMARY_DARK}
                />
                <Text style={styles.replyButtonText}>Reply</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    );
  }

  if (!user || (user.role !== "HOST" && user.role !== "ADMIN")) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="shield-outline" size={64} color={TEXT_LIGHT} />
          <Text style={styles.emptyTitle}>Access Denied</Text>
          <Text style={styles.emptySubtitle}>
            You need to be a host to view this page
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={PRIMARY_DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Property Reviews</Text>
          <TouchableOpacity onPress={fetchReviews}>
            <Ionicons name="refresh" size={24} color={PRIMARY_DARK} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={PRIMARY_DARK} />
          </View>
        ) : reviews.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="star-outline" size={64} color={TEXT_LIGHT} />
            <Text style={styles.emptyTitle}>No Reviews Yet</Text>
            <Text style={styles.emptySubtitle}>
              Reviews from guests will appear here
            </Text>
          </View>
        ) : (
          <FlatList
            data={reviews}
            keyExtractor={(item) => item.id}
            renderItem={renderReviewCard}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Manrope-Bold",
    color: TEXT_DARK,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Manrope-Bold",
    color: TEXT_DARK,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
    textAlign: "center",
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: PRIMARY_DARK,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: "#FFFFFF",
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  reviewCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PRIMARY_DARK,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Manrope-Bold",
    color: "#FFFFFF",
  },
  guestName: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: TEXT_DARK,
  },
  propertyName: {
    fontSize: 12,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: GOLD + "20",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: GOLD,
  },
  reviewDate: {
    fontSize: 12,
    fontFamily: "Manrope-Regular",
    color: TEXT_LIGHT,
    marginBottom: 8,
  },
  reviewComment: {
    fontSize: 14,
    fontFamily: "Manrope-Regular",
    color: TEXT_DARK,
    lineHeight: 20,
    marginBottom: 12,
  },
  replyContainer: {
    backgroundColor: BG_GRAY,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  replyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  replyLabel: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: BLUE,
  },
  replyText: {
    fontSize: 14,
    fontFamily: "Manrope-Regular",
    color: TEXT_DARK,
    lineHeight: 20,
  },
  replyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
  },
  replyButtonText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: PRIMARY_DARK,
  },
  replyInputContainer: {
    marginTop: 12,
  },
  replyInput: {
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: "Manrope-Regular",
    color: TEXT_DARK,
    minHeight: 80,
    textAlignVertical: "top",
  },
  replyActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  charCount: {
    fontSize: 12,
    fontFamily: "Manrope-Regular",
    color: TEXT_LIGHT,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: TEXT_MEDIUM,
  },
  submitButton: {
    backgroundColor: PRIMARY_DARK,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: "#FFFFFF",
  },
});
