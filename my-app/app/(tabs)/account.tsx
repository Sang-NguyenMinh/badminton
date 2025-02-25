import React from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Avatar, Card, Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSelector } from "@/core/redux/hooks";
import { Href, Link, useRouter } from "expo-router";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

const UserScreen = () => {
  const router = useRouter();
  interface TienIch {
    icon: any;
    name: string;
    href: Href<string | object>;
  }
  const badges: TienIch[] = [
    {
      icon: <Ionicons name="file-tray-full" size={22} />,
      name: "Lịch sử",
      href: "/(auths)/login",
    },
    {
      icon: <Ionicons name="chatbox" size={22} />,
      name: "Đoạn chat",
      href: "/(auths)/register",
    },
    {
      icon: <Ionicons name="map" size={22} />,
      name: "Map",
      href: "/(auths)/forgot-password",
    },
    {
      icon: <MaterialCommunityIcons name="badminton" size={22} />,
      name: "Sân cầu",
      href: "/(auths)/opt",
    },
    {
      icon: <Ionicons name="settings" size={22} />,
      name: "Cài đặt",
      href: "/(main)/settings",
    },
  ];

  const { me } = useAppSelector((state) => state.reducer);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <LinearGradient
          colors={["#4c669f", "#3b5998", "#192f6a"]}
          style={styles.header}
        >
          <TouchableOpacity style={styles.settingsButton}>
            <Link href={"/(main)/settings"}>Cài đặt</Link>
          </TouchableOpacity>
          <Avatar.Image
            size={80}
            source={{ uri: me?.profile?.avatar }}
            style={styles.avatar}
          />
          <Text style={styles.name}>
            {me.profile?.displayName ?? "Unknown"}
          </Text>
          <Text style={styles.email}>
            {me?.profile?.email ?? "unknown@gmail.com"}
          </Text>
        </LinearGradient>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Tiện ích</Text>
          <View style={styles.badgesContainer}>
            {badges.map((badge, index) => (
              <TouchableOpacity
                key={index}
                style={styles.badgeWrapper}
                onPress={() => {
                  router.push(badge.href);
                }}
              >
                <View style={styles.badge}>
                  <Text style={styles.badgeEmoji}>{badge.icon}</Text>
                </View>
                <Text style={styles.badgeName}>{badge.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Lịch đặt gần đây</Text>
          <Card style={styles.activityCard}>
            <Card.Content>
              <Text style={styles.activityTitle}>Crispy Calamari</Text>
              <View style={styles.activityDetails}>
                <Text>24 July</Text>
                <Text>10:00 AM</Text>
                <Text>12,560</Text>
              </View>
            </Card.Content>
          </Card>
          <Card style={styles.activityCard}>
            <Card.Content>
              <Text style={styles.activityTitle}>Teatro Cubano</Text>
              <View style={styles.activityDetails}>
                <Text>26 July</Text>
                <Text>12:00 PM</Text>
                <Text>10,560</Text>
              </View>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 6,
  },
  header: {
    padding: 20,
    alignItems: "center",
    borderRadius: 20,
  },
  settingsButton: {
    position: "absolute",
    right: 10,
    top: 40,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
  },
  avatar: {
    marginTop: 40,
  },
  name: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  email: {
    color: "white",
    fontSize: 16,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginBottom: 20,
  },
  badgeWrapper: {
    alignItems: "center",
    marginBottom: 15,
    width: "25%",
  },
  badge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  badgeEmoji: {
    fontSize: 24,
  },
  badgeName: {
    fontSize: 12,
    textAlign: "center",
  },
  activityCard: {
    marginBottom: 10,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  activityDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
});

export default UserScreen;
