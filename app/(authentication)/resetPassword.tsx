import { Button } from "@/components/ui/Button";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { screenWidth } from "@/constants/ScreenDimensions";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
	StyleSheet,
	Text,
	TextInput,
	View
} from "react-native";

const inputWidth = Math.min(screenWidth * 0.85, 400);

export default function ResetPasswordScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");

  return (
    <GradientBackground>
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you instructions to reset your password
          </Text>

          <View>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#6B7280"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Button
            onPress={() => console.log("hello")}
            text="Send Instructions"
          />
        </View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: 24,
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.8)",
    width: screenWidth - 48,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#8B5CF6",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: "#6B7280",
    marginBottom: 30,
  },
  label: {
    fontWeight: "500",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
  },
  passwordContainer: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    paddingRight: 10,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginVertical: 8,
  },
  forgotPassword: {
    color: "#8B5CF6",
    fontWeight: "600",
  },
  signUpLink: {
    marginTop: 5,
    textAlign: "center",
    color: "#6B7280",
  },
  signUpText: {
    color: "#8B5CF6",
    fontWeight: "bold",
  },

  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 16,
    maxWidth: inputWidth,
    alignSelf: "center",
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
});
