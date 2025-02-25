import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FacilityAPIs } from "@/core/apis/facilityAPIs";
import { Button, DataTable } from "react-native-paper";
import { formatCurrency } from "@/core/libs/utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CourtAPIs } from "@/core/apis/CourtAPIs";

interface TimeSlot {
  time: string;
  isSelected: boolean;
}

interface Court {
  id: string;
  name: string;
  isAvailable: boolean;
  pricePerHour: number;
  isSelected: boolean;
}
export interface Params {
  facilityName: string;
  facilityId: string;
  address: string;
  courts: any[];
  totalPrice: number;
  date: Date;
  selectedTime: any;
  duration: number;
}

const CourtDetailScreen: React.FC = () => {
  const router = useRouter();

  const { item } = useLocalSearchParams();
  const data = JSON.parse(item as string);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [courts, setCourts] = useState<Court[]>([]);
  const [selectionCount, setSelectionCount] = useState(0);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const loadWorkingHours = async () => {
    const res = await FacilityAPIs.getWorkingHours(data.facilityId);
    const slots = res?.times.map((time: string) => ({
      time,
      isSelected: false,
    }));

    setTimeSlots(slots);

    const response = await CourtAPIs.getCourtsByFacilityId({
      facilityId: data.facilityId,
      date: selectedDate.toLocaleDateString(),
      startTime: null,
      endTime: null,
    });

    const courts: Court[] = response?.courts.map((court: any) => ({
      id: court?.courtId,
      name: court?.name,
      pricePerHour: court.pricePerHour,
      isAvailable: court.isAvailable,
      isSelected: false,
    }));

    setCourts(courts);
  };
  const loadCourts = async () => {
    const selectedTimeSlots = timeSlots.filter((slot) => slot.isSelected);
    const selectedTime = {
      start: selectedTimeSlots[0].time ?? timeSlots[0].time ?? null,
      end:
        selectedTimeSlots[selectedTimeSlots.length - 1].time ??
        timeSlots[0].time ??
        null,
    };
    const res = await CourtAPIs.getCourtsByFacilityId({
      facilityId: data.facilityId,
      date: selectedDate.toLocaleDateString(),
      startTime: selectedTime.start,
      endTime: selectedTime.end,
    });

    const courts: Court[] = res?.courts.map((court: any) => ({
      id: court?.courtId,
      name: court?.name,
      pricePerHour: court.pricePerHour,
      isAvailable: court.isAvailable,
      isSelected: false,
    }));

    setCourts(courts);
  };

  useEffect(() => {
    loadWorkingHours();
  }, []);

  const handleTimeSlotPress = (index: number) => {
    let newTimeSlots = [...timeSlots];
    let newSelectionCount = selectionCount;

    if (selectionCount === 0) {
      newTimeSlots[index].isSelected = true;
      newSelectionCount = 1;
    } else if (selectionCount === 1) {
      const firstSelectedIndex = newTimeSlots.findIndex(
        (slot) => slot.isSelected
      );
      if (index === firstSelectedIndex) {
        newTimeSlots[index].isSelected = false;
        newSelectionCount = 0;
      } else {
        const startIndex = Math.min(firstSelectedIndex, index);
        const endIndex = Math.max(firstSelectedIndex, index);
        for (let i = startIndex; i <= endIndex; i++) {
          newTimeSlots[i].isSelected = true;
        }
        newSelectionCount = 2;
        loadCourts();
      }
    } else {
      newTimeSlots = newTimeSlots.map((slot) => ({
        ...slot,
        isSelected: false,
      }));
      newSelectionCount = 0;
    }

    setTimeSlots(newTimeSlots);
    setSelectionCount(newSelectionCount);
  };

  useEffect(() => {
    if (selectionCount > 0) {
      const newCourts = courts.map((court) => ({
        ...court,
        isAvailable: true,
        isSelected: false,
      }));
      setCourts(newCourts);
    } else {
      setCourts(
        courts.map((court) => ({
          ...court,
          isAvailable: true,
          isSelected: false,
        }))
      );
    }
  }, [selectionCount]);

  const handleCourtPress = (courtId: string) => {
    setCourts(
      courts.map((court) =>
        court.id === courtId && court.isAvailable
          ? { ...court, isSelected: !court.isSelected }
          : court
      )
    );
  };

  const handleBooking = () => {
    const selectedTimeSlots = timeSlots.filter((slot) => slot.isSelected);
    const selectedCourts = courts.filter((court) => court.isSelected);

    if (selectedTimeSlots.length === 0 || selectedCourts.length === 0) {
      console.log("Please select both time slots and at least one court");
      return;
    }

    const selectedTime = {
      start: selectedTimeSlots[0].time,
      end: selectedTimeSlots[selectedTimeSlots.length - 1].time,
    };
    const duration = (selectedTimeSlots.length - 1) * 0.5;

    let totalPrice = 0;
    let listCourts: any[] = [];

    selectedCourts.forEach((selectedCourt) => {
      const price = selectedCourt.pricePerHour * duration;
      totalPrice += price;
      listCourts.push({
        id: selectedCourt.id,
        name: selectedCourt.name,
        pricePerHour: selectedCourt.pricePerHour,
        price: price,
        startTime: selectedTime.start,
        endTime: selectedTime.end,
      });
    });

    const params: Params = {
      facilityName: data.name,
      facilityId: data.facilityId,
      address: data.address,
      courts: listCourts,
      totalPrice: totalPrice,
      date: selectedDate,
      selectedTime: selectedTime,
      duration: duration,
    };

    router.push({
      pathname: "/(main)/payment",
      params: { item: JSON.stringify(params) },
    });
  };
  const PriceModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setIsModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Bảng giá</Text>

          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Tên sân</DataTable.Title>
              <DataTable.Title>Giá</DataTable.Title>
            </DataTable.Header>
            {courts.map((court) => (
              <DataTable.Row key={court.id}>
                <DataTable.Cell>{court.name}</DataTable.Cell>
                <DataTable.Cell>
                  {formatCurrency(court.pricePerHour)}
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View>
          <Text style={{ fontSize: 16, color: "white" }}>
            Lưu ý: KHÁCH HÀNG VUI LỒNG MANG GIÀY CẦU LÔNG
          </Text>
          <Text style={{ fontSize: 16, color: "white" }}>
            KHÁCH HÀNG LƯU Ý ĐƠN ĐÃ ĐẶT SẼ KHÔNG ĐỔI TRẢ.
          </Text>
        </View>
        <Text style={styles.title}>Đặt lịch theo ngày</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.dateButton}
        >
          <Text style={styles.dateButtonText}>
            {selectedDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        <View style={styles.timeSlotContainer}>
          {timeSlots.map((slot, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.timeSlot,
                slot.isSelected && styles.selectedTimeSlot,
              ]}
              onPress={() => handleTimeSlotPress(index)}
            >
              <Text
                style={[
                  styles.timeSlotText,
                  slot.isSelected && styles.selectedTimeSlotText,
                ]}
              >
                {slot.time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.subtitle}>Chọn sân</Text>
        <View style={styles.courtContainer}>
          {courts.map((court) => (
            <TouchableOpacity
              key={court.id}
              style={[
                styles.court,
                {
                  backgroundColor: court.isAvailable
                    ? court.isSelected
                      ? "#FFFF00"
                      : "#4CAF50"
                    : "#F44336",
                },
              ]}
              onPress={() => handleCourtPress(court.id)}
              disabled={!court.isAvailable}
            >
              <Text style={styles.courtText}>{court.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
        <Text style={styles.bookButtonText}>ĐẶT TRƯỚC</Text>
      </TouchableOpacity>
      <PriceModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#006400",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginVertical: 10,
  },
  dateButton: {
    backgroundColor: "#008000",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  dateButtonText: {
    color: "white",
    fontSize: 16,
  },
  timeSlotContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: 10,
  },
  timeSlot: {
    backgroundColor: "#008000",
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  selectedTimeSlot: {
    backgroundColor: "#FFFF00",
  },
  timeSlotText: {
    color: "white",
  },
  selectedTimeSlotText: {
    color: "black",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginLeft: 10,
    marginTop: 20,
  },
  courtContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: 10,
  },
  court: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    borderRadius: 5,
  },
  courtText: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
  },
  bookButton: {
    backgroundColor: "#FFA500",
    padding: 15,
    margin: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  bookButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 5,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#2196F3",
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default CourtDetailScreen;
