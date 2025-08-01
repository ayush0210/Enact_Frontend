import { fetchWithAuth } from "@/api/auth";
import { useLocationCache } from "@/controllers/locationCacheController";
import { getAddressFromCoordinates } from "@/controllers/locationController";
import { LocationList } from "@/types/locationTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { createContext, useCallback, useEffect, useState } from "react";

const BASE_URL = "http://68.183.102.75:1337";

export interface UserInfo {
  access_token?: string;
  refresh_token?: string;
}

export interface LocationContextType {
  isLoading: boolean;
  userInfo: UserInfo;
  fetchLocations: () => Promise<LocationList[] | undefined>;
  addLocation: (
    latitude: number,
    longitude: number,
    name: string,
    description: string,
    locationType: string
  ) => Promise<boolean>;
  refreshDataInBackground: () => Promise<void>;
}

export const LocationContext = createContext<LocationContextType>(
  {} as LocationContextType
);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  const [isLoading, setIsLoading] = useState(false);
  const { saveToCache } = useLocationCache();

  // Create axios instance with interceptors
  const axiosInstance = axios.create({
    baseURL: `${BASE_URL}/api/auth`, // Add the /api/auth prefix
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add request interceptor to add token to headers
  axiosInstance.interceptors.request.use(
    async (config) => {
      const userInfoString = await AsyncStorage.getItem("userInfo");
      console.log("userInfoString", userInfoString);
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        if (userInfo.access_token) {
          config.headers.Authorization = `Bearer ${userInfo.access_token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor to handle token refresh
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const userInfoString = await AsyncStorage.getItem("userInfo");
          if (!userInfoString) {
            throw new Error("No user info found");
          }

          const currentUserInfo = JSON.parse(userInfoString);
          if (!currentUserInfo.refresh_token) {
            throw new Error("No refresh token found");
          }

          // Use the correct refresh endpoint
          const response = await axios.post(`${BASE_URL}/api/auth/refresh`, {
            refresh_token: currentUserInfo.refresh_token,
          });

          const { access_token } = response.data;

          const updatedUserInfo = {
            ...currentUserInfo,
            access_token,
          };

          await AsyncStorage.setItem(
            "userInfo",
            JSON.stringify(updatedUserInfo)
          );
          setUserInfo(updatedUserInfo);

          // Update the Authorization header
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Clear user data and force re-login
          await AsyncStorage.removeItem("userInfo");
          setUserInfo({});
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  // const improveLocationInBackground = useCallback(async () => {
  //   if (locationStatus === "success") {
  //     console.log("Location already good, skipping background improvement");
  //     return;
  //   }

  //   console.log("Improving location in background...");

  //   if (Platform.OS === "android") {
  //     try {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //         {
  //           title: "Location Permission",
  //           message:
  //             "This app needs access to your location for personalized tips.",
  //           buttonNeutral: "Ask Me Later",
  //           buttonNegative: "Cancel",
  //           buttonPositive: "OK",
  //         }
  //       );

  //       if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
  //         console.log("Location permission denied");
  //         setLocationStatus("disabled");
  //         return;
  //       }
  //     } catch (err) {
  //       console.warn("Permission request failed:", err);
  //       return;
  //     }
  //   }

  //   Geolocation.getCurrentPosition(
  //     (position: GeolocationResponse) => {
  //       const newLocation = {
  //         latitude: position.coords.latitude,
  //         longitude: position.coords.longitude,
  //         latitudeDelta: LOCATION_CONFIG.DELTAS.LATITUDE,
  //         longitudeDelta: LOCATION_CONFIG.DELTAS.LONGITUDE,
  //       };

  //       console.log("Improved location obtained in background");
  //       setLocation(newLocation);
  //       setLocationStatus("success");
  //       saveToCache(LOCATION_CONFIG.CACHE_KEYS.LAST_LOCATION, newLocation);
  //     },
  //     (error: GeolocationError) => {
  //       console.warn("Background location improvement failed:", error.message);
  //       setLocationStatus("error");
  //     },
  //     {
  //       enableHighAccuracy: true,
  //       timeout: LOCATION_CONFIG.TIMEOUTS.BACKGROUND,
  //       maximumAge: 0,
  //     }
  //   );
  // }, [locationStatus, saveToCache]);

  // const loadCachedDataFirst = useCallback(async () => {
  //   console.log("Loading cached data first...");

  //   try {
  //     const cachedLocations = await loadFromCache(
  //       LOCATION_CONFIG.CACHE_KEYS.USER_LOCATIONS
  //     );
  //     if (cachedLocations) {
  //       console.log("Loaded cached locations");
  //       setLocations(cachedLocations.locations || []);
  //       setDetails(cachedLocations.details || []);
  //     }

  //     const cachedChildren = await loadFromCache(
  //       LOCATION_CONFIG.CACHE_KEYS.CHILDREN_INFO
  //     );
  //     if (cachedChildren) {
  //       console.log("Loaded cached children info");
  //       setUserChildren(cachedChildren);
  //     }

  //     const savedPreferences = await AsyncStorage.getItem("contentPreferences");
  //     if (savedPreferences) {
  //       const parsedPreferences = JSON.parse(savedPreferences);
  //       if (Array.isArray(parsedPreferences) && parsedPreferences.length > 0) {
  //         setContentPreferences(parsedPreferences);
  //       }
  //     }

  //     // Load saved and liked tips
  //     const savedTipsData = await loadFromCache("savedTips");
  //     if (savedTipsData && Array.isArray(savedTipsData)) {
  //       setSavedTips(savedTipsData);
  //     }

  //     const likedTipsData = await loadFromCache("likedTips");
  //     if (likedTipsData && Array.isArray(likedTipsData)) {
  //       setLikedTips(likedTipsData);
  //     }
  //   } catch (error) {
  //     console.warn("Failed to load cached data:", error);
  //   }
  // }, [loadFromCache]);

  const refreshDataInBackground = useCallback(async () => {
    if (!userInfo?.access_token) {
      console.log("No auth token, skipping API calls");
      return;
    }

    console.log("Refreshing data in background...");

    try {
      const locationsPromise = fetchWithAuth(`${BASE_URL}/endpoint/locations`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.access_token}`,
        },
      })
        .then(async (response) => {
          if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data.locations) && Array.isArray(data.details)) {
              await saveToCache("userLocationsCache", {
                locations: data.locations,
                details: data.details,
              });

              console.log("Locations refreshed successfully");
              return true;
            }
          }
          throw new Error(`HTTP ${response.status}`);
        })
        .catch((error) => {
          console.warn("Failed to refresh locations:", error);
          return false;
        });

      const results = await Promise.allSettled([
        Promise.race([
          locationsPromise,
          new Promise((resolve) => setTimeout(() => resolve(false), 10000)),
        ]),
      ]);

      const successCount = results.filter(
        (r) => r.status === "fulfilled" && r.value === true
      ).length;

      console.log(`Background refresh completed: ${successCount}/2 successful`);
    } catch (error) {
      console.error("Background refresh failed:", error);
    }
  }, [userInfo, saveToCache]);

  const addLocation = async (
    latitude: number,
    longitude: number,
    name: string,
    description: string,
    locationType: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await fetchWithAuth(`${BASE_URL}/endpoint/addLocation`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.access_token}`,
        },
        body: JSON.stringify({
          latitude: latitude,
          longitude: longitude,
          name,
          description,
          type: locationType,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 2) Build our new LocationList entry
      const serverData = await response.json();

      if (serverData.message === "Location added successfully") {
        await refreshDataInBackground();
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error adding location:", error);

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLocations = async (): Promise<LocationList[] | undefined> => {
    try {
      setIsLoading(true);
      const response = await fetchWithAuth(
        "http://68.183.102.75:1337/endpoint/locations",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.access_token}`,
          },
        }
      );

      if (response.status === 200) {
        const data = await response.json();

        // Check if ids are included in details
        if (data.details && data.details.length > 0) {
          console.log("First location ID:", data.details[0].id);
        }

        const { details, locations } = data;

        if (
          Array.isArray(details) &&
          Array.isArray(locations) &&
          details.length === locations.length
        ) {
          const mergedLocations: LocationList[] = await Promise.all(
            details.map(async (detail, index) => {
              const lat = locations[index].latitude;
              const lng = locations[index].longitude;

              const address = await getAddressFromCoordinates(lat, lng);

              return {
                id: detail.id,
                title: detail.title,
                description: detail.description ?? "",
                latitude: lat,
                longitude: lng,
                address,
              };
            })
          );

          if (await AsyncStorage.getItem("savedLocations")) {
            await AsyncStorage.removeItem("savedLocations");
          }

          AsyncStorage.setItem(
            "savedLocations",
            JSON.stringify(mergedLocations)
          );

          return mergedLocations;
        }
      } else {
        console.error("Error fetching locations:", response.status);
        return undefined;
      }
    } catch (error) {
      console.error("Exception fetching locations:", error);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("userInfo");
      if (stored) setUserInfo(JSON.parse(stored));
    })();
  }, []);

  return (
    <LocationContext.Provider
      value={{
        isLoading,
        userInfo,
        fetchLocations,
        addLocation,
        refreshDataInBackground,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export default LocationProvider;
