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

const idTypes = [
  { label: 'National Driver Licence', value: 'drivers-license' },
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
            <Ionicons name="arrow-back" size={24} color="#000A63" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Verify</Text>
          <TouchableOpacity
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
        <Text style={styles.label}>Please select your preferred ID</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.dropdownText}>
            {selectedIdType.label}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#000" />
        </TouchableOpacity>

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

        {/* ID Illustration */}
        <View style={styles.imageWrapper}>
          <Image
            source={require('../assets/images/id-card-illustration.png')}
            resizeMode="contain"
            style={styles.illustration}
          />
        </View>

        {/* Guideline Text */}
        <Text style={styles.guideTitle}>Get your ID card ready</Text>
        <Text style={styles.guideSub}>You’ll capture the front and back of the ID</Text>

        {/* Guideline Image */}
        <Image
          source={require('../assets/images/guidelines.png')}
          resizeMode="contain"
          style={styles.guidelineImage}
        />
        <Text style={styles.noGlareText}>No Crop, No Blur, No Glare</Text>

        {/* Avoid Card */}
        <View style={styles.avoidCard}>
          <Text style={styles.avoidTitle}>Please avoid using</Text>
          <Text style={styles.avoidItem}>• Expired ID</Text>
          <Text style={styles.avoidItem}>• Photocopied or printed ID</Text>
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
  safeArea: { flex: 1, backgroundColor: '#fff' },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000A63',
  },
  skip: {
    fontSize: 16,
    color: '#000A63',
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000A63',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 6,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#A5B4FC',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  dropdownText: {
    fontSize: 15,
    color: '#111',
  },
  imageWrapper: {
    alignItems: 'center',
    marginBottom: 12,
  },
  illustration: {
    width: width * 0.65,
    height: width * 0.35,
  },
  guideTitle: {
    fontSize: 18,
    color: '#000A63',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  guideSub: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    marginBottom: 12,
  },
  guidelineImage: {
    width: width * 0.85,
    height: width * 0.18,
    alignSelf: 'center',
    marginBottom: 8,
  },
  noGlareText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#000A63',
    fontWeight: '600',
    marginBottom: 20,
  },
  avoidCard: {
    backgroundColor: '#F5F8FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  avoidTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#b38a00',
    marginBottom: 8,
  },
  avoidItem: {
    fontSize: 15,
    color: '#b38a00',
    marginBottom: 4,
  },
  continueBtn: {
    backgroundColor: '#000A63',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000A63',
  },
  modalSub: {
    fontSize: 14,
    color: '#777',
    marginBottom: 12,
  },
  modalItem: {
    paddingVertical: 12,
  },
  modalItemText: {
    fontSize: 16,
    color: '#111',
  },
});