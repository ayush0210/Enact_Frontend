import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import TabBar from "@/components/ui/TabBar";
import HomeScreen from "./index";
import SettingsScreen from "./settings";

type MainTabParamList = {
  Home: undefined;
  Settings: undefined;
};

const MainTab = createBottomTabNavigator<MainTabParamList>();

export default function TabLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <MainTab.Navigator
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={() => ({
          headerShown: false,
        })}
      >
        <MainTab.Screen name="Home" component={HomeScreen} />
        <MainTab.Screen name="Settings" component={SettingsScreen} />
      </MainTab.Navigator>
    </View>
  );
}
