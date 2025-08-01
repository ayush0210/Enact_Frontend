import {
  fetchSuggestions,
  getLocationCoordinates,
} from "@/controllers/locationController";
import { LocationCoordinates, LocationDetails } from "@/types/locationTypes";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { debounce } from "lodash";
import React, { RefObject, useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView from "react-native-maps";
import Toast from "react-native-toast-message";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface SearchLocationProps {
  setSelectedLocation: (_arg0: LocationCoordinates) => void;
  selectedLocation: LocationCoordinates | null;
  setMarkerLocation: (_arg0: LocationCoordinates) => void;
  mapRef: RefObject<MapView | null>;
}

const SearchLocation: React.FC<SearchLocationProps> = ({
  setSelectedLocation,
  selectedLocation,
  setMarkerLocation,
  mapRef,
}) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationDetails[]>([]);

  const searchLocation = useCallback(
    debounce(async (input: string) => {
      if (input.trim().length >= 3) {
        const results: LocationDetails[] = await fetchSuggestions(input);
        setSuggestions(results);
      } else {
        setSuggestions([]);
      }
    }, 300),
    []
  );

  useEffect(() => {
    searchLocation(query);
  }, [query]);

  const handleSuggestionPress = async (suggestion: LocationDetails) => {
    const { latitude, longitude }: LocationCoordinates =
      await getLocationCoordinates(suggestion.place_id);

    if (!latitude || !longitude) {
      Toast.show({
        type: "error",
        text1: "Internal server error. Please try again after some time",
      });
      return;
    }

    setSelectedLocation({ latitude, longitude });
    setMarkerLocation({
      latitude: latitude!,
      longitude: longitude!,
    });

    setQuery(`${suggestion.streetAddress}, ${suggestion.city}`);
    setSuggestions([]);

    mapRef.current?.animateToRegion({
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  return (
    <React.Fragment>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
          <Ionicons name="arrow-back" size={20} color="#1F2937" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Find nearby Locations</Text>
      </View>
      {/* Search */}
      <View style={styles.searchBar}>
        <Ionicons
          name="location-outline"
          size={20}
          color="#4A90E2"
          style={{ marginRight: 10 }}
        />
        <TextInput
          style={styles.input}
          placeholder="Find nearby locations..."
          placeholderTextColor="#6B7280"
          value={query}
          onChangeText={setQuery}
          editable={!selectedLocation}
          autoFocus={true}
        />
      </View>

      {/* Suggestions - Only show when not selected */}
      {suggestions.length > 0 && (
        <View style={styles.suggestionContainer}>
          {suggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={suggestion.place_id}
              style={[
                styles.suggestionItem,
                {
                  borderBottomWidth: index < suggestions.length - 1 ? 1 : 0,
                  borderBottomColor: "#F3F4F6",
                },
              ]}
              onPress={() => handleSuggestionPress(suggestion)}
            >
              <Text style={styles.businessName}>{suggestion.businessName}</Text>
              <Text style={styles.address}>
                {suggestion.streetAddress}, {suggestion.city}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </React.Fragment>
  );
};

export default SearchLocation;

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
  searchBar: {
    flexDirection: "row",
    borderRadius: 30,
    alignItems: "center",
    paddingHorizontal: 15,
    height: 45,
    shadowColor: "#000",
    backgroundColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  suggestionContainer: {
    marginTop: 20,
    backgroundColor: "#FFF",
    borderRadius: 15,
    borderColor: "#F3F4F6",
    borderWidth: 1,
    maxHeight: SCREEN_HEIGHT * 0.5,
  },
  suggestionItem: {
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
