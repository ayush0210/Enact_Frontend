import Header from "@/components/Home/Header";
import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-toast-message";
import ContentPreferences from "@/components/Home/ContentPreferences";
import ParentingAdvice from "@/components/Home/ParentingAdvice";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Keyboard,
  LayoutAnimation,
  Pressable,
  ViewStyle,
} from "react-native";

export default function HomeScreen() {
  const [chatMode, setChatMode] = useState(false);

  // drives opacity + translateY for the grid
  const gridAnim = useRef(new Animated.Value(0)).current; // 0 = visible

  const enterChat = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setChatMode(true);
  };

  const leaveChat = () => {
    Keyboard.dismiss();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setChatMode(false);
  };

  /* run every time chatMode flips */
  useEffect(() => {
    Animated.timing(gridAnim, {
      toValue: chatMode ? 1 : 0, // 1 = hidden
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [chatMode]);

  // 1  Keep only “visual” properties in the style object
  const gridStyle: Animated.AnimatedProps<ViewStyle> = {
    opacity: gridAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
    transform: [
      {
        translateY: gridAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 20],
        }),
      },
    ],
  };

  return (
    <LinearGradient
      colors={["#EFF6FF", "#FFFFFF", "#F5F3FF"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      {chatMode && (
        <Pressable
          onPress={leaveChat}
          style={{
            zIndex: 1,
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          }}
        />
      )}
      <Header />

      {/* {!chatMode && <ContentPreferences />} */}
      <Animated.View
        style={gridStyle}
        pointerEvents={chatMode ? "none" : "auto"} // ✅ typed correctly
      >
        <ContentPreferences />
      </Animated.View>

      <ParentingAdvice
        chatMode={chatMode}
        onFocus={enterChat}
        onBlur={leaveChat}
      />

      <Toast />
    </LinearGradient>
  );
}
