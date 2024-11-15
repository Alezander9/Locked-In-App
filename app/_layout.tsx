import { ConvexReactClient } from "convex/react";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import * as SecureStore from "expo-secure-store";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { TamaguiProvider, YStack } from "tamagui";
import config from "../tamagui.config";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  OpenSans_300Light,
  OpenSans_400Regular,
  OpenSans_500Medium,
  OpenSans_600SemiBold,
  OpenSans_700Bold,
} from "@expo-google-fonts/open-sans";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

// Clerk token cache
const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🔐 \n`);
      } else {
        console.log("No values stored under key: " + key);
      }
      return item;
    } catch (error) {
      console.error("SecureStore get item error: ", error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    "OpenSans-Light": OpenSans_300Light,
    "OpenSans-Regular": OpenSans_400Regular,
    "OpenSans-Medium": OpenSans_500Medium,
    "OpenSans-SemiBold": OpenSans_600SemiBold,
    "OpenSans-Bold": OpenSans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hide();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey="pk_test_Y29tbXVuYWwtc3F1aXJyZWwtOC5jbGVyay5hY2NvdW50cy5kZXYk"
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <TamaguiProvider
          config={config}
          defaultTheme={colorScheme === "dark" ? "dark" : "light"}
        >
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <YStack
              flex={1}
              backgroundColor="$bg"
              position="absolute"
              width="100%"
              height="100%"
            >
              <Stack screenOptions={{ headerShown: false }}>
                {/* Auth group */}
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />

                {/* Onboarding group */}
                <Stack.Screen
                  name="(onboarding)"
                  options={{ headerShown: false }}
                />

                {/* Main tab navigation */}
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

                {/* Modal screens */}
                <Stack.Screen
                  name="settings/index"
                  options={{
                    presentation: "modal",
                    headerShown: true,
                    title: "Settings",
                  }}
                />

                {/* Error handling */}
                <Stack.Screen name="+not-found" options={{ title: "Oops!" }} />
              </Stack>
            </YStack>
          </ThemeProvider>
        </TamaguiProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
