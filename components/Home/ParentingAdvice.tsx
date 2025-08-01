import { screenWidth } from "@/constants/ScreenDimensions";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "../ui/Button";

interface ParentingAdviceProps {
  chatMode: boolean;
  onFocus: () => void;
  onBlur: () => void;
}

const ParentingAdvice: React.FC<ParentingAdviceProps> = ({
  chatMode,
  onFocus,
  onBlur,
}) => {
  /** translate the whole card when chatMode is on */
  const slideY = useRef(new Animated.Value(0)).current;

  /** run once when chatMode switches */
  useEffect(() => {
    Animated.timing(slideY, {
      toValue: chatMode ? -180 : 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [chatMode]);

  const insets = useSafeAreaInsets();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideY }],
          opacity: chatMode ? 1 : 1, // remains fully opaque
          position: chatMode ? "absolute" : "relative",
          top: chatMode ? insets.top + 295 : undefined, // sits just under header
          left: 0,
          right: 0,
        },
      ]}
    >
      <Text style={styles.title}>Ask your companion</Text>
      <Text style={styles.subtitle}>Get personalized advice</Text>

      <View style={styles.searchBar}>
        <Ionicons
          name="chatbubble-outline"
          size={20}
          color="#4A90E2"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="How can I help you today?"
          placeholderTextColor="#6B7280"
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </View>

      <Button
        onPress={() => console.log("Parenting adice")}
        text="Get Parenting Advice"
      />
    </Animated.View>
  );
};

export default ParentingAdvice;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginHorizontal: screenWidth * 0.05,
    marginTop: 27.5, // Overlap effect
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
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: 300,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    borderRadius: 30,
    alignItems: "center",
    paddingHorizontal: 15,
    height: 45,
    backgroundColor: "#F9FAFB",
    marginTop: -2,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
});
