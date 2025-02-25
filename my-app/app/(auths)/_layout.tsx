import { Stack, Tabs } from "expo-router";

export default function AuthStack() {
  return (
    <Stack>
      <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="opt" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
    </Stack>
  );
}
