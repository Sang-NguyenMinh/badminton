import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, FlatList, Image } from "react-native";
import { List, Text, useTheme, TextInput } from "react-native-paper";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { ReservationAPIs } from "@/core/apis/reservationAPIs";
import { debounce } from "lodash";
import { dateToString } from "@/core/libs/utils";

const TransactionList: React.FC = () => {
  const theme = useTheme();

  const [reservation, setReservation] = useState([]);

  const [keyword, setKeyword] = useState("");

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "all", title: "Tất cả" },
    { key: "pending", title: "Đang chờ" },
    { key: "completed", title: "Thành công" },
  ]);

  const loadReservation = async (param: {
    current?: number;
    keyword?: string;
  }) => {
    let statusParam = "";
    index == 0
      ? (statusParam = "")
      : index == 1
      ? (statusParam = "Pending")
      : (statusParam = "Completed");
    const res = await ReservationAPIs.getReservation({
      status: statusParam,
      keyword: param.keyword,
      current: param.current,
    });

    setReservation(res.results);
  };

  useEffect(() => {
    loadReservation({});
  }, [index]);

  const debouncedApiCall = React.useCallback(
    debounce(async (keyword) => {
      try {
        loadReservation({ keyword: keyword });
      } catch (error) {}
    }, 700),
    []
  );

  const handleInputChange = async (value: string) => {
    setKeyword(value);
    debouncedApiCall(value);
  };

  const renderItem = ({ item }: { item: any }) => (
    <List.Item
      title={item.facility.name}
      description={`Ngày đặt: ${dateToString(item.reservationDate)}\n${
        item.status == "Pending" ? "Chưa thanh toán" : "Đã thanh toán"
      }`}
      left={() => (
        <Image source={{ uri: item.facility.avatar }} width={50} height={50} />
      )}
      right={() => (
        <Text style={{ color: item.status == "Pending" ? "red" : "green" }}>
          {item.totalAmount.toLocaleString()} đ
        </Text>
      )}
      style={styles.item}
    />
  );

  const renderScene = SceneMap({
    all: () => <ReservationTab reservations={reservation} />,
    completed: () => <ReservationTab reservations={reservation} />,
    pending: () => <ReservationTab reservations={reservation} />,
  });

  const ReservationTab = ({ reservations }: { reservations: any[] }) => (
    <FlatList
      data={reservations}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
    />
  );

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: theme.colors.primary }}
      style={{ backgroundColor: theme.colors.background }}
      labelStyle={{ color: theme.colors.primary }}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="Nhập để tìm lịch đặt"
              value={keyword}
              onChangeText={(value) => handleInputChange(value)}
            />
            <Feather
              name="search"
              size={24}
              color="black"
              style={styles.searchIcon}
            />
          </View>
        </View>
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get("window").width }}
        renderTabBar={renderTabBar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    height: 120,
    backgroundColor: "lightblue",
  },
  searchContainer: {
    position: "absolute",
    top: 50,
    left: 10,
    right: 10,
    zIndex: 1,
  },
  searchBar: {
    height: 48,
    backgroundColor: "white",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    height: 8,
    flex: 1,
    fontSize: 16,
    backgroundColor: "white",
  },
  item: {
    padding: 10,
    margin: 6,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default TransactionList;
