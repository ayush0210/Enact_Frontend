import { Button } from "@/components/ui/Button";
import { screenWidth } from "@/constants/ScreenDimensions";
import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface TotalChildrenProps {
  step: number;
  setStep: (_arg0: number) => void;
  numberOfChildren: number;
  handleNumberOfChildrenChange: (_arg0: string) => void;
}

const TotalChildren: React.FC<TotalChildrenProps> = ({
  step,
  setStep,
  numberOfChildren,
  handleNumberOfChildrenChange,
}) => {
  const handleButtonPressed = () => {
    setStep(step + 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setStep(step - 1)}
          style={styles.backIcon}
        >
          <Ionicons name="arrow-back" size={16} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.title}>Family Information</Text>
      </View>

      <Text style={styles.subtitle}>How many children do you have?</Text>

      <View>
        <TextInput
          placeholder="Number of children"
          placeholderTextColor="#6B7280"
          onChangeText={handleNumberOfChildrenChange}
          style={styles.input}
          keyboardType="number-pad"
        />
      </View>

      <Button
        onPress={handleButtonPressed}
        text={"Continue"}
        disabled={numberOfChildren === 0}
      />
    </View>
  );
};

export default TotalChildren;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.8)",
    width: screenWidth - 48,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  backIcon: {
    position: "absolute",
    left: 0,
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
    marginBottom: 15,
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
});
