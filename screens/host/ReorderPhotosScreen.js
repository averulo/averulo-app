// screens/host/ReorderPhotosScreen.js
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const PRIMARY_DARK = "#04123C";
const TEXT_DARK = "#111827";
const TEXT_MEDIUM = "#6B7280";
const BORDER_GRAY = "#E5E7EB";
const BG_WHITE = "#FFFFFF";

export default function ReorderPhotosScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const {
    photos = [],
    title = "Exterior Media",
    category = "exterior",
    onSave
  } = route.params || {};

  const [photoList, setPhotoList] = useState(photos);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const handleContinue = () => {
    if (onSave) {
      onSave(photoList);
    }
    navigation.goBack();
  };

  const handlePhotoPress = (index) => {
    if (selectedPhoto === null) {
      setSelectedPhoto(index);
    } else {
      // Swap photos
      const newList = [...photoList];
      const temp = newList[selectedPhoto];
      newList[selectedPhoto] = newList[index];
      newList[index] = temp;
      setPhotoList(newList);
      setSelectedPhoto(null);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={TEXT_DARK} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleContinue}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: "90%" }]} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.title}>Add at least 4 photos</Text>
        <Text style={styles.subtitle}>Dare to reorder</Text>

        {/* Photo Grid */}
        <View style={styles.photoGrid}>
          {photoList.map((photo, index) => (
            <TouchableOpacity
              key={index}
              style={[
                index === 0 ? styles.mainPhotoContainer : styles.thumbnailContainer,
                selectedPhoto === index && styles.selectedPhoto,
              ]}
              onPress={() => handlePhotoPress(index)}
            >
              <Image
                source={{ uri: photo.uri || photo }}
                style={index === 0 ? styles.mainPhoto : styles.thumbnail}
                resizeMode="cover"
              />
              {selectedPhoto === index && (
                <View style={styles.selectedOverlay}>
                  <Ionicons name="checkmark-circle" size={32} color={PRIMARY_DARK} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Category Label */}
        <View style={styles.categoryCard}>
          <Ionicons
            name={category === "exterior" ? "home" : "bed"}
            size={24}
            color={TEXT_DARK}
          />
          <Text style={styles.categoryText}>{title}</Text>
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG_WHITE,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  backBtn: {
    padding: 4,
  },

  skipText: {
    fontSize: 16,
    fontFamily: "Manrope-Medium",
    color: TEXT_MEDIUM,
  },

  progressBarContainer: {
    height: 4,
    backgroundColor: BORDER_GRAY,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 2,
  },

  progressBar: {
    height: "100%",
    backgroundColor: PRIMARY_DARK,
    borderRadius: 2,
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: TEXT_DARK,
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 14,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
    marginBottom: 24,
  },

  photoGrid: {
    marginBottom: 20,
  },

  mainPhotoContainer: {
    width: "100%",
    height: 240,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#2196F3",
  },

  mainPhoto: {
    width: "100%",
    height: "100%",
  },

  thumbnailContainer: {
    width: "48.5%",
    height: 140,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
  },

  thumbnail: {
    width: "100%",
    height: "100%",
  },

  selectedPhoto: {
    borderColor: PRIMARY_DARK,
    borderWidth: 3,
  },

  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(4, 18, 60, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },

  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: BG_WHITE,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 8,
    marginBottom: 20,
  },

  categoryText: {
    fontSize: 16,
    fontFamily: "Manrope-Medium",
    color: TEXT_DARK,
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 16,
    backgroundColor: BG_WHITE,
    borderTopWidth: 1,
    borderTopColor: BORDER_GRAY,
  },

  continueButton: {
    backgroundColor: PRIMARY_DARK,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  continueButtonText: {
    color: BG_WHITE,
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Manrope-Bold",
  },
});
