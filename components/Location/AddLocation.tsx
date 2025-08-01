import {
  LocationContext,
  LocationContextType,
} from "@/context/LocationContext";
import { isLocationNearby } from "@/controllers/locationController";
import { LocationCoordinates } from "@/types/locationTypes";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { ReactNode, useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Toast from "react-native-toast-message";
import { Button } from "../ui/Button";

// Define type for dropdown items
type DropdownItem = {
  label: string;
  value: string;
  icon: () => ReactNode;
};

interface AddLocationProps {
  setSelectedLocation: (_arg0: LocationCoordinates | null) => void;
  selectedLocation: LocationCoordinates | null;
}

const AddLocation: React.FC<AddLocationProps> = ({
  setSelectedLocation,
  selectedLocation,
}) => {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [locationType, setLocationType] = useState<string | null>(null);
  const [items, setItems] = useState<DropdownItem[]>([
    {
      label: "Grocery Store",
      value: "Grocery Store",
      icon: () => <Ionicons name="cart-outline" size={18} color="#4A90E2" />,
    },
    {
      label: "Bus/Walk",
      value: "Bus/Walk",
      icon: () => <Ionicons name="walk-outline" size={18} color="#4A90E2" />,
    },
    {
      label: "Library",
      value: "Library",
      icon: () => <Ionicons name="book-outline" size={18} color="#4A90E2" />,
    },
    {
      label: "Park",
      value: "Park",
      icon: () => <Ionicons name="leaf-outline" size={18} color="#4A90E2" />,
    },
    {
      label: "Restaurant",
      value: "Restaurant",
      icon: () => (
        <Ionicons name="restaurant-outline" size={18} color="#4A90E2" />
      ),
    },
    {
      label: "Waiting Room",
      value: "Waiting Room",
      icon: () => <Ionicons name="time-outline" size={18} color="#4A90E2" />,
    },
    {
      label: "Home",
      value: "Home",
      icon: () => <Ionicons name="home-outline" size={18} color="#4A90E2" />,
    },
  ]);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);

  const { isLoading, addLocation, fetchLocations } =
    useContext<LocationContextType>(LocationContext);

  const handleAddLocation = async () => {
    const nearbyLocation = await isLocationNearby(
      selectedLocation!.latitude,
      selectedLocation!.longitude
    );

    if (nearbyLocation) {
      Toast.show({
        type: "error",
        text1: "Duplicate Location",
        text2: "A location already exists within 100 meters of this point.",
      });

      return;
    }

    const data = await addLocation(
      selectedLocation!.latitude,
      selectedLocation!.longitude,
      locationName!,
      description!,
      locationType!
    );

    if (data) {
      await fetchLocations();
      Toast.show({
        type: "success",
        text1: "Location added successfully",
      });
      router.replace("/(tabs)");
    } else {
      Toast.show({
        type: "error",
        text1: "Failed to add location",
      });
    }
  };

  return (
    <React.Fragment>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setSelectedLocation(null)}
          style={styles.backIcon}
        >
          <Ionicons name="arrow-back" size={20} color="#1F2937" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Add location</Text>
      </View>

      <DropDownPicker
        open={open}
        value={locationType}
        items={items}
        setOpen={setOpen}
        setValue={setLocationType}
        setItems={setItems}
        placeholder="Select location type"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownBox}
        dropDownDirection="BOTTOM"
        showArrowIcon={true}
        showTickIcon={true}
        listItemLabelStyle={{ marginLeft: 5 }} // spacing between icon and label
      />

      <TextInput
        style={styles.input}
        placeholder="Location Name"
        value={locationName!}
        onChangeText={setLocationName}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        value={description!}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <View style={{ marginBottom: 32 }}>
        <Button
          text="Add Location"
          onPress={handleAddLocation}
          disabled={!locationName || !description}
          loading={isLoading}
        />
      </View>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginBottom: 30,
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
  dropdown: {
    borderRadius: 16,
    marginBottom: 16,
    borderColor: "#FFF",
    height: 50,
  },
  dropdownBox: {
    borderRadius: 16,
    borderColor: "#F3F4F6",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    borderColor: "#F3F4F6",
    borderWidth: 1,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 32,
  },
  gradientButton: {
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default AddLocation;
