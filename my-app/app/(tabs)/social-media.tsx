import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, Badge } from "react-native-paper";
import { useRouter } from "expo-router";
import { useAppSelector } from "@/core/redux/hooks";
import { SocialMediaAPIs } from "@/core/apis/socialMediaAPIs";

interface Friend {
  id: string;
  name: string;
  avatar: string;
  mutualFriends?: number;
  timeAgo?: string;
}

interface FriendRequest extends Friend {
  mutualFriends: number;
  timeAgo: string;
}

const PostItem: React.FC<any> = (post) => (
  <View style={styles.postContainer}>
    <View style={styles.postHeader}>
      <Image source={{ uri: post.post?.owner?.avatar }} style={styles.avatar} />
      <Text style={styles.authorName}>{post.post?.owner?.displayName}</Text>
    </View>
    <Text style={styles.postContent}>{post?.post?.content}</Text>
    {post.post.images.map((image: string) => (
      <Image
        key={post.post._id}
        source={{ uri: image }}
        style={styles.postImage}
      />
    ))}
    <View style={styles.postFooter}>
      <TouchableOpacity style={styles.actionButton}>
        <Text>❤️ {post.likes}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => {
          console.log(post.post.owner.displayName);
        }}
      >
        <Text>💬 {post.comments}</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const FriendRequestItem: React.FC<{ request: FriendRequest }> = ({
  request,
}) => (
  <View style={styles.friendRequestContainer}>
    <Image source={{ uri: request.avatar }} style={styles.avatar} />
    <View style={styles.friendRequestInfo}>
      <Text style={styles.friendName}>{request.name}</Text>
      <Text style={styles.mutualFriends}>
        {request.mutualFriends} bạn chung · {request.timeAgo}
      </Text>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.acceptButton}>
          <Text style={styles.acceptButtonText}>Chấp nhận</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const FriendItem: React.FC<{ friend: Friend }> = ({ friend }) => (
  <View style={styles.friendContainer}>
    <Image source={{ uri: friend.avatar }} style={styles.avatar} />
    <View style={styles.friendInfo}>
      <Text style={styles.friendName}>{friend.name}</Text>
    </View>
  </View>
);

