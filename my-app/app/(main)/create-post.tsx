import React, { useState } from "react";
import { View, StyleSheet, Image, ScrollView, Alert } from "react-native";
import { Appbar, TextInput, List, Text, Button } from "react-native-paper";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { SocialMediaAPIs } from "@/core/apis/socialMediaAPIs";
import { useAppDispatch } from "@/core/redux/hooks";
import { configActions } from "@/core/redux/configSlice";

const CreatePostScreen = () => {
  const dispatch = useAppDispatch();
  const [postText, setPostText] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const handleBack = () => {
    router.back();
  };

  const handlePost = async () => {
    if (postText.trim() === "" && selectedImages.length === 0) {
      Alert.alert("Error", "Please enter some text or select images to post.");
      return;
    }

    const formData = new FormData();
    formData.append("groupId", "6708a30286e90c8470cf3e8a");
    formData.append("content", postText);

    selectedImages.forEach((image, index) => {
      formData.append("images", {
        uri: image,
        type: "image/jpeg",
        name: `image${index}.jpg`,
      } as any);
    });

    try {
      dispatch(configActions.showLoad());

      const response = await SocialMediaAPIs.createPost(formData);

      Alert.alert("Success", "Your post has been published!");
      setPostText("");
      setSelectedImages([]);
      router.back();
    } catch (error) {
      console.error("Error posting:", error);
      Alert.alert("Error", "Failed to create post. Please try again.");
    } finally {
      dispatch(configActions.hideLoad());
    }
  };

  const handleSelectImages = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      const newImages = pickerResult.assets.map((asset) => asset.uri);
      setSelectedImages([...selectedImages, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleBack} />
        <Appbar.Content title="Tạo bài viết" />
        <Appbar.Action icon="check" onPress={handlePost} />
      </Appbar.Header>
      <ScrollView style={styles.content}>
        <View style={styles.userInfo}>
          <Image
            source={{
              uri: "https://res.cloudinary.com/dzcj0i6fy/image/upload/v1728622624/lrdezqrx3bgcygdyr8to.png",
            }}
            style={styles.avatar}
          />
          <View style={{ flexDirection: "column" }}>
            <Text style={{ fontWeight: "700", fontSize: 16 }}>Sang Nguyễn</Text>
          </View>
        </View>
        <TextInput
          placeholder="Bạn đang nghĩ gì?"
          value={postText}
          onChangeText={setPostText}
          multiline
          style={styles.input}
        />
        {selectedImages.length > 0 && (
          <View style={styles.imageContainer}>
            {selectedImages.map((image, index) => (
              <View key={index} style={styles.imageWrapper}>
                <View style={styles.imageSelectedContainer}>
                  <Image source={{ uri: image }} style={styles.selectedImage} />
                </View>
                <Button onPress={() => removeImage(index)}>Xóa</Button>
              </View>
            ))}
          </View>
        )}
        <List.Section>
          <List.Item
            title="Ảnh/video"
            left={(props) => <List.Icon {...props} icon="image" />}
            onPress={handleSelectImages}
          />
          <List.Item
            title="Gắn thẻ người khác"
            left={(props) => <List.Icon {...props} icon="account-multiple" />}
          />
        </List.Section>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  input: {
    backgroundColor: "transparent",
    marginBottom: 16,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  imageSelectedContainer: {
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  imageWrapper: {
    margin: 4,
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
});

export default CreatePostScreen;
