import { StyleSheet, Platform, PermissionsAndroid, Button } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { NativeModulesProxy } from "expo-modules-core";
import * as Permissions from "expo-permissions";
import { LocationObject, LocationSubscription } from "expo-location";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

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
//     let status = await Location.requestBackgroundPermissionsAsync();
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

export interface LatLonTimeSpeed {
  latitude: number;
  longitude: number;
  timestamp: number;
  speed: number | null;
  accuracy?: number | null;
}

export default function useLocation() {
  // locationUpdatedHandler: (location: LatLonTimeSpeed) => Promise<void>
  const [permission, setPermission] = useState(false);
  const [allowed, setAllowed] = useState(false);

  // const [status, requestPermission] = Location.useBackgroundPermissions();
  const locationSubscription = useRef<LocationSubscription | null>(null);
  const [location, setLocation] = useState<LatLonTimeSpeed>({
    latitude: 0,
    longitude: 0,
    timestamp: 0,
    speed: 0,
  });

  const disable = () => {
    setAllowed(false);
  };
  const enable = async () => {
    if (!permission) {
      await requestLocationPermission();
    } else {
      setAllowed(true);
    }
  };

  const checkIfAlreadyHavePermissions = async () => {
    const { status: existingStatus } =
      await Location.getBackgroundPermissionsAsync();
    if (existingStatus === "granted") {
      setPermission(true);
    } else {
      setPermission(false);
    }
  };

  // const requestPermission = async () => {
  //   return await requestLocationPermission["ios"]();
  // };

  useEffect(() => {
    if (permission) {
      enable();
      // Location.startLocationUpdatesAsync("LOCATION_UPDATE", {
      //   deferredUpdatesDistance: 10,
      // }).then(() => {
      //   console.log("Location updates started");
      // });
      Location.watchPositionAsync(
        { distanceInterval: 1 },
        (locationObj: LocationObject) => {
          setLocation({
            latitude: locationObj.coords.latitude,
            longitude: locationObj.coords.longitude,
            timestamp: locationObj.timestamp,
            speed: locationObj.coords.speed,
            accuracy: locationObj.coords.accuracy,
          });
        }
      ).then((subscription: LocationSubscription) => {
        locationSubscription.current = subscription;
      });
    } else {
      disable();
    }
  }, [permission]);

  // useEffect(() => {
  //   if (locationUpdatedHandler) {
  //     locationUpdatedHandler(location);
  //   }
  // }, [location]);

  useEffect(() => {
    checkIfAlreadyHavePermissions();

    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  const requestLocationPermission = async () => {
    try {
      let response = await Location.requestForegroundPermissionsAsync();
      if (response.granted) {
        setPermission(true);
      } else {
        setPermission(false);
      }
    } catch (err) {
      setPermission(false);
    }
  };

  return {
    requestPermission: requestLocationPermission,
    permission,
    location,
    disable,
    enable,
    allowed,
  };
}
