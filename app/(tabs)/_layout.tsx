import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useContext, useEffect } from "react";
import { View } from "react-native";

import TabBar from "@/components/ui/TabBar";
import {
  LocationContext,
  LocationContextType,
} from "@/context/LocationContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomeScreen from "./index";
import SettingsScreen from "./settings";

type MainTabParamList = {
  Home: undefined;
  Settings: undefined;
};

const MainTab = createBottomTabNavigator<MainTabParamList>();

export default function TabLayout() {
  const { fetchLocations } = useContext<LocationContextType>(LocationContext);

  useEffect(() => {
    const loadLocations = async () => {
      const savedLocationsString = await AsyncStorage.getItem("savedLocations");

      if (!savedLocationsString) {
        await fetchLocations();
      }
    };

    loadLocations();
  }, []);

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
