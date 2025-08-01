import { GradientBackground } from "@/components/ui/GradientBackground";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function LandingScreen() {
  const router = useRouter();
  return (
    <GradientBackground>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to ENACT</Text>
        <Text style={styles.subtitle}>
          Get started by signing in or creating an account
        </Text>

        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => router.push("/(authentication)/signIn")}
        >
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push("/(authentication)/signUp")}
        >
          <Text style={styles.createText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#FFF",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 36,
    color: "#DBEAFE",
    textAlign: "center",
  },
  signInButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    marginBottom: 18,
    width: "100%",
    alignItems: "center",
  },
  signInText: { fontSize: 18, color: "#FFF" },
  createButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#FFF",
    borderColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    width: "100%",
    alignItems: "center",
  },
  createText: { fontSize: 18, color: "#1F2937" },
});
