// components/DateRangePicker.js
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";

const PRIMARY_DARK = "#04123C";
const TEXT_DARK = "#012232";
const TEXT_MEDIUM = "#3E5663";
const TEXT_LIGHT = "#5F737D";
const BG_GRAY = "#F1F3F4";
const BORDER_GRAY = "#D4DADC";

export default function DateRangePicker({ checkIn, checkOut, onDatesChange }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempCheckIn, setTempCheckIn] = useState(checkIn);
  const [tempCheckOut, setTempCheckOut] = useState(checkOut);
  const [selectingCheckOut, setSelectingCheckOut] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDayPress = (day) => {
    const selectedDate = day.dateString;

    if (!selectingCheckOut) {
      // Selecting check-in date
      setTempCheckIn(selectedDate);
      setTempCheckOut(""); // Reset check-out
      setSelectingCheckOut(true);
    } else {
      // Selecting check-out date
      if (new Date(selectedDate) <= new Date(tempCheckIn)) {
        // If selected date is before or equal to check-in, reset and start over
        setTempCheckIn(selectedDate);
        setTempCheckOut("");
        setSelectingCheckOut(true);
      } else {
        setTempCheckOut(selectedDate);
      }
    }
  };

  const handleConfirm = () => {
    if (tempCheckIn && tempCheckOut) {
      onDatesChange(tempCheckIn, tempCheckOut);
      setModalVisible(false);
      setSelectingCheckOut(false);
    }
  };

  const handleCancel = () => {
    setTempCheckIn(checkIn);
    setTempCheckOut(checkOut);
    setModalVisible(false);
    setSelectingCheckOut(false);
  };

  const getMarkedDates = () => {
    const marked = {};

    if (tempCheckIn) {
      marked[tempCheckIn] = {
        startingDay: true,
        color: PRIMARY_DARK,
        textColor: "#FFFFFF",
      };
    }

    if (tempCheckOut) {
      marked[tempCheckOut] = {
        endingDay: true,
        color: PRIMARY_DARK,
        textColor: "#FFFFFF",
      };

      // Mark all dates in between
      if (tempCheckIn) {
        const start = new Date(tempCheckIn);
        const end = new Date(tempCheckOut);
        const current = new Date(start);
        current.setDate(current.getDate() + 1);

        while (current < end) {
          const dateString = current.toISOString().split("T")[0];
          marked[dateString] = {
            color: PRIMARY_DARK + "40",
            textColor: TEXT_DARK,
          };
          current.setDate(current.getDate() + 1);
        }
      }
    }

    return marked;
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      {/* Date Display Fields */}
      <View style={styles.dateFieldsContainer}>
        <TouchableOpacity
          style={styles.dateField}
          onPress={() => setModalVisible(true)}
        >
          <View style={styles.dateFieldContent}>
            <Ionicons name="calendar-outline" size={20} color={TEXT_MEDIUM} />
            <View style={styles.dateTextContainer}>
              <Text style={styles.dateLabel}>Check-in</Text>
              <Text style={styles.dateValue}>
                {checkIn ? formatDate(checkIn) : "Select date"}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.arrowContainer}>
          <Ionicons name="arrow-forward" size={20} color={TEXT_LIGHT} />
        </View>

        <TouchableOpacity
          style={styles.dateField}
          onPress={() => setModalVisible(true)}
        >
          <View style={styles.dateFieldContent}>
            <Ionicons name="calendar-outline" size={20} color={TEXT_MEDIUM} />
            <View style={styles.dateTextContainer}>
              <Text style={styles.dateLabel}>Check-out</Text>
              <Text style={styles.dateValue}>
                {checkOut ? formatDate(checkOut) : "Select date"}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Calendar Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Dates</Text>
              <TouchableOpacity onPress={handleCancel}>
                <Ionicons name="close" size={24} color={TEXT_DARK} />
              </TouchableOpacity>
            </View>

            {/* Instructions */}
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsText}>
                {!selectingCheckOut
                  ? "Select your check-in date"
                  : "Select your check-out date"}
              </Text>
            </View>

            {/* Selected Dates Display */}
            <View style={styles.selectedDatesContainer}>
              <View style={styles.selectedDate}>
                <Text style={styles.selectedDateLabel}>Check-in</Text>
                <Text style={styles.selectedDateValue}>
                  {tempCheckIn ? formatDate(tempCheckIn) : "Not selected"}
                </Text>
              </View>
              <View style={styles.selectedDate}>
                <Text style={styles.selectedDateLabel}>Check-out</Text>
                <Text style={styles.selectedDateValue}>
                  {tempCheckOut ? formatDate(tempCheckOut) : "Not selected"}
                </Text>
              </View>
            </View>

            {/* Calendar */}
            <Calendar
              minDate={today}
              onDayPress={handleDayPress}
              markingType="period"
              markedDates={getMarkedDates()}
              theme={{
                todayTextColor: PRIMARY_DARK,
                selectedDayBackgroundColor: PRIMARY_DARK,
                selectedDayTextColor: "#FFFFFF",
                arrowColor: PRIMARY_DARK,
                monthTextColor: TEXT_DARK,
                textMonthFontFamily: "Manrope-SemiBold",
                textMonthFontWeight: "600",
                textMonthFontSize: 18,
                textDayFontFamily: "Manrope-Regular",
                textDayFontSize: 14,
                textDayHeaderFontFamily: "Manrope-SemiBold",
                textDayHeaderFontWeight: "600",
              }}
              style={styles.calendar}
            />

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  (!tempCheckIn || !tempCheckOut) &&
                    styles.confirmButtonDisabled,
                ]}
                onPress={handleConfirm}
                disabled={!tempCheckIn || !tempCheckOut}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  dateFieldsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  dateField: {
    flex: 1,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 10,
    padding: 14,
    backgroundColor: "#FAFAFA",
  },
  dateFieldContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dateTextContainer: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 14,
    fontFamily: "Manrope-SemiBold",
    color: TEXT_DARK,
  },
  arrowContainer: {
    paddingBottom: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_GRAY,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Manrope-Bold",
    color: TEXT_DARK,
  },
  instructionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: BG_GRAY,
  },
  instructionsText: {
    fontSize: 14,
    fontFamily: "Manrope-Medium",
    color: TEXT_MEDIUM,
    textAlign: "center",
  },
  selectedDatesContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  selectedDate: {
    flex: 1,
  },
  selectedDateLabel: {
    fontSize: 12,
    fontFamily: "Manrope-Regular",
    color: TEXT_MEDIUM,
    marginBottom: 4,
  },
  selectedDateValue: {
    fontSize: 14,
    fontFamily: "Manrope-SemiBold",
    color: TEXT_DARK,
  },
  calendar: {
    paddingHorizontal: 10,
  },
  modalActions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: TEXT_MEDIUM,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: PRIMARY_DARK,
    alignItems: "center",
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold",
    color: "#FFFFFF",
  },
});
