import { ContentPreferencesData } from "@/constants/ContentPreferences";
import { screenWidth } from "@/constants/ScreenDimensions";

import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  UIManager,
} from "react-native";
import Toast from "react-native-toast-message";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ContentPreferences = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleSelect = (cp: any) => {
    if (cp.status === "coming soon") {
      console.log("coming soon");
      Toast.show({
        type: "error",
        text1: "This preference is coming soon",
      });

      return;
    }
    setSelectedIds((prev) =>
      prev.includes(cp._id)
        ? prev.filter((x) => x !== cp._id)
        : [...prev, cp._id]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Content Preferences</Text>

      <View style={styles.grid}>
        {ContentPreferencesData.map((cp, idx) => {
          const isSelected = selectedIds.includes(cp._id);
          const comingSoon = cp.status === "coming soon";

          return (
            <View
              key={cp._id}
              style={[
                styles.card,
                { marginBottom: idx < 2 ? 16 : 0 },
                isSelected && styles.selected,
                comingSoon && styles.disabled,
              ]}
            >
              <Pressable onPress={() => toggleSelect(cp)}>
                <Text
                  style={[
                    styles.cardTitle,
                    !comingSoon && styles.enabledTitle,
                    comingSoon && styles.disabledTitle,
                  ]}
                >
                  {cp.title}
                </Text>
                <Text style={styles.cardDescription} numberOfLines={3}>
                  {cp.description}
                </Text>
                {comingSoon && <Text style={styles.badge}>Coming soon</Text>}
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default ContentPreferences;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginHorizontal: screenWidth * 0.05,
    marginTop: -27.5, // Overlap effect
    padding: 16,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: (screenWidth * 0.9 - 48) / 2,
    padding: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#F3F4F6",
  },
  selected: { borderColor: "#3B82F6" },
  disabled: { backgroundColor: "#F3F4F6" },
  cardTitle: {
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 4,
  },
  enabledTitle: {
    color: "#1F2937",
  },
  disabledTitle: {
    color: "6B7280",
    cursor: "",
  },
  cardDescription: { fontSize: 11, color: "#6B7280" },
  infoBtn: {
    position: "absolute",
    top: 12,
    right: 8,
  },
  infoIcon: { fontStyle: "italic" },
  badge: {
    marginTop: 8,
    fontSize: 10,
    fontStyle: "italic",
    color: "#6B7280",
  },
});
