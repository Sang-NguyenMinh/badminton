import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
  Modal,
  Image,
  Platform,
} from "react-native";
import MapView, {
  Callout,
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import * as Location from "expo-location";
import { debounce } from "lodash";
import { FacilityAPIs } from "@/core/apis/facilityAPIs";
import { useRouter } from "expo-router";
import { setStorageItem } from "@/core/libs/storage";
import {
  Button,
  Card,
  Divider,
  List,
  Paragraph,
  Title,
} from "react-native-paper";
import * as Notifications from "expo-notifications";
import { BadmintonCourt } from "@/configs/type";
import { decodePolyline } from "@/core/libs/utils";
interface Suggestion {
  place_id: string;
  description: string;
}

const API_KEY = "AlzaSy-J6MHAqBkEymqbjrMuMQvCvGNRAEP82Qs";
const MapScreen: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [region, setRegion] = useState({
    latitude: 10.7763,
    longitude: 106.6342,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [badmintonCourts, setBadmintonCourts] = useState<BadmintonCourt[]>([]);

  const [directionsCoordinates, setDirectionsCoordinates] = useState<any[]>([]);

  const [selectedCourt, setSelectedCourt] = useState<BadmintonCourt | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);

  const loadMap = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return;
    }

    try {
      let location = await Location.getCurrentPositionAsync({});
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      const region = newRegion ?? {
        latitude: 10.7763,
        longitude: 106.6342,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setStorageItem("location", region);
      setRegion(region);
      searchBadmintonCourts(region);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    loadMap();
    getPer();
  }, []);

  const getPer = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    console.log("Notification permissions:", status);

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
  };

  const debouncedApiCall = React.useCallback(
    debounce(async (searchKeyword) => {
      try {
        if (searchKeyword.length > 2) {
          getAutocompleteSuggestions(searchKeyword);
        } else {
          setSuggestions([]);
        }
      } catch (error) {}
    }, 800),
    []
  );

  const handleDirections = async () => {
    if (selectedCourt) {
      try {
        const response = await axios.get(
          "https://maps.gomaps.pro/maps/api/directions/json",
          {
            params: {
              origin: `${region.latitude},${region.longitude}`,
              destination: `${selectedCourt.latitude},${selectedCourt.longitude}`,
              key: API_KEY,
            },
          }
        );

        if (response.data.routes && response.data.routes.length > 0) {
          const points = decodePolyline(
            response.data.routes[0].overview_polyline.points
          );
          setDirectionsCoordinates(points);
          setIsModalVisible(false);
        } else {
          Alert.alert("Thông báo", "Không thể tìm thấy đường đi");
        }
      } catch (error) {
        console.error("Error fetching directions:", error);
        Alert.alert("Lỗi", "Không thể lấy chỉ đường");
      }
    }
  };

  const searchBadmintonCourts = async (searchRegion: typeof region) => {
    try {
      const vietnamCenter = {
        latitude: 10.7763,
        longitude: 106.6342,
      };

      const searchRadius = 50000;

      const response = await axios.get(
        "https://maps.gomaps.pro/maps/api/place/textsearch/json",
        {
          params: {
            query: `${searchQuery} sân cầu lông`,
            location: `${vietnamCenter.latitude},${vietnamCenter.longitude}`,
            radius: searchRadius,
            key: API_KEY,
          },
        }
      );

      if (response.data.results) {
        const courts = await Promise.all(
          response.data.results.map(async (result: any) => {
            const details = await getPlaceDetails(result.place_id);
            return {
              id: result.place_id,
              name: result.name,
              latitude: result.geometry.location.lat,
              longitude: result.geometry.location.lng,
              address: details.formatted_address || "",
              openingHours:
                details.opening_hours?.weekday_text?.join("\n") ||
                "Không có thông tin",
              phoneNumber:
                details.formatted_phone_number || "Không có số điện thoại",
              rating: details.rating || 0,
            };
          })
        );
        setBadmintonCourts(courts);
      }
    } catch (error) {
      console.error("Error searching for badminton courts:", error);
      Alert.alert("Lỗi", "Không thể tìm kiếm sân cầu lông");
    }
  };

  const getPlaceDetails = async (placeId: string) => {
    try {
      const response = await axios.get(
        "https://maps.gomaps.pro/maps/api/place/details/json",
        {
          params: {
            place_id: placeId,
            fields:
              "formatted_address,formatted_phone_number,opening_hours,rating",
            key: API_KEY,
          },
        }
      );
      return response.data.result;
    } catch (error) {
      console.error("Error fetching place details:", error);
      return {};
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        "https://maps.gomaps.pro/maps/api/geocode/json",
        {
          params: {
            address: searchQuery,
            key: API_KEY,
          },
        }
      );

      if (response.data.results && response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry.location;
        const newRegion = {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setRegion(newRegion);
        searchBadmintonCourts(newRegion);
      } else {
        Alert.alert("Thông báo", "Không tìm thấy địa chỉ");
      }
    } catch (error) {
      console.error("Error searching for address:", error);
      Alert.alert("Lỗi", "Không thể tìm kiếm địa chỉ");
    }
  };

  const getAutocompleteSuggestions = async (input: string) => {
    try {
      const response = await axios.get(
        "https://maps.gomaps.pro/maps/api/place/autocomplete/json",
        {
          params: {
            input: input,
            key: API_KEY,
          },
        }
      );

      if (response.data.predictions) {
        setSuggestions(
          response.data.predictions.map((prediction: any) => ({
            place_id: prediction.place_id,
            description: prediction.description,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching autocomplete suggestions:", error);
    }
  };

  const handleInputChange = (text: string) => {
    setSearchQuery(text);
    debouncedApiCall(text);
  };

  const handleSuggestionPress = async (suggestion: Suggestion) => {
    setSearchQuery(suggestion.description);
    setSuggestions([]);
    await handleSearch();
  };

  const handleMarkerPress = (court: BadmintonCourt) => {
    console.log(court);
    setSelectedCourt(court);
    setIsModalVisible(true);
  };

  const bookingPress = async (phone: string | undefined) => {
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
  };

  const CourtDetailsModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <Card style={styles.modalView}>
            <Card.Content>
              <Title style={styles.modalTitle}>{selectedCourt?.name}</Title>
              <Paragraph style={styles.address}>
                {selectedCourt?.address}
              </Paragraph>

              <List.Section
                title="Giờ hoạt động"
                titleStyle={styles.sectionTitle}
              >
                <Paragraph>{selectedCourt?.openingHours}</Paragraph>
              </List.Section>

              <Divider style={styles.divider} />

              <List.Item
                title={selectedCourt?.phoneNumber}
                left={() => <List.Icon icon="phone" />}
              />
              <List.Item
                title={`Đánh giá: ${selectedCourt?.rating} ⭐`}
                left={() => <List.Icon icon="star" />}
              />
            </Card.Content>

            <Card.Actions style={styles.actions}>
              <Button
                mode="contained"
                onPress={handleDirections}
                style={styles.actionButton}
              >
                Chỉ đường
              </Button>
              <Button
                mode="contained"
                onPress={() => {
                  bookingPress(selectedCourt?.phoneNumber);
                }}
                style={styles.actionButton}
              >
                Đặt sân
              </Button>
            </Card.Actions>

            <Button
              onPress={() => {
                setIsModalVisible(false);
              }}
              style={styles.closeButton}
            >
              Đóng
            </Button>
          </Card>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
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
            onSubmitEditing={handleSearch}
          />
          <Feather
            name="search"
            size={24}
            color="black"
            style={styles.searchIcon}
          />
        </View>
        {suggestions.length > 0 && (
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSuggestionPress(item)}
              >
                <Text>{item.description}</Text>
              </TouchableOpacity>
            )}
            style={styles.suggestionList}
          />
        )}
      </View>

      <MapView provider={PROVIDER_GOOGLE} style={styles.map} region={region}>
        <Marker coordinate={region} />
        {badmintonCourts.map((court) => (
          <Marker
            key={court.id}
            coordinate={{
              latitude: court.latitude,
              longitude: court.longitude,
            }}
            onPress={() => handleMarkerPress(court)}
          >
            <Image
              source={require("../../assets/images/racket_marker_icon.png")}
              style={{ width: 36, height: 36 }}
              resizeMode="contain"
            />
            <Callout tooltip>
              <View>
                <Text>{court.name}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
        {directionsCoordinates.length > 0 && (
          <Polyline
            coordinates={directionsCoordinates}
            strokeColor="red"
            strokeWidth={3}
          />
        )}
      </MapView>
      <CourtDetailsModal />
    </SafeAreaView>
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
  searchContainer: {
    position: "absolute",
    top: 50,
    left: 10,
    right: 10,
    zIndex: 1,
  },
  searchBar: {
    height: 50,
    backgroundColor: "white",
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
    maxHeight: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  address: {
    marginBottom: 15,
    color: "#666",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  divider: {
    marginVertical: 15,
  },
  actions: {
    justifyContent: "space-between",
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#00CCCC",
  },
  closeButton: {
    marginTop: 10,
  },
});

export default MapScreen;