const SocialMedia: React.FC = () => {
  const router = useRouter();
  const { me } = useAppSelector((state) => state.reducer);
  const [post, setPost] = useState<any[]>([]);

  const loadPost = async () => {
    const res = await SocialMediaAPIs.getPost({ current: 1 });
    await setPost(res.results);
  };

  useEffect(() => {
    loadPost();
    console.log("d");
  }, []);

  const [activeMainTab, setActiveMainTab] = useState<"posts" | "friends">(
    "posts"
  );
  const [activeFriendsTab, setActiveFriendsTab] = useState<
    "suggestions" | "allFriends"
  >("suggestions");

  const friendRequests: FriendRequest[] = [
    {
      id: "1",
      name: "Thái Tư",
      avatar:
        "data:image/jpeg;base64,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",

      mutualFriends: 12,
      timeAgo: "17 giờ",
    },
  ];

  const allFriends: Friend[] = [
    {
      id: "3",
      name: "Hữu Thuận",
      avatar: "https://example.com/avatar3.jpg",
    },
  ];
  const onCommentPress = () => {};

  const chatPress = () => {
    router.push("/(main)/list-conversation");
  };

  const createPostPress = () => {
    router.push("/(main)/create-post");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mạng xã hội</Text>
        <View style={styles.leftItem}>
          <TouchableOpacity>
            <Ionicons name="search" size={28} />
          </TouchableOpacity>
          <View>
            <TouchableOpacity
              onPress={chatPress}
              style={{ position: "relative" }}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={28} />
            </TouchableOpacity>
            <Badge style={{ position: "absolute", left: 20 }}>3</Badge>
          </View>
        </View>
      </View>

      <View style={styles.mainTabContainer}>
        <TouchableOpacity
          style={[
            styles.mainTab,
            activeMainTab === "posts" && styles.activeMainTab,
          ]}
          onPress={() => setActiveMainTab("posts")}
        >
          <Text
            style={[
              styles.mainTabText,
              activeMainTab === "posts" && styles.activeMainTabText,
            ]}
          >
            Bài đăng
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.mainTab,
            activeMainTab === "friends" && styles.activeMainTab,
          ]}
          onPress={() => setActiveMainTab("friends")}
        >
          <Text
            style={[
              styles.mainTabText,
              activeMainTab === "friends" && styles.activeMainTabText,
            ]}
          >
            Bạn bè
          </Text>
        </TouchableOpacity>
      </View>
      {activeMainTab === "posts" ? (
        <View>
          <View
            style={{
              marginBottom: 10,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "white",
              padding: 10,
            }}
          >
            <Avatar.Image
              size={45}
              source={{ uri: me?.profile?.avatar }}
              style={styles.avatar}
            />
            <TouchableOpacity
              onPress={createPostPress}
              style={{
                marginLeft: 10,
                borderRadius: 10,
                height: 42,
                flex: 1,
                borderWidth: 1,
                borderColor: "#d7dbda",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  textAlign: "center",
                  alignItems: "center",
                }}
              >
                Bạn đang nghĩ gì?
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={post}
            renderItem={({ item }) => (
              <PostItem post={item} onCommentPress={onCommentPress} />
            )}
            keyExtractor={(item) => item._id}
          />
        </View>
      ) : (
        <ScrollView>
          <View style={styles.onlineFriendsBar}>
            <Text style={styles.onlineFriendsText}>• 86 người đang online</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllButtonText}>Gợi ý</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.friendRequestsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Lời mời kết bạn {friendRequests.length}
              </Text>
              <TouchableOpacity>
                <Text style={styles.seeAllLink}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>
            {friendRequests.map((request) => (
              <FriendRequestItem key={request.id} request={request} />
            ))}
          </View>
          <View style={styles.friendsTabContainer}>
            <TouchableOpacity
              style={[
                styles.friendsTab,
                activeFriendsTab === "suggestions" && styles.activeFriendsTab,
              ]}
              onPress={() => setActiveFriendsTab("suggestions")}
            >
              <Text
                style={[
                  styles.friendsTabText,
                  activeFriendsTab === "suggestions" &&
                    styles.activeFriendsTabText,
                ]}
              >
                Gợi ý
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.friendsTab,
                activeFriendsTab === "allFriends" && styles.activeFriendsTab,
              ]}
              onPress={() => setActiveFriendsTab("allFriends")}
            >
              <Text
                style={[
                  styles.friendsTabText,
                  activeFriendsTab === "allFriends" &&
                    styles.activeFriendsTabText,
                ]}
              >
                Bạn bè
              </Text>
            </TouchableOpacity>
          </View>
          {activeFriendsTab === "allFriends" && (
            <View>
              {allFriends.map((friend) => (
                <FriendItem key={friend.id} friend={friend} />
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  leftItem: {
    display: "flex",
    flexDirection: "row",
    width: 80,
    justifyContent: "space-between",
  },
  searchIcon: {
    fontSize: 20,
  },
  mainTabContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  mainTab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 15,
  },
  activeMainTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#1877f2",
  },
  mainTabText: {
    fontSize: 16,
    color: "#65676b",
  },
  activeMainTabText: {
    color: "#1877f2",
    fontWeight: "bold",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "white",
  },
  tabButton: {
    paddingVertical: 15,
    flex: 1,
    alignItems: "center",
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#1877f2",
  },
  tabButtonText: {
    fontSize: 16,
    color: "#65676b",
  },
  activeTabButtonText: {
    color: "#1877f2",
    fontWeight: "bold",
  },

  postContainer: {
    backgroundColor: "white",
    marginBottom: 10,
    padding: 15,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  authorName: {
    fontWeight: "bold",
  },
  postContent: {
    marginBottom: 10,
  },
  postImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginBottom: 10,
  },
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  friendsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  friendsTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  friendsCount: {
    fontSize: 16,
    color: "#65676b",
  },
  friendContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  lastActive: {
    fontSize: 14,
    color: "#65676b",
  },
  chatButton: {
    backgroundColor: "#e7f3ff",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chatButtonText: {
    color: "#1877f2",
    fontWeight: "bold",
  },
  onlineFriendsBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  onlineFriendsText: {
    color: "#4CAF50",
  },
  seeAllButton: {
    backgroundColor: "#e7f3ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  seeAllButtonText: {
    color: "#1877f2",
  },
  friendRequestsSection: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  seeAllLink: {
    color: "#1877f2",
  },
  friendRequestContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  friendRequestInfo: {
    flex: 1,
  },
  mutualFriends: {
    fontSize: 14,
    color: "#65676b",
    marginBottom: 5,
  },
  actionButtons: {
    flexDirection: "row",
  },
  acceptButton: {
    backgroundColor: "#1877f2",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  acceptButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#e4e6eb",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "black",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#1877f2",
  },
  tabText: {
    color: "#65676b",
  },
  activeTabText: {
    color: "#1877f2",
    fontWeight: "bold",
  },
  friendsTabContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  friendsTab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  activeFriendsTab: {
    backgroundColor: "#e7f3ff",
  },
  friendsTabText: {
    fontSize: 14,
    color: "#65676b",
  },
  activeFriendsTabText: {
    color: "#1877f2",
    fontWeight: "bold",
  },
});

export default SocialMedia;
