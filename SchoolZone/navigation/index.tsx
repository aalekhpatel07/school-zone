/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { ColorSchemeName, Pressable } from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import ModalScreen from "../screens/ModalScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
// import {
//   RootStackParamList,
//   RootTabParamList,
//   RootTabScreenProps,
// } from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import useNotifications from "../hooks/useNotifications";
import useLocation from "../hooks/useLocation";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<any>();

function RootNavigator() {
  // const {
  //   requestPermission: requestNotificationPermission,
  //   sendPushNotification,
  //   notification,
  //   permission: notificationPermission,
  // } = useNotifications();

  // // const handleLocationUpdated = async (location: unknown) => {
  // //   console.log("updated to: ", location);
  // // };

  // const {
  //   requestPermission: requestLocationPermission,
  //   permission: locationPermission,
  //   location,
  // } = useLocation();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="Info" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<any>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  const locationHandle = useLocation();
  const notificationsHandle = useNotifications();

  const [searchRadius, setSearchRadius] = React.useState<number>(200);

  // const {
  //   permission: notificationPermission,
  //   notification,
  //   requestPermission: requestNotificationPermission,
  //   sendPushNotification,
  // } = useNotifications();

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}
    >
      <BottomTab.Screen
        name="Home"
        children={({ navigation, route }) => (
          <HomeScreen
            navigation={navigation}
            route={route}
            locationHandle={locationHandle}
            notificationsHandle={notificationsHandle}
            searchRadius={searchRadius}
          />
        )}
        options={({ navigation, route }) => ({
          title: "School Zone",
          tabBarIcon: ({ color }) => <TabBarIcon name="map" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate("Info")}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <FontAwesome
                name="info-circle"
                size={25}
                color={Colors[colorScheme].text}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      />
      <BottomTab.Screen
        name="Settings"
        children={({ navigation, route }) => (
          <SettingsScreen
            navigation={navigation}
            route={route}
            notificationHandle={notificationsHandle}
            locationHandle={locationHandle}
            searchRadius={searchRadius}
            setSearchRadius={setSearchRadius}
          />
        )}
        // children={({ navigation, route, ...rest}) => <SettingsScreen navigation={navigation} route={route} {...rest}/>}
        // component={TabTwoScreen}
        // children={() => <SettingsScreen />}
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <TabBarIcon name="gear" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
