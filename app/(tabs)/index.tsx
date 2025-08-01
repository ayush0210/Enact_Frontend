import ContentPreferences from "@/components/Home/ContentPreferences";
import Header from "@/components/Home/Header";
import ParentingAdvice from "@/components/Home/ParentingAdvice";
import {
  LocationContext,
  LocationContextType,
} from "@/context/LocationContext";
import { useLocationCache } from "@/controllers/locationCacheController";
import { LinearGradient } from "expo-linear-gradient";
import { useContext, useEffect, useRef, useState } from "react";
import { Animated, Keyboard, Pressable, ViewStyle } from "react-native";
import Toast from "react-native-toast-message";

export default function HomeScreen() {
  const { loadCachedDataFirst, getQuickLocation, improveLocationInBackground } =
    useLocationCache();
  const { refreshDataInBackground } =
    useContext<LocationContextType>(LocationContext);
  const [chatMode, setChatMode] = useState(false);

  const gridAnim = useRef(new Animated.Value(0)).current; // 0 = visible

  const enterChat = () => {
    setChatMode(true);
  };

  const leaveChat = () => {
    Keyboard.dismiss();
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

  // Startup initialization useEffect
  useEffect(() => {
    let mounted = true;

    const startupSequence = async () => {
      console.log("=== FAST STARTUP SEQUENCE BEGIN ===");

      try {
        await loadCachedDataFirst();

        const quickLocation = await getQuickLocation();

        if (mounted) {
          console.log("Quick location set:", quickLocation);
        }

        await new Promise((resolve) => setTimeout(resolve, 100));

        console.log("Starting background operations...");

        Promise.allSettled([
          improveLocationInBackground(),
          refreshDataInBackground(),
        ]).then(() => {
          if (mounted) {
            console.log("Background operations completed");
          }
        });
      } catch (error) {
        console.error("Startup sequence error:", error);
      }

      console.log("=== FAST STARTUP SEQUENCE END ===");
    };

    startupSequence();

    // return () => {
    //   mounted = false;

    //   // Cleanup voice and sound
    //   Voice.destroy().then(Voice.removeAllListeners);
    //   if (currentSound.current) {
    //     currentSound.current.stop();
    //     currentSound.current.release();
    //     currentSound.current = null;
    //   }
    //   setIsPlaying(false);
    //   setActiveAudioIndex(null);
    // };
  }, [
    getQuickLocation,
    loadCachedDataFirst,
    improveLocationInBackground,
    refreshDataInBackground,
  ]);

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
