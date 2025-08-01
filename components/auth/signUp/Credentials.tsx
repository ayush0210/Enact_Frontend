import { Button } from "@/components/ui/Button";
import { screenWidth } from "@/constants/ScreenDimensions";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

interface CredentialsProps {
  step: number;
  setStep: (_arg0: number) => void;
  name: string;
  setName: (_arg0: string) => void;
  email: string;
  setEmail: (_arg0: string) => void;
  password: string;
  setPassword: (_arg0: string) => void;
}

const Credentials: React.FC<CredentialsProps> = ({
  step,
  setStep,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
}) => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirmPassword, setSecureConfirmPassword] = useState(true);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleButtonPressed = () => {
    setStep(step + 1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>
        Sign up to get started with your journey
      </Text>

      <View>
        <Text style={styles.label}>Name</Text>
        <TextInput
          placeholder="Enter your name"
          placeholderTextColor="#6B7280"
          value={name}
          onChangeText={setName}
          style={styles.input}
          keyboardType="default"
          autoCapitalize="none"
        />

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

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#6B7280"
            value={password}
            onChangeText={setPassword}
            style={styles.passwordInput}
            secureTextEntry={securePassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setSecurePassword(!securePassword)}>
            <Ionicons
              name={securePassword ? "eye-outline" : "eye-off-outline"}
              size={18}
              color="#6B7280"
            />
          </TouchableOpacity>
        </View>

        <Text style={[styles.label, { marginTop: 20 }]}>Confirm Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Enter your password again"
            placeholderTextColor="#6B7280"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.passwordInput}
            secureTextEntry={secureConfirmPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={() => setSecureConfirmPassword(!secureConfirmPassword)}
          >
            <Ionicons
              name={secureConfirmPassword ? "eye-outline" : "eye-off-outline"}
              size={18}
              color="#6B7280"
            />
          </TouchableOpacity>
        </View>
      </View>

      <Button
        onPress={handleButtonPressed}
        text={"Continue"}
        disabled={
          !emailRegex.test(email) ||
          password.length < 6 ||
          password !== confirmPassword
        }
      />

      <Text style={styles.signInLink}>
        Already have an account?{" "}
        <Link href={"/(authentication)/signIn"}>
          <Text style={styles.signInText}>Sign In</Text>
        </Link>
      </Text>
    </View>
  );
};

export default Credentials;

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
  },
  label: {
	marginTop: 20,
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
  signInLink: {
    marginTop: 5,
    textAlign: "center",
    color: "#6B7280",
  },
  signInText: {
    color: "#8B5CF6",
    fontWeight: "bold",
  },
});
