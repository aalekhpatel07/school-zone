import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

import { Platform } from "react-native";
import { useEffect, useRef, useState } from "react";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const registerForPushNotificationsAsync = async () => {
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
      return false;
    }
    // const token = (await Notifications.getExpoPushTokenAsync()).data;
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
  return true;
};

export default function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string>("");
  const [permission, setPermission] = useState<boolean>(false);
  const [allowed, setAllowed] = useState<boolean>(false);

  const [notification, setNotification] = useState<
    Notifications.Notification | boolean
  >(false);

  const notificationListener: any = useRef();
  const responseListener: any = useRef();

  useEffect(() => {
    if (permission) {
      setAllowed(true);
    }
  }, [permission]);

  const disable = () => {
    setAllowed(false);
  };

  const enable = () => {
    setAllowed(true);
  };

  const requestPermission = async () => {
    let approved = await registerForPushNotificationsAsync();
    if (approved) {
      setNotification(approved);
      return true;
    }
    return false;
  };

  const sendPushNotification = async (
    title: String,
    body: String,
    data: unknown
  ) => {
    if (!permission) {
      throw new Error("Notification permission not granted.");
    }
    const message = {
      to: expoPushToken,
      sound: "default",
      title,
      body,
      data,
    };
    try {
      let resp = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });
      return await resp.json();
    } catch (err) {
      return Promise.reject(err);
    }
  };

  const checkIfAlreadyHavePermissions = async () => {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    if (existingStatus === "granted") {
      setPermission(true);
    } else {
      setPermission(false);
    }
  };

  useEffect(() => {
    if (permission) {
      Notifications.getExpoPushTokenAsync().then((token) => {
        setExpoPushToken(token.data);
      });
    }
  }, [permission]);

  useEffect(() => {
    checkIfAlreadyHavePermissions();

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return {
    permission,
    requestPermission,
    sendPushNotification,
    notification,
    disable,
    enable,
    allowed,
  };
}
