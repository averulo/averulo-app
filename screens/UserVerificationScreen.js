import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

// Design colors from Figma
const PRIMARY_DARK = "#04123C";     // 50% purple Primary
const TEXT_DARK = "#012232";        // 80% Gray
const TEXT_GRAY = "#0F3040";        // 70% Gray
const TEXT_MEDIUM_GRAY = "#294452"; // 60% Gray
const TEXT_MEDIUM = "#3E5663";      // 50% Gray
const TEXT_LIGHT = "#5F737D";       // 40% Gray
const BG_BLUE = "#EDF4F7";          // 1% blue
const BG_WHITE = "#FCFEFE";         // 10% Gray
const BG_GRAY = "#F1F3F4";          // 15% Gray
const BORDER_GRAY = "#D4DADC";      // 20% Gray
const ERROR_RED = "#FC6868";        // Error/accent color

const idTypes = [
  { label: 'National Drivers Licence', value: 'drivers-license' },
  { label: 'Passport', value: 'passport' },
  { label: 'National Identification Number', value: 'national-id' },
];

export default function UserVerificationScreen({ navigation }) {
  const [selectedIdType, setSelectedIdType] = useState(idTypes[0]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleContinue = () => {
    if (selectedIdType.value === 'drivers-license') {
      navigation.navigate('TakePhotoOfID', { idType: selectedIdType.value });
    } else if (selectedIdType.value === 'passport') {
      navigation.navigate('TakePhotoOfPassport');
    } else if (selectedIdType.value === 'national-id') {
      navigation.navigate('InputNIN');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={TEXT_GRAY} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Verify</Text>
          <TouchableOpacity
            style={styles.skipBtn}
            onPress={() => navigation.reset({
              index: 0,
              routes: [{ name: 'MainTabs' }],
            })}
          >
            <Text style={styles.skip}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text style={styles.title}>Users Verification</Text>

        {/* ID Selection */}
        <View style={styles.idSelectionContainer}>
          <Text style={styles.label}>Please select your preferred ID</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.dropdownText}>
              {selectedIdType.label}
            </Text>
            <Ionicons name="chevron-down" size={24} color={TEXT_LIGHT} />
          </TouchableOpacity>
        </View>

        {/* Custom Modal */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Please select ID type</Text>
              <Text style={styles.modalSub}>Select your prefer type</Text>
              <FlatList
                data={idTypes}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setSelectedIdType(item);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

        {/* Get your ID card ready - Card */}
        <View style={styles.idReadyCard}>
          {/* Title & Subtitle */}
          <View style={styles.idReadyHeader}>
            <Text style={styles.guideTitle}>Get your ID card ready</Text>
            <Text style={styles.guideSub}>You'll capture the front and back of the ID</Text>
          </View>

          {/* ID Illustration */}
          <View style={styles.idIllustrationWrapper}>
            <Image
              source={require('../assets/images/id-card-illustration.png')}
              resizeMode="contain"
              style={styles.illustration}
            />
          </View>
        </View>

        {/* No Crop, No Blur, No Glare */}
        <View style={styles.guidelinesContainer}>
          <View style={styles.guidelineItem}>
            <View style={styles.guidelineIconWrapper}>
              <Image
                source={require('../assets/images/guidelines.png')}
                resizeMode="contain"
                style={styles.guidelineIcon}
              />
            </View>
            <Text style={styles.guidelineLabel}>No Crop</Text>
          </View>
          <View style={styles.guidelineItem}>
            <View style={styles.guidelineIconWrapper}>
              <Image
                source={require('../assets/images/guidelines.png')}
                resizeMode="contain"
                style={styles.guidelineIcon}
              />
            </View>
            <Text style={styles.guidelineLabel}>No Blur</Text>
          </View>
          <View style={styles.guidelineItem}>
            <View style={styles.guidelineIconWrapper}>
              <Image
                source={require('../assets/images/guidelines.png')}
                resizeMode="contain"
                style={styles.guidelineIcon}
              />
            </View>
            <Text style={styles.guidelineLabel}>No Glare</Text>
          </View>
        </View>

        {/* Avoid Section */}
        <View style={styles.avoidSection}>
          <Text style={styles.avoidTitle}>Please avoid using</Text>
          <View style={styles.avoidList}>
            <Text style={styles.avoidItem}>Expired ID</Text>
            <Text style={styles.avoidItem}>Photocopied or printed ID</Text>
          </View>
        </View>

        {/* Continue */}
        <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 32,
    marginBottom: 24,
  },
  headerTitle: {
    fontFamily: 'Manrope',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 16,
    color: TEXT_LIGHT,
  },
  skipBtn: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  skip: {
    fontFamily: 'Manrope',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 16,
    color: TEXT_DARK,
  },
  title: {
    fontFamily: 'Manrope',
    fontWeight: '400',
    fontSize: 24,
    lineHeight: 24,
    color: TEXT_MEDIUM,
    marginBottom: 36,
  },
  idSelectionContainer: {
    gap: 4,
    marginBottom: 24,
  },
  label: {
    fontFamily: 'Manrope',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 16,
    color: TEXT_MEDIUM,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: TEXT_GRAY,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 12,
    height: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontFamily: 'Manrope',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 16,
    color: '#000000',
  },
  idReadyCard: {
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 0,
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  idReadyHeader: {
    width: '100%',
    paddingHorizontal: 0,
    gap: 0,
  },
  guideTitle: {
    fontFamily: 'Manrope',
    fontWeight: '500',
    fontSize: 20,
    lineHeight: 32,
    textAlign: 'center',
    letterSpacing: -0.05 * 20,
    color: TEXT_DARK,
  },
  guideSub: {
    fontFamily: 'Manrope',
    fontWeight: '300',
    fontSize: 14,
    lineHeight: 16,
    textAlign: 'center',
    color: TEXT_MEDIUM_GRAY,
  },
  idIllustrationWrapper: {
    width: 154,
    height: 110,
    borderWidth: 4,
    borderStyle: 'dashed',
    borderColor: BG_GRAY,
    borderRadius: 16,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustration: {
    width: 130,
    height: 86,
  },
  guidelinesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 48,
    paddingVertical: 0,
    marginBottom: 16,
  },
  guidelineItem: {
    alignItems: 'center',
    gap: 9,
  },
  guidelineIconWrapper: {
    width: 64,
    height: 44,
    alignItems: 'flex-end',
  },
  guidelineIcon: {
    width: 64,
    height: 44,
  },
  guidelineLabel: {
    fontFamily: 'Manrope',
    fontWeight: '300',
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
    color: TEXT_MEDIUM_GRAY,
  },
  avoidSection: {
    backgroundColor: BG_BLUE,
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 8,
    marginBottom: 24,
    marginHorizontal: -16,
  },
  avoidTitle: {
    fontFamily: 'Manrope',
    fontWeight: '300',
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: 0.05 * 14,
    color: TEXT_MEDIUM_GRAY,
  },
  avoidList: {
    gap: 2,
  },
  avoidItem: {
    fontFamily: 'Manrope',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: TEXT_GRAY,
  },
  continueBtn: {
    backgroundColor: PRIMARY_DARK,
    paddingVertical: 16,
    paddingHorizontal: 16,
    height: 56,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    fontFamily: 'Manrope',
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
    color: BG_WHITE,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontFamily: 'Manrope',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: TEXT_DARK,
  },
  modalSub: {
    fontFamily: 'Manrope',
    fontSize: 14,
    color: TEXT_MEDIUM_GRAY,
    marginBottom: 12,
  },
  modalItem: {
    paddingVertical: 12,
  },
  modalItemText: {
    fontFamily: 'Manrope',
    fontSize: 16,
    color: '#000000',
  },
});