import Account from "@/components/Settings/Account";
import App from "@/components/Settings/App";
import Tips from "@/components/Settings/Tips";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { screenWidth } from "@/constants/ScreenDimensions";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  return (
    <GradientBackground>
      <View
        style={{
          marginTop: insets.top + 5,
          paddingHorizontal: 0.05 * screenWidth,
        }}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        <View style={styles.border} />

        <ScrollView>
          <Account />

          <App />

          <Tips />
        </ScrollView>
      </View>
    </GradientBackground>
  );
}
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  border: {
    borderBottomColor: "rgba(255, 255, 255, 0.8)",
    borderBottomWidth: 1,
    marginVertical: 20,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
});
