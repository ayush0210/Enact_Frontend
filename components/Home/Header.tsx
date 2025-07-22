import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SearchInputField from "../ui/SearchInputField";

const screenWidth = Dimensions.get("window").width;

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

        <TouchableOpacity style={styles.saveIcon}>
          <MaterialIcons name="bookmark" size={24} color={"#3B82F6"} />
        </TouchableOpacity>
      </View>

      <SearchInputField
        materialIconName="add-location-alt"
        placeholder="Find nearby locations..."
        backgroundColor="#FFF"
        marginTop={20}
      />
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
    marginTop: 20,
    height: 45,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
});
