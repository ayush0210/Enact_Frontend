// GradientBackground.tsx
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet } from "react-native";

type Props = {
  children: React.ReactNode;
};

export const GradientBackground = ({ children }: Props) => {
  return (
    <LinearGradient
      colors={["#3B82F6", "#8B5CF6"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.75, y: 0 / 75 }}
      style={StyleSheet.absoluteFill}
    >
      {children}
    </LinearGradient>
  );
};
