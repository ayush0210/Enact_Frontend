import AddLocation from "@/components/Location/AddLocation";
import SavedLocations from "@/components/Location/SavedLocations";
import SearchLocation from "@/components/Location/SearchLocation";
import { DEFAULT_LOCATION } from "@/controllers/locationCacheController";
import { LocationCoordinates, LocationList } from "@/types/locationTypes";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Toast from "react-native-toast-message";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function LocationsScreen() {
  const { tab } = useLocalSearchParams();

  const [markerLocation, setMarkerLocation] = useState<LocationCoordinates>({
    latitude: DEFAULT_LOCATION.latitude,
    longitude: DEFAULT_LOCATION.longitude,
  });
  const [selectedLocation, setSelectedLocation] =
    useState<LocationCoordinates | null>(null);
  const [savedLocationsList, setSavedLocationsList] = useState<LocationList[]>(
    []
  );
  const sheetRef = useRef<BottomSheet>(null);
  const mapRef = useRef<MapView>(null);

  // Fetch saved locations from the AsyncStorage
  useEffect(() => {
    const loadLocations = async () => {
      const savedLocationsString = await AsyncStorage.getItem("savedLocations");

      const savedLocations: LocationList[] = JSON.parse(savedLocationsString!);
      setSavedLocationsList(savedLocations);
    };

    loadLocations();
  }, []);

  useEffect(() => {
    console.log("savedLocationsList", savedLocationsList);
  }, [savedLocationsList]);

  // Dynamic snap points based on whether location is selected
  const snapPoints = useMemo(() => {
    if (selectedLocation) {
      // When location is selected, use smaller height to fit content
      return [SCREEN_HEIGHT * 0.7]; // Adjust this value based on your content height
    } else {
      // When searching, use 80% of screen height
      return [SCREEN_HEIGHT * 0.8];
    }
  }, [selectedLocation]);

  useEffect(() => {
    const timer = setTimeout(() => {
      sheetRef.current?.snapToIndex(0);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  // Animate to new snap point when selectedLocation changes
  useEffect(() => {
    if (sheetRef.current) {
      sheetRef.current.snapToIndex(0);
    }
  }, [selectedLocation, snapPoints]);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={{
          ...(tab === "saved" &&
          savedLocationsList != undefined &&
          savedLocationsList!.length > 0
            ? {
                latitude: savedLocationsList![0].latitude,
                longitude: savedLocationsList![0].longitude,
              }
            : markerLocation),
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {tab === "saved" &&
        savedLocationsList != undefined &&
        savedLocationsList!.length > 0 ? (
          savedLocationsList!.map((loc) => (
            <Marker
              key={loc.id}
              coordinate={{
                latitude: loc.latitude,
                longitude: loc.longitude,
              }}
              title={loc.title}
              description={loc.address}
            />
          ))
        ) : (
          <Marker coordinate={markerLocation} title="Selected Location" />
        )}
      </MapView>

      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        index={0}
        enablePanDownToClose={false}
        enableOverDrag={false}
        handleIndicatorStyle={{ display: "none" }}
        handleStyle={{ height: 0 }}
        animateOnMount={true}
        backgroundComponent={({ style }) => (
          <LinearGradient
            colors={["#EFF6FF", "#FFFFFF", "#F5F3FF"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={[style, StyleSheet.absoluteFill]}
            pointerEvents="none"
          />
        )}
        backgroundStyle={styles.background}
      >
        <BottomSheetView
          style={[
            styles.content,
            selectedLocation || tab === "saved"
              ? styles.contentCompact
              : styles.contentExpanded,
          ]}
        >
          {tab === "saved" ? (
            <SavedLocations savedLocationsList={savedLocationsList} />
          ) : (
            <>
              {!selectedLocation && (
                <SearchLocation
                  selectedLocation={selectedLocation}
                  setSelectedLocation={setSelectedLocation}
                  setMarkerLocation={setMarkerLocation}
                  mapRef={mapRef}
                />
              )}

              {/* Confirm Button - Only show when location is selected */}
              {selectedLocation && (
                <AddLocation
                  selectedLocation={selectedLocation}
                  setSelectedLocation={setSelectedLocation}
                />
              )}
            </>
          )}
        </BottomSheetView>
      </BottomSheet>

      <Toast position="bottom" />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  content: {
    paddingHorizontal: 25,
  },
  contentExpanded: {
    minHeight: SCREEN_HEIGHT * 0.8 - 60,
  },
  contentCompact: {
    // Let it size to content
  },
});
