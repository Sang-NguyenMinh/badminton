import React, { useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import {
  Appbar,
  Searchbar,
  List,
  Text,
  useTheme,
  SegmentedButtons,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SearchBar } from "react-native-screens";

type TransactionType = "transfer" | "receive" | "purchase" | "topup";

type Transaction = {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: string;
  time: string;
};

const transactions: Transaction[] = [
  {
    id: "1",
    type: "transfer",
    description: "Chuyển tiền đến Giang Bửu Dinh",
    amount: -60000,
    date: "09/10/2024",
    time: "13:37",
  },
  {
    id: "2",
    type: "purchase",
    description: "Thanh toán BÚN BÒ THỤY",
    amount: -149000,
    date: "08/10/2024",
    time: "19:52",
  },
];

const TransactionList: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState("all");

  const renderIcon = (type: TransactionType) => {
    switch (type) {
      case "transfer":
        return (
          <MaterialCommunityIcons
            name="bank-transfer-out"
            size={24}
            color={theme.colors.error}
          />
        );
      case "receive":
        return (
          <MaterialCommunityIcons
            name="bank-transfer-in"
            size={24}
            color={theme.colors.primary}
          />
        );
      case "purchase":
        return (
          <MaterialCommunityIcons
            name="cart"
            size={24}
            color={theme.colors.error}
          />
        );
      case "topup":
        return (
          <MaterialCommunityIcons
            name="cash-plus"
            size={24}
            color={theme.colors.primary}
          />
        );
    }
  };

  const renderItem = ({ item }: { item: Transaction }) => (
    <List.Item
      title={item.description}
      description={`${item.date} ${item.time}`}
      left={() => renderIcon(item.type)}
      right={() => (
        <Text
          style={{
            color: item.amount > 0 ? theme.colors.primary : theme.colors.error,
          }}
        >
          {item.amount.toLocaleString()} đ
        </Text>
      )}
    />
  );

  const filteredTransactions = transactions.filter((transaction) => {
    if (activeTab === "all") return true;
    if (activeTab === "transfer") return transaction.type === "transfer";
    if (activeTab === "receive")
      return transaction.type === "receive" || transaction.type === "topup";
    return false;
  });

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="11:57" />
        <Appbar.Action icon="wifi" />
        <Appbar.Action icon="signal" />
        <Appbar.Action icon="battery" />
      </Appbar.Header>
      <SearchBar placeholder="Tìm kiếm giao dịch" />
      <SegmentedButtons
        value={activeTab}
        onValueChange={setActiveTab}
        buttons={[
          { value: "all", label: "Tất cả" },
          { value: "transfer", label: "Chuyển tiền" },
          { value: "receive", label: "Nhận tiền" },
        ]}
        style={styles.segmentedButtons}
      />
      <FlatList
        data={filteredTransactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchBar: {
    margin: 10,
  },
  segmentedButtons: {
    marginHorizontal: 10,
    marginBottom: 10,
  },
});

export default TransactionList;
