import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import AuthProvider from "@/context/AuthContext";
import LocationProvider from "@/context/LocationContext";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, useColorScheme } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <AuthProvider>
      <LocationProvider>
        <LinearGradient
          colors={["#EFF6FF", "#FFFFFF", "#F5F3FF"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.fill}
        >
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <Slot />
            {/* Make every screen’s background transparent
            so the gradient can shine through */}
            {/* <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "transparent" },
            animation: "none",
          }}
        >
          <Stack.Screen name="(authentication)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(location)" />
          <Stack.Screen name="+not-found" />
        </Stack> */}

            <StatusBar style="auto" />
          </ThemeProvider>
        </LinearGradient>
      </LocationProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
