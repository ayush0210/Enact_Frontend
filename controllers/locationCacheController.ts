import AsyncStorage from "@react-native-async-storage/async-storage";
import Geolocation, {
  GeolocationError,
  GeolocationResponse,
} from "@react-native-community/geolocation";
import { useCallback, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";

// at top of your file
import type { Region } from "react-native-maps";

// export it as Location so the rest of your code can use it…
export type Location = Region;

export const DEFAULT_LOCATION: Location = {
  latitude: 29.6468986,
  longitude: -82.3381134,
  latitudeDelta: 0.015,
  longitudeDelta: 0.015,
};

export function useLocationCache() {
  const [locationStatus, setLocationStatus] = useState<
    "loading" | "success" | "error" | "disabled"
  >("loading");

  const loadFromCache = useCallback(
    async <T = any>(key: string): Promise<T | null> => {
      try {
        const cached = await AsyncStorage.getItem(key);
        if (cached) {
          console.log(`Loaded cached data for ${key}`);
          return JSON.parse(cached) as T;
        }
      } catch (error) {
        console.warn(`Failed to load cache for ${key}:`, error);
      }
      return null;
    },
    []
  );

  const saveToCache = useCallback(
    async (key: string, data: any): Promise<void> => {
      try {
        await AsyncStorage.setItem(key, JSON.stringify(data));
        console.log(`Cached data for ${key}`);
      } catch (error) {
        console.warn(`Failed to cache ${key}:`, error);
      }
    },
    []
  );

  // Location functions (defined as useCallback)
  const getQuickLocation = useCallback(async (): Promise<Location> => {
    console.log("Getting quick location...");

    const cached = await loadFromCache("lastKnownLocation");
    if (cached && cached.latitude && cached.longitude) {
      console.log("Using cached location for quick startup");
      setLocationStatus("success");
      return cached;
    }

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        console.log("Quick location timeout, using default location");
        setLocationStatus("error");
        resolve(DEFAULT_LOCATION);
      }, 3000);

      Geolocation.getCurrentPosition(
        (position: GeolocationResponse) => {
          clearTimeout(timeout);
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
          };

          console.log("Got fresh location quickly");
          setLocationStatus("success");
          saveToCache("lastKnownLocation", newLocation);
          resolve(newLocation);
        },
        (error: GeolocationError) => {
          clearTimeout(timeout);
          console.warn("Quick location failed, using default:", error.message);
          setLocationStatus("error");
          resolve(DEFAULT_LOCATION);
        },
        {
          enableHighAccuracy: false,
          timeout: 2500,
          maximumAge: 60000,
        }
      );
    });
  }, [loadFromCache, saveToCache]);

  const improveLocationInBackground = useCallback(async () => {
    if (locationStatus === "success") {
      console.log("Location already good, skipping background improvement");
      return;
    }

    console.log("Improving location in background...");

    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message:
              "This app needs access to your location for personalized tips.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Location permission denied");
          setLocationStatus("disabled");
          return;
        }
      } catch (err) {
        console.warn("Permission request failed:", err);
        return;
      }
    }

    Geolocation.getCurrentPosition(
      (position: GeolocationResponse) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        };

        console.log("Improved location obtained in background");
        saveToCache("lastKnownLocation", newLocation);
      },
      (error: GeolocationError) => {
        console.warn("Background location improvement failed:", error.message);
        setLocationStatus("error");
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0,
      }
    );
  }, [locationStatus, saveToCache]);

  const loadCachedDataFirst = useCallback(async () => {
    console.log("Loading cached data first...");

    try {
      const cachedLocations = await loadFromCache("userLocationsCache");
      if (cachedLocations) {
        console.log("Loaded cached locations");
      }
    } catch (error) {
      console.warn("Failed to load cached data:", error);
    }
  }, [loadFromCache]);

  return { loadFromCache, saveToCache, getQuickLocation, improveLocationInBackground, loadCachedDataFirst };
}
