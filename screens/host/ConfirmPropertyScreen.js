// screens/host/ConfirmPropertyScreen.js
import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const PRIMARY_DARK = '#04123C';
const TEXT_DARK = '#111827';
const TEXT_MEDIUM = '#6B7280';
const BORDER_GRAY = '#E5E7EB';
const BG_LIGHT_BLUE = '#EFF6FF';
const ORANGE = '#F59E0B';

export default function ConfirmPropertyScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const propertyData = route?.params || {};

  // Use data from previous screens or fallback to sample
  const [hotelName] = useState(propertyData.propertyName || 'Lugar de grande 510, South Africa');
  const [accountPosition] = useState(propertyData.accountHolderPosition || 'General Manager');
  const [phoneNumber] = useState(propertyData.phoneNumber || '555 210 4519');
  const [hotelEmail] = useState(propertyData.hotelEmail || 'contact@mail.com');
  const [website] = useState(propertyData.website || 'sunset_hotel.com');
  const [hotelType] = useState(propertyData.hotelType || 'Boutique Spa Hotel');
  const [location] = useState(propertyData.location || 'Lagos, Ikeja, Nigeria');
  const [designConcept] = useState(propertyData.designConcept || '');
  const [uniqueExperiences] = useState(propertyData.uniqueExperiences || '');
  const [customerService] = useState(propertyData.customerService || '');
  const [hotelStory] = useState(propertyData.hotelStory || '');

  const roomCounts = propertyData.roomCounts || {};
  const roomPrices = propertyData.roomPrices || {};
  const roomMedia = propertyData.roomMedia || {};

  const selectedRooms = Object.entries(roomCounts).filter(([_, count]) => count > 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Confirm your information</Text>
          <Text style={styles.subtitle}>
            Review the final stage of creating your hotel
          </Text>
        </View>

        <View style={styles.content}>
          {/* Hotel Name */}
          <InfoField
            label="What is the Name of your hotel"
            value={hotelName}
            onEdit={() => navigation.goBack()}
          />

          {/* Account Holder Position */}
          <InfoField
            label="Position of the Primary account holder"
            value={accountPosition}
            onEdit={() => navigation.goBack()}
          />

          {/* Contact Information with Icons */}
          <ContactField
            label="Hotel Phone Number"
            value={phoneNumber}
            icon="call-outline"
            onEdit={() => navigation.goBack()}
          />

          <ContactField
            label="Hotel Email"
            value={hotelEmail}
            icon="mail-outline"
            onEdit={() => navigation.goBack()}
          />

          <ContactField
            label="Website"
            value={website}
            icon="globe-outline"
            onEdit={() => navigation.goBack()}
          />

          {/* Hotel Type */}
          <InfoField
            label="Which of these best describes your hotel"
            value={hotelType}
            onEdit={() => navigation.goBack()}
          />

          {/* Location */}
          <InfoField
            label="Where's your hotel located"
            sublabel="Hotel Address"
            value={location}
            onEdit={() => navigation.goBack()}
          />

          {/* Design Concept */}
          {designConcept ? (
            <TextAreaField
              label="What inspired the design or concept of your hotel?"
              sublabel="(Explain how your hotel's style, architecture, or theme stands out.)"
              value={designConcept}
              onEdit={() => navigation.goBack()}
            />
          ) : null}

          {/* Unique Experiences */}
          {uniqueExperiences ? (
            <TextAreaField
              label="What unique experiences or activities do you offer to guests?"
              sublabel="(E.g., cultural tours, workshops, exclusive events, etc.)"
              value={uniqueExperiences}
              onEdit={() => navigation.goBack()}
            />
          ) : null}

          {/* Customer Service */}
          {customerService ? (
            <TextAreaField
              label="What is your approach to customer service?"
              sublabel="(E.g., personalized service, multilingual staff, tailored experiences.)"
              value={customerService}
              onEdit={() => navigation.goBack()}
            />
          ) : null}

          {/* Hotel Story */}
          {hotelStory ? (
            <TextAreaField
              label="Is there a story or vision behind the creation of your hotel?"
              value={hotelStory}
              onEdit={() => navigation.goBack()}
            />
          ) : null}

          {/* Upload Photos Section */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Add different media of the hotel</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={() => navigation.goBack()}>
              <Ionicons name="cloud-upload-outline" size={20} color={TEXT_DARK} />
              <Text style={styles.uploadButtonText}>Upload photos</Text>
            </TouchableOpacity>
          </View>

          {/* Room Types */}
          {selectedRooms.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>
                Choose the type of rooms you have and number
              </Text>
              {selectedRooms.map(([roomId, count]) => (
                <RoomTypeRow key={roomId} roomId={roomId} count={count} />
              ))}
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.editButton}>EDIT</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Upload Room Photos */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Let's add some media of each room type</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={() => navigation.goBack()}>
              <Ionicons name="cloud-upload-outline" size={20} color={TEXT_DARK} />
              <Text style={styles.uploadButtonText}>Upload photos</Text>
            </TouchableOpacity>
          </View>

          {/* Room Pricing Cards */}
          {selectedRooms.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Add prices</Text>
              {selectedRooms.map(([roomId]) => {
                const price = roomPrices[roomId] || '644,653';
                const media = roomMedia[roomId] || [];
                const roomLabel = getRoomLabel(roomId);

                return (
                  <RoomPriceCard
                    key={roomId}
                    roomLabel={roomLabel}
                    price={price}
                    media={media}
                    onEdit={() => navigation.goBack()}
                  />
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Fixed Confirm Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => {
            navigation.navigate('PropertyPreviewScreen', propertyData);
          }}
        >
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Helper function to get room label from ID
function getRoomLabel(roomId) {
  const roomLabels = {
    standard: 'Standard Room',
    deluxe: 'Deluxe Room',
    suite: 'Suite',
    junior_suite: 'Junior Suite',
    executive: 'Executive Room',
    family: 'Family Room',
    connecting: 'Connecting Rooms',
    premium: 'Premium Room',
    penthouse: 'Penthouse Suite',
    king: 'King',
  };
  return roomLabels[roomId] || roomId;
}

// Info Field Component
function InfoField({ label, sublabel, value, onEdit }) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {sublabel && <Text style={styles.fieldSublabel}>{sublabel}</Text>}
      <View style={styles.fieldBox}>
        <Text style={styles.fieldValue}>{value}</Text>
        <TouchableOpacity onPress={onEdit}>
          <Text style={styles.editButton}>EDIT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Contact Field with Icon
function ContactField({ label, value, icon, onEdit }) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.contactFieldBox}>
        <Text style={styles.fieldValue}>{value}</Text>
        <View style={styles.contactIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name={icon} size={18} color={TEXT_MEDIUM} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onEdit}>
            <Text style={styles.editButton}>EDIT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// Text Area Field Component
function TextAreaField({ label, sublabel, value, onEdit }) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {sublabel && <Text style={styles.fieldSublabel}>{sublabel}</Text>}
      <View style={styles.textAreaBox}>
        <Text style={styles.textAreaValue}>{value}</Text>
      </View>
      <TouchableOpacity onPress={onEdit} style={styles.editButtonContainer}>
        <Text style={styles.editButton}>EDIT</Text>
      </TouchableOpacity>
    </View>
  );
}

// Room Type Row Component
function RoomTypeRow({ roomId, count }) {
  const roomLabel = getRoomLabel(roomId);

  return (
    <View style={styles.roomTypeRow}>
      <Ionicons name="bed-outline" size={24} color={TEXT_DARK} />
      <Text style={styles.roomTypeLabel}>{roomLabel}: {count}</Text>
    </View>
  );
}

// Room Price Card Component
function RoomPriceCard({ roomLabel, price, media, onEdit }) {
  const firstImage = media && media.length > 0 ? media[0] : null;

  return (
    <View style={styles.priceCard}>
      {/* Room Image */}
      <View style={styles.priceImageContainer}>
        {firstImage ? (
          <Image
            source={{ uri: firstImage.uri || firstImage }}
            style={styles.priceImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.priceImagePlaceholder}>
            <Ionicons name="bed-outline" size={48} color={TEXT_MEDIUM} />
          </View>
        )}
      </View>

      {/* Room Label and Price */}
      <Text style={styles.priceCardLabel}>{roomLabel}</Text>
      <Text style={styles.priceCardAmount}>${price}</Text>

      {/* Edit Button */}
      <TouchableOpacity onPress={onEdit} style={styles.priceEditButton}>
        <Text style={styles.editButton}>EDIT</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Manrope-Bold',
    color: TEXT_DARK,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: TEXT_MEDIUM,
    fontFamily: 'Manrope-Regular',
  },
  content: {
    paddingHorizontal: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 12,
    color: TEXT_MEDIUM,
    marginBottom: 8,
    fontFamily: 'Manrope-Regular',
  },
  fieldSublabel: {
    fontSize: 11,
    color: TEXT_MEDIUM,
    marginBottom: 8,
    fontFamily: 'Manrope-Regular',
  },
  fieldBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: BG_LIGHT_BLUE,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  fieldValue: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Manrope-Medium',
    color: TEXT_DARK,
  },
  contactFieldBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: BG_LIGHT_BLUE,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  contactIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  textAreaBox: {
    backgroundColor: BG_LIGHT_BLUE,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 80,
  },
  textAreaValue: {
    fontSize: 13,
    fontFamily: 'Manrope-Regular',
    color: TEXT_MEDIUM,
    lineHeight: 20,
  },
  editButtonContainer: {
    marginTop: 8,
  },
  editButton: {
    fontSize: 13,
    color: ORANGE,
    fontFamily: 'Manrope-SemiBold',
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 12,
    color: TEXT_MEDIUM,
    marginBottom: 12,
    fontFamily: 'Manrope-Regular',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: BG_LIGHT_BLUE,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  uploadButtonText: {
    fontSize: 14,
    fontFamily: 'Manrope-Medium',
    color: TEXT_DARK,
  },
  roomTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: BG_LIGHT_BLUE,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  roomTypeLabel: {
    fontSize: 14,
    fontFamily: 'Manrope-Medium',
    color: TEXT_DARK,
  },
  priceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    overflow: 'hidden',
    marginBottom: 20,
  },
  priceImageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#F5F5F5',
  },
  priceImage: {
    width: '100%',
    height: '100%',
  },
  priceImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  priceCardLabel: {
    fontSize: 18,
    fontFamily: 'Manrope-SemiBold',
    color: TEXT_DARK,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  priceCardAmount: {
    fontSize: 24,
    fontFamily: 'Manrope-Bold',
    color: TEXT_DARK,
    textAlign: 'center',
    marginBottom: 16,
  },
  priceEditButton: {
    alignItems: 'center',
    marginBottom: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: BORDER_GRAY,
  },
  confirmButton: {
    backgroundColor: PRIMARY_DARK,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Manrope-Bold',
  },
});
