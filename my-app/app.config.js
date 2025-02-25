export default {
  expo: {
    name: "my-app",
    slug: "my-app",
    version: "1.0.0",
    orientation: "portrait",
    // "icon": "./assets/images/icon.png",
    scheme: "my-app",
    userInterfaceStyle: "automatic",
    splash: {
      // "image": "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.yourcompany.myapp",
      buildNumber: "1.0.0",
      infoPlist: {
        UIBackgroundModes: ["remote-notification"],
        NSCameraUsageDescription: "This app uses the camera to scan QR codes.",
        NSMicrophoneUsageDescription:
          "This app uses the microphone for voice messages.",
        NSPhotoLibraryAddUsageDescription:
          "This app needs access to save photos.",
        NSPhotoLibraryUsageDescription: "This app needs access to your photos.",
        NSUserTrackingUsageDescription:
          "This identifier will be used to deliver personalized content to you.",
      },
    },
    android: {
      permissions: [
        "INTERNET",
        "CAMERA",
        "RECORD_AUDIO",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "NOTIFICATIONS",
      ],
      useNextNotificationsApi: true,
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.yourcompany.myapp",
      versionCode: 1,
      permissions: [
        "CAMERA",
        "RECORD_AUDIO",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "NOTIFICATIONS",
      ],
    },
    web: {
      bundler: "metro",
      output: "static",
      // "favicon": "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-notifications",
        {
          color: "#ffffff",
          sounds: "default",
        },
      ],
    ],
    notification: {
      // icon: "./assets/iamges/cash.png",
      color: "#ffffff",
      iosDisplayInForeground: true,
      androidMode: "default",
      androidCollapsedTitle: "#{unread_notifications} new notifications",
    },
    experiments: {
      typedRoutes: true,
    },
    extra: {
      rootApiUrl: process.env.EXPO_PUBLIC_ROOT_API_URL,
      apiUrl: process.env.EXPO_PUBLIC_API_URL,

      eas: {
        projectId: "43dbf2b2-61ff-4b19-8e64-d5ca2ea18f38",
      },
    },
  },
};
