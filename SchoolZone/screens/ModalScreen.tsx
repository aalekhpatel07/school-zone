import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";

export default function ModalScreen() {
  return (
    <View style={styles.outer}>
      <Text style={styles.title}>Avoid heavy penalties.</Text>
      <Text style={styles.subtitle}>Slow down around a school zone.</Text>
      <Text style={styles.body}>
        SchoolZone notifies you when you're close to an officially designated
        school zone.
      </Text>
      <Text style={{ marginTop: 64, fontSize: 18, lineHeight: 24 }}>
        <Text style={{ fontWeight: "bold" }}>Note </Text>: Currently, only
        school zones from Winnipeg, Manitoba, Canada are supported. If you'd
        like support for other areas, please let us know!
      </Text>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    paddingHorizontal: 24,
    paddingTop: 66,
    lineHeight: 36,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
