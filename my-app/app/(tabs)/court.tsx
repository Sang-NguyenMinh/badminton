import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";
import { getStorageItem } from "@/core/libs/storage";
import { FacilityAPIs } from "@/core/apis/facilityAPIs";

interface BadmintonCourt {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  openingHours: string;
  phoneNumber: string;
  rating: number;
}

const API_KEY = "AlzaSy-J6MHAqBkEymqbjrMuMQvCvGNRAEP82Qs"; // Thay thế bằng API key của bạn

const FacilityScreen: React.FC = () => {
  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [region, setRegion] = useState({
    latitude: 10.7763,
    longitude: 106.6342,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [badmintonCourts, setBadmintonCourts] = useState<BadmintonCourt[]>([]);

  const loadMap = async () => {
    try {
      const location = await getStorageItem("location");

      console.log(location);
      await setRegion(location);

      searchBadmintonCourts();
    } catch (error) {}
  };

  useEffect(() => {
    loadMap();
  }, []);

  const searchBadmintonCourts = async () => {
    try {
      const searchRadius = 50000;

      const response = await axios.get(
        "https://maps.gomaps.pro/maps/api/place/textsearch/json",
        {
          params: {
            query: `${searchQuery} sân cầu lông`,
            location: `${region.latitude},${region.longitude}`,
            radius: searchRadius,
            key: API_KEY,
          },
        }
      );

      if (response.data.status === "OK" && response.data.results) {
        const courts = response.data.results.map((result: any) => ({
          id: result.place_id,
          name: result.name,
          address: result.formatted_address || "",
          rating: result.rating || 0,
          location: result.geometry.location,
        }));
        setBadmintonCourts(courts);
        console.log(courts);
      } else {
        Alert.alert(
          "Thông báo",
          "Không tìm thấy sân cầu lông phù hợp ở khu vực này"
        );
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sân cầu lông:", error);
      Alert.alert("Lỗi", "Không thể tìm kiếm sân cầu lông");
    }
  };

  const handleInputChange = (text: string) => {
    setSearchQuery(text);
  };

  const bookingPress = async (phone: string) => {
    if (phone) {
      const facility = await FacilityAPIs.getFacilyByPhone(
        phone?.replace(/\s+/g, "")
      );

      router.push({
        pathname: "/(main)/court-details",
        params: {
          item: JSON.stringify({
            facilityId: facility._id,
            name: facility.name,
            address: facility.address,
          }),
        },
      });
    } else
      Alert.alert(
        "Thông báo",
        "Sân chưa đăng ký dịch vụ vui lòng thử lại sau."
      );
  };

  const FacilityItem: React.FC<{ facility: any }> = ({ facility }) => (
    <TouchableOpacity>
      <View style={styles.itemContainer}>
        <Image
          source={require("../../assets/images/racket_marker_icon.png")}
          style={styles.icon}
        />
        <View style={styles.itemContent}>
          <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">
            {facility.name}
          </Text>
          <Text
            style={styles.itemAddress}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {facility.address}
          </Text>
          <View style={styles.itemFooter}>
            <View style={styles.ratingContainer}>
              {[...Array(Math.round(facility.rating))].map((_, index) => (
                <Feather
                  key={index}
                  name="star"
                  size={16}
                  color={index < Math.round(facility.rating) ? "red" : "yellow"}
                />
              ))}
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.bookingButton}
          onPress={() => {
            bookingPress(facility.phone);
          }}
        >
          <Text style={styles.bookingButtonText}>ĐẶT LỊCH</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Image
            source={require("../../assets/images/icon_badminton.png")}
            style={[
              {
                width: 26,
                height: 26,
                marginRight: 10,
              },
            ]}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm sân quanh đây"
            value={searchQuery}
            onChangeText={handleInputChange}
          />
          <TouchableOpacity onPress={searchBadmintonCourts}>
            <Feather
              name="search"
              size={24}
              color="black"
              style={styles.searchIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={badmintonCourts}
        renderItem={({ item }) => <FacilityItem facility={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  header: {
    height: 120,
    backgroundColor: "lightblue",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  searchBar: {
    height: 50,
    backgroundColor: "white",
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginTop: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  suggestionList: {
    backgroundColor: "white",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: 5,
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
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
  directionsButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  directionsButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  itemAddress: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    width: 220,
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: "row",
  },
  bookingButton: {
    backgroundColor: "#5ccef7",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: "center",
    marginLeft: 10,
    height: 40,
  },
  bookingButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  listContent: {
    padding: 10,
  },
});

export default FacilityScreen;
