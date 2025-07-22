import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const TabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <View style={styles.wrapper}>
      <View
        style={[styles.container, state.index === 1 && styles.opaqueBackground]}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel?.toString() ??
            options.title?.toString() ??
            route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableWithoutFeedback key={route.key} onPress={onPress}>
              <View
                style={[styles.tabButton, isFocused && styles.activeTabButton]}
              >
                <Text
                  style={[styles.tabText, isFocused && styles.activeTabText]}
                >
                  {label}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          );
        })}
      </View>
    </View>
  );
};

export default TabBar;

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 34 : 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  container: {
    flexDirection: "row",
    backgroundColor: "#fff", // semi-transparent white
    borderRadius: 30,
    padding: 10,
    width: "90%",
    justifyContent: "space-between",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTabButton: {
    backgroundColor: "#F9FAFB", // light grey for selected tab background
  },
  tabText: {
    color: "#6B7280",
    fontWeight: "400",
  },
  activeTabText: {
    color: "#1F2937",
    fontWeight: "700",
  },
  opaqueBackground: {
    backgroundColor: "#fff", // fully opaque white
  },
});
