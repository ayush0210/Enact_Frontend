import {
  LocationCoordinates,
  LocationDetails,
  LocationList,
  LocationSuggestion,
} from "@/types/locationTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

const parseLocation = (prediction: LocationSuggestion): LocationDetails => {
  const predictionArr = prediction.description.split(", ");

  const businessName = predictionArr[0];
  const streetAddress = predictionArr[1];
  const city = predictionArr[2];
  const state = predictionArr[3];

  return {
    place_id: prediction.place_id,
    businessName: businessName,
    streetAddress: streetAddress,
    city: city,
    state: state,
  };
};

export const fetchSuggestions = async (
  input: string
): Promise<LocationDetails[]> => {
  if (!input) return [];

  const endpoint = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    input
  )}&key=${GOOGLE_API_KEY}`;

  try {
    const res = await fetch(endpoint);
    const data = await res.json();

    const predictions: LocationSuggestion[] = data.predictions;

    const parsedLocations: LocationDetails[] = predictions.map((prediction) => {
      return parseLocation(prediction);
    });

    return parsedLocations;
  } catch (error) {
    console.error("Google Places API error:", error);
    return [];
  }
};

export const getLocationCoordinates = async (
  place_id: string
): Promise<LocationCoordinates> => {
  const endpoint = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=geometry&key=${GOOGLE_API_KEY}`;

  try {
    const res = await fetch(endpoint);
    const data = await res.json();

    const coordinates: LocationCoordinates = {
      latitude: data.result.geometry.location.lat,
      longitude: data.result.geometry.location.lng,
    };

    return coordinates;
  } catch (error) {
    console.error("Google Places API error:", error);
    return { latitude: 0, longitude: 0 };
  }
};

export const getAddressFromCoordinates = async (
  latitude: number,
  longitude: number
): Promise<string | undefined> => {
  const endpoint = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`;

  try {
    const res = await fetch(endpoint);
    const data = await res.json();

    if (data.status === "OK" && data.results.length > 0) {
      const address = data.results[0].formatted_address;

      const address_arr = address.split(", ");

      address_arr.pop();
      address_arr.pop();

      return address_arr.join(", ");
    } else {
      console.warn("No address found for these coordinates");
      return undefined;
    }
  } catch (error) {
    console.error("Geocoding error:", error);
    return undefined;
  }
};

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export const isLocationNearby = async (
  newLat: number,
  newLon: number
): Promise<boolean> => {
  const locationsString = await AsyncStorage.getItem("savedLocations");

  if (locationsString) {
    const locations = JSON.parse(locationsString);

    return locations.some((loc: LocationList) => {
      const distance = calculateDistance(
        newLat,
        newLon,
        loc.latitude,
        loc.longitude
      );
      return distance <= 100;
    });
  }

  return false;
};
