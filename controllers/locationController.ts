// src/controllers/locationController.ts

import { PlaceSuggestion } from "@/types/locationTypes";

// import { PlaceSuggestion } from "../types/locationTypes";

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

export const fetchSuggestions = async (
  input: string
): Promise<PlaceSuggestion[]> => {
  if (!input) return [];

  const endpoint = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    input
  )}&key=${GOOGLE_API_KEY}`;

  try {
    const res = await fetch(endpoint);
    const data = await res.json();
    console.log("dta,", data);
    return data.predictions || [];
  } catch (error) {
    console.error("Google Places API error:", error);
    return [];
  }
};
