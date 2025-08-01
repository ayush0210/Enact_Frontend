import { AuthContext, AuthContextType } from "@/context/AuthContext";

import { Stack, useRouter } from "expo-router";
import React, { useContext, useEffect } from "react";

export default function AuthenticationLayout() {
  const { isLoggedIn } = useContext<AuthContextType>(AuthContext);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const user = await isLoggedIn();

        if (user) {
          router.replace("/(tabs)");
        }
      } catch (err) {
        console.error("Error inside useEffect:", err);
      }
    })();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "transparent" },
        animation: "ios_from_right",
      }}
    />
  );
}
