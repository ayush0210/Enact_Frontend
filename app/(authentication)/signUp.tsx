import ChildrenInformation from "@/components/auth/signUp/ChildrenInformation";
import Credentials from "@/components/auth/signUp/Credentials";
import HomeAddress from "@/components/auth/signUp/HomeAddress";
import TotalChildren from "@/components/auth/signUp/TotalChildren";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";

export default function SignUpScreen() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({ latitude: 0, longitude: 0 });
  const [numberOfChildren, setNumberOfChildren] = useState<string>("0");
  const { register } = useContext<any>(AuthContext);

  const [childrenDetails, setChildrenDetails] = useState<
    Array<{
      nickname: string;
      birthYear: string;
      birthMonth: string;
    }>
  >([]);

  // Update the number of children handler
  const handleNumberOfChildrenChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setNumberOfChildren(numericValue);

    const num = parseInt(numericValue) || 0;
    setChildrenDetails((prevDetails) => {
      if (num > prevDetails.length) {
        return [
          ...prevDetails,
          ...Array(num - prevDetails.length).fill({
            nickname: "",
            birthYear: new Date().getFullYear().toString(),
            birthMonth: "01",
          }),
        ];
      } else {
        return prevDetails.slice(0, num);
      }
    });
  };

  // Add handler for child details changes
  const handleChildDetailChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setChildrenDetails((prevDetails) => {
      const newDetails = [...prevDetails];
      newDetails[index] = {
        ...newDetails[index],
        [field]: value,
      };
      return newDetails;
    });
  };

  const handleRegistration = async () => {
    try {
      const registrationData = {
        numberOfChildren: parseInt(numberOfChildren),
        childrenDetails: childrenDetails.map((child) => ({
          nickname:
            child.nickname || `Child_${childrenDetails.indexOf(child) + 1}`,
          date_of_birth: `${child.birthYear}-${child.birthMonth}-01`,
        })),
      };

      console.log("Registration data:", {
        name: name.trim(),
        email: email.trim(),
        password,
        location,
        childrenData: registrationData,
      });

      const success = await register(
        name.trim(),
        email.trim(),
        password,
        location,
        registrationData
      );

      if (success) {
        Toast.show({
          type: "success",
          text1: "Registration Succeeded",
          text2: "You can now log in",
        });

        setTimeout(() => {
          router.replace("/(authentication)/signIn");
        }, 1500);
      } else {
        Toast.show({
          type: "error",
          text1: "Registration Failed",
          text2: "Please try again after some time",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      Toast.show({
        type: "error",
        text1: "Registration Failed",
        text2: "Internal server error",
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Credentials
            step={step}
            setStep={setStep}
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
          />
        );
      case 2:
        return (
          <TotalChildren
            step={step}
            setStep={setStep}
            numberOfChildren={parseInt(numberOfChildren, 10)}
            handleNumberOfChildrenChange={handleNumberOfChildrenChange}
          />
        );
      case 3:
        return (
          <ChildrenInformation
            childrenDetails={childrenDetails}
            onChildDetailChange={handleChildDetailChange}
            step={step}
            setStep={setStep}
          />
        );

      case 4: // Implement location card
        return (
          <HomeAddress
            step={step}
            setStep={setStep}
            setLocation={setLocation}
            handleRegistration={handleRegistration}
          />
        );

      default:
        return null;
    }
  };

  return (
    <GradientBackground>
      <View style={styles.wrapper}>{renderStep()}</View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
