import { Button } from "@/components/ui/Button";
import { screenHeight, screenWidth } from "@/constants/ScreenDimensions";
import { Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ChildDetail {
  nickname: string;
  birthMonth: string;
  birthYear: string;
}

interface ChildrenInformationProps {
  step: number;
  setStep: (_arg0: number) => void;
  childrenDetails: ChildDetail[];
  onChildDetailChange: (index: number, field: string, value: string) => void;
}

const ChildrenInformation: React.FC<ChildrenInformationProps> = ({
  step,
  setStep,
  childrenDetails,
  onChildDetailChange,
}) => {
  const handleButtonPressed = () => {
    setStep(step + 1);
  };
  return (
    <KeyboardAvoidingView>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setStep(step - 1)}
            style={styles.backIcon}
          >
            <Ionicons name="arrow-back" size={16} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.title}>Children Details</Text>
        </View>
        <Text style={styles.subtitle}>Let us know about your children</Text>

        <View style={{ maxHeight: screenHeight - 250 }}>
          <FlatList
            data={childrenDetails}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={{ marginBottom: 6 }}
            renderItem={({ item, index }) => (
              <View
                style={[
                  styles.card,
                  { marginBottom: index < childrenDetails.length - 1 ? 12 : 0 },
                ]}
              >
                <Text style={styles.cardTitle}>Nickname</Text>
                <TextInput
                  placeholder="Nickname"
                  placeholderTextColor="#6B7280"
                  value={item.nickname}
                  onChangeText={(value) => {
                    onChildDetailChange(index, "nickname", value);
                  }}
                  style={styles.input}
                  autoCapitalize="none"
                />

                <View style={styles.dateContainer}>
                  <View style={styles.dateWrapper}>
                    <Text style={styles.cardTitle}>Birth Month (MM)</Text>
                    <TextInput
                      placeholder="Birth Month"
                      placeholderTextColor="#6B7280"
                      keyboardType="number-pad"
                      autoCapitalize="none"
                      value={item.birthMonth}
                      onChangeText={(text) => {
                        // Accept raw numeric input
                        const numeric = text.replace(/[^0-9]/g, "");
                        if (numeric.length <= 2) {
                          onChildDetailChange(index, "birthMonth", numeric);
                        }
                      }}
                      onBlur={() => {
                        const raw = item.birthMonth;
                        if (raw === "") return;

                        const monthNum = parseInt(raw, 10);

                        if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
                          // Invalid month — reset or reject
                          onChildDetailChange(index, "birthMonth", "");
                          return;
                        }

                        const padded =
                          monthNum < 10 ? `0${monthNum}` : `${monthNum}`;
                        onChildDetailChange(index, "birthMonth", padded);
                      }}
                      style={styles.input}
                    />
                  </View>

                  <View style={styles.dateWrapper}>
                    <Text style={styles.cardTitle}>Birth Year (YYYY)</Text>
                    <TextInput
                      placeholder="Birth Year"
                      placeholderTextColor="#6B7280"
                      value={item.birthYear}
                      onChangeText={(value) =>
                        onChildDetailChange(index, "birthYear", value)
                      }
                      style={styles.input}
                      autoCapitalize="none"
                      keyboardType="number-pad"
                    />
                  </View>
                </View>
              </View>
            )}
          />
        </View>

        <Button onPress={handleButtonPressed} text={"Continue"} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChildrenInformation;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.8)",
    width: screenWidth - 48,
    maxHeight: screenHeight - 150,
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
    marginBottom: 12,
  },
  card: {
    borderWidth: 1,
    borderColor: "#6B7280",
    borderRadius: 12,
    padding: 12,
  },
  cardTitle: {
    fontWeight: "500",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
  },
  dateContainer: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  dateWrapper: {
    flex: 1,
  },
});
