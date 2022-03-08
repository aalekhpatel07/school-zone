import { StyleSheet, Switch } from "react-native";
import React, { useState, useEffect } from "react";
import MultiSlider from "@ptomasroos/react-native-multi-slider";

import { Text, View } from "../components/Themed";
// import { RootTabScreenProps } from "../types";

// import useNotifications from "../hooks/useNotifications";
// import useLocation from "../hooks/useLocation";

export default function SettingsScreen({
  navigation,
  route,
  locationHandle,
  notificationHandle,
  searchRadius,
  setSearchRadius,
}: any) {
  const {
    location,
    requestPermission: requestLocationPermission,
    disable: disableLocation,
    enable: enableLocation,
    allowed: locationAllowed,
  } = locationHandle;

  const {
    // notifications,
    requestPermission: requestNotificationPermission,
    disable: disableNotification,
    enable: enableNotification,
    allowed: notificationAllowed,
    sendPushNotification,
    ...rest
  } = notificationHandle;
  // const {
  //   permission: notificationPermission,
  //   requestPermission: requestNotificationPermission,
  // } = useNotifications();
  // const {
  //   permission: locationPermission,
  //   requestPermission: requestLocationPermission,
  // } = useLocation();

  // const [locationAllowed, setLocationAllowed] = useState(false);
  // const [notificationAllowed, setNotificationAllowed] = useState(false);

  const toggleNotification = async (value: boolean) => {
    if (value) {
      enableNotification();
      // setNotificationAllowed(await requestNotificationPermission());
    } else {
      disableNotification();
      // setNotificationAllowed(false);
    }
  };

  const toggleLocation = async (value: boolean) => {
    if (value) {
      enableLocation();
    } else {
      disableLocation();
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          flexDirection: "column",
          marginTop: 48,
        }}
      >
        <Text
          style={{
            ...styles.title,
            marginBottom: 24,
          }}
        >
          Permissions
        </Text>
        <View style={styles.container}>
          <Text
            style={{
              fontVariant: ["small-caps"],
              fontWeight: "bold",
            }}
          >
            Notifications
          </Text>
          <Switch
            style={{ marginLeft: 20 }}
            onValueChange={toggleNotification}
            value={notificationAllowed}
          />
        </View>
        <View style={styles.container}>
          <Text
            style={{
              fontVariant: ["small-caps"],
              fontWeight: "bold",
            }}
          >
            Location
          </Text>
          <Switch
            style={{ marginLeft: 20 }}
            onValueChange={toggleLocation}
            value={locationAllowed}
          />
        </View>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          flexDirection: "column",
          marginTop: 48,
        }}
      >
        <Text
          style={{
            ...styles.title,
            marginBottom: 24,
          }}
        >
          Parameters
        </Text>
        <View style={{ ...styles.container, flexDirection: "column" }}>
          <Text
            style={{
              fontVariant: ["small-caps"],
              fontWeight: "bold",
              fontSize: 18,
              marginBottom: 4,
            }}
          >
            Radius: {searchRadius}m
          </Text>
          <Text
            style={{
              fontWeight: "normal",
              fontStyle: "italic",
            }}
          >
            (How far in advance do you wish to be notified?)
          </Text>
          <View>
            <MultiSlider
              values={[searchRadius]}
              onValuesChange={(values) => {
                // console.log(values[0]);
                setSearchRadius(values[0]);
              }}
              min={0}
              max={501}
              // enableLabel={true}
              snapped
            />
          </View>
          {/* <Switch
            style={{ marginLeft: 20 }}
            onValueChange={toggleLocation}
            value={locationAllowed}
          /> */}
        </View>
      </View>
      <View
        style={{ flex: 2, alignItems: "center", justifyContent: "center" }}
      ></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 24,
    marginTop: 8,
    fontWeight: "normal",
  },
  body: {
    fontSize: 18,
    marginTop: 32,
    fontWeight: "normal",
    lineHeight: 24,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "75%",
  },
});
