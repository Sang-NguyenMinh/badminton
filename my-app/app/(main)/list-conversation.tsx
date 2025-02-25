import { Conversation } from "@/configs/type";
import { ConservationAPIs } from "@/core/apis/conservationAPIs";
import { useAppSelector } from "@/core/redux/hooks";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import { Appbar, TextInput } from "react-native-paper";

export default function ConversationListScreen({ navigation }: any) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { profile } = useAppSelector((state) => state.reducer.me);
  const [keyword, setKeyword] = useState("");

  const router = useRouter();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await ConservationAPIs.getConservations();
      console.log(response);
      setConversations(response);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    }
  };

  const handleConversationPress = (conversation: Conversation) => {
    router.push({
      pathname: "/(main)/chat",
      params: { conversationId: conversation.conversationId },
    });
  };

  const debouncedApiCall = React.useCallback(
    debounce(async (keyword) => {
      try {
        fetchConversations();
      } catch (error) {}
    }, 700),
    []
  );

  const handleInputChange = async (value: string) => {
    setKeyword(value);
    debouncedApiCall(value);
  };

  const renderItem = ({ item }: { item: Conversation }) => {
    const avatarUrl = item.isGroup
      ? item?.groupAvatar
      : item.participants && item.participants.length > 0
      ? profile?._id === item.participants[0]._id
        ? item.participants[1]?.avatar
        : item.participants[0]?.avatar
      : "https://res.cloudinary.com/dzcj0i6fy/image/upload/v1718964252/purzo9ef73i9fos9ydce.jpg";

    return (
      <TouchableOpacity
        style={[styles.chatItem]}
        onPress={() => handleConversationPress(item)}
      >
        <View style={styles.row}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          <View style={styles.textContainer}>
            <Text style={styles.title}>
              {item.isGroup
                ? item.name || "Group Name"
                : item.participants && item.participants.length > 0
                ? profile?._id === item.participants[0]._id
                  ? item.participants[1]?.displayName || "Participant Name"
                  : item.participants[0]?.displayName || "Participant Name"
                : "No Participants"}
            </Text>
            <Text style={styles.subtitle}>
              {item.lastMessage?.content ?? "No content"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
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
      <FlatList
        data={conversations}
        renderItem={renderItem}
        keyExtractor={(item) => `${item._id}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 110,
    backgroundColor: "lightblue",
    justifyContent: "space-around",
    paddingTop: 20,
  },
  searchBar: {
    height: 48,
    width: 300,
    marginRight: 16,
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
  chatItem: {
    padding: 10,
    margin: 10,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
