import { Button } from "@/components/ui/Button";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { screenWidth } from "@/constants/ScreenDimensions";
import { AuthContext, AuthContextType } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const inputWidth = Math.min(screenWidth * 0.85, 400);

export default function SignInScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isLoading, login } = useContext<AuthContextType>(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Please fill all in all the fields",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(email, password);

      if (res) router.replace("/(tabs)");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Invalid credentials",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GradientBackground>
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Sign in to your account to continue
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

            <Text style={[styles.label, { marginTop: 20 }]}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#6B7280"
                value={password}
                onChangeText={setPassword}
                style={styles.passwordInput}
                secureTextEntry={secureText}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                <Ionicons
                  name={secureText ? "eye-outline" : "eye-off-outline"}
                  size={18}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.optionsContainer}>
            <Link href={"/(authentication)/resetPassword"}>
              <Text style={styles.forgotPassword}>Forgot password?</Text>
            </Link>
          </View>

          <Button
            onPress={handleLogin}
            text={"Sign In"}
            loading={isLoading}
            disabled={isLoading || !email || !password}
          />

          <Text style={styles.signUpLink}>
            Don't have an account?{" "}
            <Link href={"/(authentication)/signUp"}>
              <Text style={styles.signUpText}>Sign up</Text>
            </Link>
          </Text>
        </View>
      </View>

      <Toast />
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
