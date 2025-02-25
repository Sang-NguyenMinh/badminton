// import { useState, useEffect, useRef } from 'react';
// import * as Notifications from 'expo-notifications';
// import * as Device from 'expo-device';
// import { Platform } from 'react-native';

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });

// interface PushNotificationState {
//   expoPushToken?: Notifications.ExpoPushToken;
//   notification?: Notifications.Notification;
// }

// export const usePushNotifications = (): PushNotificationState => {
//   const [expoPushToken, setExpoPushToken] = useState<Notifications.ExpoPushToken>();
//   const [notification, setNotification] = useState<Notifications.Notification>();
//   const notificationListener = useRef<Notifications.Subscription>();
//   const responseListener = useRef<Notifications.Subscription>();

//   useEffect(() => {
//     registerForPushNotificationsAsync().then(token => {setExpoPushToken(token)
//       console.log(token)
//     });

//     notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
//       setNotification(notification);
//     });

//     responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
//       console.log(response);
//     });

//     return () => {
//       Notifications.removeNotificationSubscription(notificationListener.current!);
//       Notifications.removeNotificationSubscription(responseListener.current!);
//     };
//   }, []);

//   return { expoPushToken, notification };
// };

// async function registerForPushNotificationsAsync(): Promise<Notifications.ExpoPushToken | undefined> {
//   let token;

//   if (Device.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== 'granted') {
//       alert('Failed to get push token for push notification!');
//       return;
//     }
//     token = await Notifications.getExpoPushTokenAsync({
//       projectId: '826ab9f0-870f-444c-a30b-bf24961b10ed',
//     });
//   } else {
//     alert('Must use physical device for Push Notifications');
//   }

//   if (Platform.OS === 'android') {
//     Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }

//   return token;
// }
