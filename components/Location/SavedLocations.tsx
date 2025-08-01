import { LocationList } from "@/types/locationTypes";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface SavedLocationsProps {
  savedLocationsList: LocationList[];
}

const SavedLocations: React.FC<SavedLocationsProps> = ({
  savedLocationsList,
}) => {
  const router = useRouter();

  return (
    <React.Fragment>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
          <Ionicons name="arrow-back" size={20} color="#1F2937" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Saved Locations</Text>
      </View>
      <View style={styles.container}>
        {savedLocationsList?.map((loc, index) => (
          <View
            key={loc.id}
            style={[
              styles.item,
              {
                borderBottomWidth:
                  index < savedLocationsList.length - 1 ? 1 : 0,
                borderBottomColor: "#F3F4F6",
              },
            ]}
          >
            <Text style={styles.businessName}>{loc.title}</Text>
            <Text style={styles.address}>{loc.address}</Text>
          </View>
        ))}
      </View>
    </React.Fragment>
  );
};

export default SavedLocations;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginBottom: 20,
  },
  backIcon: {
    position: "absolute",
    left: 0,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  container: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    borderColor: "#F3F4F6",
    borderWidth: 1,
    maxHeight: SCREEN_HEIGHT * 0.5,
    marginBottom: 30,
  },
  item: {
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  businessName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  address: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
});
