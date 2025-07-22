import { screenWidth } from "@/constants/ScreenDimensions";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SearchInputField from "../ui/SearchInputField";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
      toValue: chatMode ? -180 : 0, // 180 ≈ distance to Header bottom
      duration: 300,
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

      <SearchInputField
        materialIconName="chat-bubble-outline"
        placeholder="How can I help you today?"
        backgroundColor="#F9FAFB"
        marginTop={-2}
        inputProps={{
          onFocus: onFocus, // slide up & hide other blocks
          onBlur: onBlur, // slide back & show everything
        }}
      />

      <TouchableOpacity style={styles.button}>
        <LinearGradient
          colors={["#3B82F6", "#8B5CF6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          <Text style={styles.buttonText}>Get Parenting Advice</Text>
        </LinearGradient>
      </TouchableOpacity>
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
  button: {
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 16,
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
