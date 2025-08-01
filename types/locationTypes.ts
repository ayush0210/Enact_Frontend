export interface LocationSuggestion {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export interface LocationDetails {
  businessName: string;
  city: string;
  state: string;
  streetAddress: string;
  place_id: string;
}

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface LocationList {
  id: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string | undefined;
}
