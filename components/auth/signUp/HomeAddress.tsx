import { Button } from "@/components/ui/Button";
import { screenHeight, screenWidth } from "@/constants/ScreenDimensions";
import { AuthContext } from "@/context/AuthContext";
import {
  fetchSuggestions,
  getAddressFromCoordinates,
  getLocationCoordinates,
} from "@/controllers/locationController";
import { LocationCoordinates, LocationDetails } from "@/types/locationTypes";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { debounce } from "lodash";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Toast from "react-native-toast-message";

interface HomeAddressProps {
  step: number;
  setStep: (_arg0: number) => void;
  setLocation: (loc: { latitude: number; longitude: number }) => void;
  handleRegistration: () => void;
}

const HomeAddress: React.FC<HomeAddressProps> = ({
  step,
  setStep,
  setLocation,
  handleRegistration,
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationDetails[]>([]);
  const [markerLocation, setMarkerLocation] = useState<LocationCoordinates>({
    latitude: 29.6468986,
    longitude: -82.3381134,
  });
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>(
    undefined
  );
  const [userLocation, setUserLocation] = useState<boolean>(false); // if the user gives us permission to auto fetch the location
  const { isLoading } = useContext<any>(AuthContext);

  const mapRef = useRef<MapView>(null);

  const searchLocation = useCallback(
    debounce(async (input: string) => {
      if (input.trim().length >= 3) {
        const results = await fetchSuggestions(input);
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

    console.log(suggestion);

    if (!latitude || !longitude) {
      Toast.show({
        type: "error",
        text1: "Internal server error. Please try again after some time",
      });
      return;
    }

    setMarkerLocation({
      latitude: latitude!,
      longitude: longitude!,
    });

    setSelectedLocation(query);
    setLocation({ latitude: latitude, longitude: longitude });
    setUserLocation(true);
    setQuery(`${suggestion.businessName}, ${suggestion.city}`);
    setSuggestions([]);

    mapRef.current?.animateToRegion({
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  const getUserLocation = async () => {
    // Ask for permission
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Toast.show({
        type: "error",
        text1: "Location not granted",
      });
      return;
    }

    setUserLocation(true);

    // Get current position
    const location = await Location.getCurrentPositionAsync({});
    const lat = location.coords.latitude;
    const lng = location.coords.longitude;

    const address = await getAddressFromCoordinates(lat, lng);

    if (!address) {
      Toast.show({
        type: "error",
        text1:
          "Error in fetching your location. Please type the street address",
      });
      return;
    } else {
      setQuery(address);
      setSelectedLocation(query);
      setLocation({ latitude: lat, longitude: lng });

      setMarkerLocation({
        latitude: lat,
        longitude: lng,
      });

      mapRef.current?.animateToRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setStep(step - 1)}
            style={styles.backIcon}
          >
            <Ionicons name="arrow-back" size={16} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.title}>One last step</Text>
        </View>
      <Text style={styles.subtitle}>
        Help us find learning opportunities near you
      </Text>

      <View style={{ position: "relative" }}>
        <TextInput
          placeholder="Your current street address"
          placeholderTextColor="#6B7280"
          style={styles.input}
          keyboardType="default"
          onChangeText={(value) => {
            setUserLocation(false);
            setQuery(value);
          }}
          value={query}
        />

        {!userLocation && suggestions.length > 0 && (
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
                <Text style={styles.businessName}>
                  {suggestion.businessName}
                </Text>
                <Text style={styles.address}>
                  {suggestion.streetAddress}, {suggestion.city}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={{ marginTop: 16, height: 250, position: "relative" }}>
        <MapView
          ref={mapRef}
          style={[StyleSheet.absoluteFill, { borderRadius: 12 }]}
          initialRegion={{
            ...markerLocation,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker coordinate={markerLocation} title={selectedLocation} />
        </MapView>
        <TouchableWithoutFeedback onPress={getUserLocation}>
          <Ionicons
            name="compass-outline"
            size={34}
            color="#1F2937"
            style={{ position: "absolute", bottom: 8, right: 8 }}
          />
        </TouchableWithoutFeedback>
      </View>

      <Button
        onPress={handleRegistration}
        text={"Register"}
        disabled={(selectedLocation === undefined && query === "") || isLoading}
        loading={isLoading}
      />
    </View>
  );
};

export default HomeAddress;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.8)",
    width: screenWidth - 48,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  backIcon: {
    position: "absolute",
    left: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#8B5CF6",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: "#6B7280",
    marginBottom: 15,
  },
  label: {
    fontWeight: "500",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
  },
  suggestionContainer: {
    position: "absolute",
    top: 30,
    width: "100%",
    zIndex: 10,
    marginTop: 16,
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderColor: "#F3F4F6",
    borderWidth: 1,
    maxHeight: screenHeight * 0.5,
  },
  suggestionItem: {
    paddingVertical: 7,
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
