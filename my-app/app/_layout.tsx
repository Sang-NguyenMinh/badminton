import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Fragment, useEffect, useState } from "react";
import "react-native-reanimated";
import { Provider } from "react-redux";
import { store } from "@/core/redux/store";
import * as Notifications from "expo-notifications";
import { getDataSecure } from "@/core/libs/storage";
import * as Device from "expo-device";
import { Platform } from "react-native";

SplashScreen.preventAutoHideAsync();

function AuthenticatedApp() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { useRouter, useSegments } = require("expo-router");
  const { useAppDispatch } = require("@/core/redux/hooks");
  const { meActions } = require("@/core/redux/meSlice");

  const router = useRouter();
  const segments = useSegments();
  const dispatch = useAppDispatch();

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      let token = await getDataSecure("token");
      setIsAuthenticated(!!token);
      if (token) {
        dispatch(meActions.getProfile());
      }
    } catch (error) {
      console.error("Error checking token:", error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auths)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auths)/login");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auths)" options={{ headerShown: false }} />
      <Stack.Screen name="(main)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" options={{ title: "Oops!" }} />
    </Stack>
  );
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync(): Promise<
  string | undefined
> {
  let token: string | undefined;

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: "43dbf2b2-61ff-4b19-8e64-d5ca2ea18f38",
      })
    ).data;
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

function setNotificationListeners(
  handleNotification: (notification: Notifications.Notification) => void,
  handleNotificationResponse: (
    response: Notifications.NotificationResponse
  ) => void
) {
  const notificationListener =
    Notifications.addNotificationReceivedListener(handleNotification);
  const responseListener =
    Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse
    );

  return () => {
    Notifications.removeNotificationSubscription(notificationListener);
    Notifications.removeNotificationSubscription(responseListener);
  };
}

function NotificationsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => console.log(token));
  }, []);
  useEffect(() => {
    const subscription = setNotificationListeners(
      (notification) => {
        console.log("Notification received:", notification);
      },
      (response) => {
        console.log("Notification response:", response);
      }
    );

    return () => subscription();
  }, []);

  return <Fragment>{children}</Fragment>;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ThemeProvider value={DefaultTheme}>
        <NotificationsProvider>
          <AuthenticatedApp />
        </NotificationsProvider>
      </ThemeProvider>
    </Provider>
  );
}
