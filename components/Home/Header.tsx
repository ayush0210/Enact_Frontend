import { screenWidth } from "@/constants/ScreenDimensions";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Header = () => {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={["#3B82F6", "#8B5CF6"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.75, y: 0.75 }}
      style={[styles.wrapper, { paddingTop: insets.top + 5 }]}
    >
      <View style={styles.topRow}>
        <View>
          <Text style={styles.title}>ENACT</Text>
          <Text style={styles.subtitle}>Your trusted Parenting Companion</Text>
        </View>

        <Link href={"/(location)/location?tab=saved"}>
          <View style={styles.saveIcon}>
            <Ionicons name="bookmark" size={22} color={"#3B82F6"} />
          </View>
        </Link>
      </View>

      <View style={{ marginTop: 20 }}>
        <Link href={"/(location)/location?tab=search"}>
          <View style={styles.searchBar}>
            <Ionicons
              name="location-outline"
              size={20}
              color="#4A90E2"
              style={styles.searchIcon}
            />
            <Text style={styles.input}>Find nearby locations...</Text>
          </View>
        </Link>
      </View>
    </LinearGradient>
  );
};

export default Header;

const styles = StyleSheet.create({
  wrapper: {
    height: 230,
    borderRadius: 30,
    paddingHorizontal: 0.05 * screenWidth,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#DBEAFE",
    fontSize: 14,
    marginTop: 4,
  },
  saveIcon: {
    width: 45,
    height: 45,
    backgroundColor: "#F5F3FF",
    opacity: 100,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 30,
    alignItems: "center",
    paddingHorizontal: 15,
    height: 45,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#6B7280",
  },
});
