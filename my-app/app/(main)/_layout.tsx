import { Stack } from "expo-router";

export default function AuthStack() {
  return (
    <Stack>
      <Stack.Screen name="chat" options={{ title: "Nhắn tin" }} />
      <Stack.Screen name="comment" />
      <Stack.Screen
        name="court-details"
        options={{ title: "Đặt lịch theo ngày" }}
      />
      <Stack.Screen name="list-conversation" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ title: "Setting" }} />
      <Stack.Screen name="payment" options={{ title: "Thanh toán" }} />
      <Stack.Screen name="payment-detail" options={{ title: "Thanh toán" }} />
      <Stack.Screen name="create-post" options={{ headerShown: false }} />
    </Stack>
  );
}
