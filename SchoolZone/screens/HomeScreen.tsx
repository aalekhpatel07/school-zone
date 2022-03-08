import {
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Button,
  ScrollViewBase,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";

import useNotifications from "../hooks/useNotifications";
import useLocation from "../hooks/useLocation";
import type { LatLonTimeSpeed } from "../hooks/useLocation";

import { Text, View } from "../components/Themed";
// import { RootTabScreenProps } from "../types";
// import { RootTabScreenProps } from "../types";
// import { NativeModulesProxy } from "expo-modules-core";
// import * as Permissions from "expo-permissions";

// import * as Notifications from "expo-notifications";
// import * as Device from "expo-device";

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: true,
//   }),
// });

// let Location = NativeModulesProxy.ExpoLocation;

// const requestLocationPermission = {
//   android: async () => {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         {
//           title: "School Zone Location Permission",
//           message:
//             "School Zone needs access to your location to notify you whenever you're near a school zone.",
//           // buttonNeutral: "Ask Me Later",
//           buttonNegative: "Cancel",
//           buttonPositive: "OK",
//         }
//       );
//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         console.log("You can use the location.");
//         return true;
//       } else {
//         console.log("Location permission denied");
//         return false;
//       }
//     } catch (err) {
//       console.warn(err);
//       return false;
//     }
//   },
//   ios: async () => {
//     let status = await Location.requestForegroundPermissionsAsync();
//     console.log(status);

//     if (status.status !== "granted") {
//       console.log("Location permission not granted");
//       return false;
//     }
//     return true;
//   },
// };

// const getLocation = {
//   android: async (): Promise<LatLonTimeSpeed> => {
//     return Promise.resolve({
//       latitude: 0,
//       longitude: 0,
//       timestamp: 0,
//       speed: 0,
//     });
//   },
//   ios: async (): Promise<LatLonTimeSpeed> => {
//     let location = await Location.getCurrentPositionAsync({});
//     return {
//       latitude: location.coords.latitude,
//       longitude: location.coords.longitude,
//       timestamp: location.timestamp,
//       speed: location.coords.speed,
//     };
//   },
//   web: async () => {
//     let geolocation = window.navigator.geolocation;
//     return geolocation.getCurrentPosition((geoPosition) => {
//       return Promise.resolve({
//         latitude: geoPosition.coords.latitude,
//         longitude: geoPosition.coords.longitude,
//         timestamp: geoPosition.timestamp,
//         speed: geoPosition.coords.speed,
//       });
//     });
//   },
// };

// const notify = {
//   android: async () => {},
//   ios: async () => {},
// };

// async function sendPushNotification(
//   expoToken: string,
//   title: string,
//   body: string,
//   data: any = undefined
// ) {
//   const message = {
//     to: expoToken,
//     sound: "default",
//     title,
//     body,
//     data,
//   };
//   try {
//     let resp = await fetch("https://exp.host/--/api/v2/push/send", {
//       method: "POST",
//       headers: {
//         Accept: "application/json",
//         "Accept-encoding": "gzip, deflate",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(message),
//     });
//     console.log(await resp.json());
//   } catch (err) {
//     console.log("here");
//   }
// }

// import { requestNotifications } from "react-native-permissions";
// interface LatLonTimeSpeed {
//   latitude: number;
//   longitude: number;
//   timestamp: number;
//   speed: number;
// }

interface SchoolZone {
  school: string;
  ID: number;
  speedLimit: number;
  legislationLink: String;
  distance: number;
}

// function handleLocation(location: LatLonTimeSpeed) {
//   console.log(location);
// }

// const registerForPushNotificationsAsync = async () => {
//   if (Device.isDevice) {
//     const { status: existingStatus } =
//       await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== "granted") {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== "granted") {
//       alert("Failed to get push token for push notification!");
//       return;
//     }
//     // const token = (await Notifications.getExpoPushTokenAsync()).data;
//   }

//   if (Platform.OS === "android") {
//     Notifications.setNotificationChannelAsync("default", {
//       name: "default",
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: "#FF231F7C",
//     });
//   }
// };

const metersPerSecondToKilometersPerHour = (mps: number) => {
  return mps * 3.6;
};

async function getSchoolZone<M extends SchoolZone>(
  latitude: number,
  longitude: number,
  radiusInKm: number
): Promise<M> {
  const url = `https://school-zone-api.aalekhpatel.com?latitude=${latitude}&longitude=${longitude}&radiusInKm=${radiusInKm}`;
  const response = await fetch(url);
  const data = await response.json();
  return data as M;
}

// const getSchoolZone = async (latitude: number, longitude: number, radiusInKm: number = 0.2): => {
// }

export default function HomeScreen({
  navigation,
  route,
  notificationsHandle,
  locationHandle,
  searchRadius,
}: any) {
  const [schoolZone, setSchoolZone] = useState<SchoolZone | null>(null);
  // const [speed, setSpeed] = useDer
  const [speed, setSpeed] = useState(0);
  const [distanceInMeters, setDistanceInMeters] = useState(0);
  const SCHOOL_ZONE_DEFAULT_SPEED_LIMIT = 30.0;
  const [isSafeSpeed, setIsSafeSpeed] = useState(true);

  const {
    permission: locationPermission,
    location,
    requestPermission: requestLocationPermission,
    disable: disableLocation,
    enable: enableLocation,
    allowed: locationAllowed,
  } = locationHandle;

  const {
    // notifications,
    permission: notificationPermission,
    requestPermission: requestNotificationPermission,
    disable: disableNotification,
    enable: enableNotification,
    allowed: notificationAllowed,
    sendPushNotification,
  } = notificationsHandle;

  const updateSchoolZone = async () => {
    getSchoolZone(
      location.latitude,
      location.longitude,
      searchRadius / 1000
    ).then((data) => {
      setSchoolZone(data);
      setSpeed(metersPerSecondToKilometersPerHour(location.speed));
      if (!data) return;
      setDistanceInMeters(Math.round((data.distance * 1000) / 10) * 10);
      console.log("school-zone: ", data);
    });
  };

  useEffect(() => {
    if (locationPermission && locationAllowed) {
      updateSchoolZone();
    } else {
      setSchoolZone(null);
      console.log("Not allowed.");
    }
  }, [location]);

  useEffect(() => {
    if (locationPermission && locationAllowed) updateSchoolZone();
  }, [searchRadius]);

  useEffect(() => {
    const schoolZoneSpeedLimit =
      schoolZone?.speedLimit || SCHOOL_ZONE_DEFAULT_SPEED_LIMIT;
    setIsSafeSpeed(speed <= schoolZoneSpeedLimit);
  }, [speed]);

  useEffect(() => {
    if (!notificationPermission || !notificationAllowed) return;
    if (!isSafeSpeed)
      sendSpeedNotification(
        speed,
        schoolZone?.speedLimit || SCHOOL_ZONE_DEFAULT_SPEED_LIMIT
      ).then(() => {
        console.log("Notification sent.", speed);
      });
    // } else {
    //   sendSpeedNotification(location.speed, schoolZone?.speedLimit || 30).then(
    //     () => console.log("sent notification.")
    //   );
    // }
  }, [isSafeSpeed]);

  const handleLocationPermissionRejected = () => {};

  const sendSpeedNotification = async (
    currentSpeedKmh: number,
    speedLimitKmh: number | null
  ) => {
    // const currentSpeedKmh = metersPerSecondToKilometersPerHour(currentSpeedMps);
    speedLimitKmh = speedLimitKmh || SCHOOL_ZONE_DEFAULT_SPEED_LIMIT;

    // // Avoid sending notifications if speed is below the speed limit.
    // if (currentSpeedKmh < speedLimitKmh) {
    //   return;
    // }

    const title = `Slow down, school zone ${
      schoolZone && schoolZone.distance
        ? `in ${(Math.round(schoolZone.distance * 100) * 10).toFixed(0)} meters`
        : "nearby."
    }`;
    const body = `You're going ${currentSpeedKmh.toFixed(0)} km/h in a ${
      speedLimitKmh ? `${speedLimitKmh.toFixed(0)} km/h` : "school"
    } zone.`;

    await sendPushNotification(title, body, {
      currentSpeedKmh,
      speedLimitKmh,
      schoolZone,
      location,
    });
  };

  const LocationAvailableScreen = () => {
    return (
      <View
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <View
          style={{
            backgroundColor: "#136f63",
            flex: 1,
            alignItems: "center",
          }}
        >
          <View style={{ ...styles.distancePanel }}>
            <Text style={{ fontSize: 24, ...styles.text }}>
              {schoolZone && schoolZone.school}
            </Text>
            <Text style={{ ...styles.distanceText, ...styles.text }}>
              {distanceInMeters.toFixed(0)}
              <Text style={{ fontSize: 32, ...styles.text }}>m</Text>
            </Text>
          </View>
          <View style={styles.speedLimitPanel}>
            <Text
              style={{
                fontVariant: ["small-caps"],
                fontSize: 24,
                fontWeight: "bold",
                marginTop: 8,
                ...styles.text,
              }}
            >
              Speed Limit
            </Text>
            <View
              style={{
                backgroundColor: "transparent",
                width: "100%",
                alignItems: "center",
                padding: 8,
                paddingBottom: 0,
                ...styles.text,
              }}
            >
              <Text style={styles.speedLimitText}>
                {schoolZone && schoolZone.speedLimit}
                <Text
                  style={{
                    fontSize: 32,
                    ...styles.text,
                  }}
                >
                  km/h
                </Text>
              </Text>
            </View>
          </View>
          <View style={{ ...styles.speedLimitPanel, padding: 0 }}>
            <Text
              style={{
                fontVariant: ["small-caps"],
                fontSize: 24,
                fontWeight: "bold",
                marginTop: 0,
                backgroundColor: "transparent",
                ...styles.text,
              }}
            >
              Current Speed (km/h)
            </Text>
          </View>
          <View
            style={{
              ...styles.speedIndicator,
              marginTop: 24,
              ...styles.text,
              backgroundColor: isSafeSpeed ? "#8ed081" : "#ea7a0b",
              ...styles.shadow,
            }}
          >
            <Text style={{ ...styles.speedIndicatorText, ...styles.text }}>
              {speed.toFixed(0)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const NoSchoolZoneFoundScreen = () => {
    return (
      <View>
        <Text>No school zone found.</Text>
      </View>
    );
  };

  const LocationUnAvailableScreen = () => {
    return (
      <View>
        <Text>Location unavailable.</Text>
      </View>
    );
  };

  return (
    <View>
      {locationAllowed && locationPermission && schoolZone
        ? LocationAvailableScreen()
        : locationAllowed && locationPermission
        ? NoSchoolZoneFoundScreen()
        : LocationUnAvailableScreen()}
      {/* <View
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <View
          style={{
            backgroundColor: "#136f63",
            flex: 1,
            alignItems: "center",
          }}
        >
          <View style={{ ...styles.distancePanel }}>
            <Text style={{ fontSize: 24, ...styles.text }}>
              {schoolZone && schoolZone.school}
            </Text>
            <Text style={{ ...styles.distanceText, ...styles.text }}>
              {distanceInMeters.toFixed(0)}
              <Text style={{ fontSize: 32, ...styles.text }}>m</Text>
            </Text>
          </View>
          <View style={styles.speedLimitPanel}>
            <Text
              style={{
                fontVariant: ["small-caps"],
                fontSize: 24,
                fontWeight: "bold",
                marginTop: 8,
                ...styles.text,
              }}
            >
              Speed Limit
            </Text>
            <View
              style={{
                backgroundColor: "transparent",
                width: "100%",
                alignItems: "center",
                padding: 8,
                paddingBottom: 0,
                ...styles.text,
              }}
            >
              <Text style={styles.speedLimitText}>
                {schoolZone && schoolZone.speedLimit}
                <Text
                  style={{
                    fontSize: 32,
                    ...styles.text,
                  }}
                >
                  km/h
                </Text>
              </Text>
            </View>
          </View>
          <View style={{ ...styles.speedLimitPanel, padding: 0 }}>
            <Text
              style={{
                fontVariant: ["small-caps"],
                fontSize: 24,
                fontWeight: "bold",
                marginTop: 0,
                backgroundColor: "transparent",
                ...styles.text,
              }}
            >
              Current Speed (km/h)
            </Text>
          </View>
          <View
            style={{
              ...styles.speedIndicator,
              marginTop: 24,
              ...styles.text,
            }}
          >
            <Text style={{ ...styles.speedIndicatorText, ...styles.text }}>
              {speed.toFixed(0)}
            </Text>
          </View>
        </View>
      </View> */}
      {/* {!!schoolZone && <Text>School: {JSON.stringify(schoolZone)}</Text>}
      {!schoolZone && (
        <Text>Not School, location: {JSON.stringify(location)}</Text>
      )} */}
      {/* <Button
        onPress={requestLocationPermission}
        title="Get Location"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      /> */}
      {/* <Text> Location allowed: {JSON.stringify(locationAllowed)} </Text>
      <Text> Notification allowed: {JSON.stringify(notificationAllowed)} </Text>
      <Button
        onPress={() =>
          sendSpeedNotification(
            location.speed,
            schoolZone && schoolZone["speedLimit"]
          )
        }
        title="Send Notification"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      /> */}
      {/* <Text>Latitude: {location.latitude}</Text>
      <Text>Longitude: {location.longitude}</Text>
      <Text>Time stamp: {location.timestamp}</Text>
      <Text>Speed: {location.speed}</Text>
      <Text>School Zone: {JSON.stringify(schoolZone)}</Text>
      <Button
        onPress={requestLocationPermission}
        title="Get Location"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
      <Text>
        Notification permission: {JSON.stringify(notificationPermission)}
      </Text>
      <Text>Location permission: {JSON.stringify(locationPermission)}</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  speedIndicator: {
    width: 300,
    height: 300,
    borderRadius: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  speedIndicatorText: {
    fontSize: 150,
  },

  distancePanel: {
    width: "100%",
    padding: 20,
    backgroundColor: "#228cdb",
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowColor: "rgba(0, 0, 0, 0.7)",
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 6,
    color: "white",
  },
  distanceText: {
    fontSize: 50,
    color: "white",
  },

  speedLimitPanel: {
    width: "100%",
    padding: 20,
    backgroundColor: "transparent",
    alignItems: "center",
    color: "white",
  },
  speedLimitText: {
    fontSize: 64,
    color: "white",
  },
  text: {
    color: "white",
  },

  shadow: {
    shadowOffset: { width: 0, height: 4 },
    shadowColor: "rgba(0, 0, 0, 0.7)",
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 6,
  },
});
