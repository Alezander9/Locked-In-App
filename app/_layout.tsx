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
import { useCallback, useEffect, useState } from "react";
import { AnimatedSplash } from "@/components/AnimatedSplash";
import { Image } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

// Create a global promise to track asset loading
let ASSETS_LOADED: Promise<void> | null = null;

// Preload all assets once and cache the promise
const preloadAssets = async () => {
  const images = [
    require("../assets/images/LockedInLogoSplash.webp"),
    require("../assets/images/LockedInLogoSplashText.webp"),
    require("../assets/images/EventsGraphic.webp"),
  ];

  const imagePromises = images.map((image) => {
    return Image.prefetch(Image.resolveAssetSource(image).uri);
  });

  // Add any other asset loading here (e.g., animations, videos)
  await Promise.all(imagePromises);
};

// Custom hook to manage loading state
const useAppLoading = () => {
  const [isReady, setIsReady] = useState(false);
  const [fontsLoaded] = useFonts({
    "OpenSans-Light": OpenSans_300Light,
    "OpenSans-Regular": OpenSans_400Regular,
    "OpenSans-Medium": OpenSans_500Medium,
    "OpenSans-SemiBold": OpenSans_600SemiBold,
    "OpenSans-Bold": OpenSans_700Bold,
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Initialize the global assets promise if not already done
        if (!ASSETS_LOADED) {
          ASSETS_LOADED = preloadAssets();
        }

        // Wait for both fonts and assets
        await Promise.all([
          ASSETS_LOADED,
          new Promise((resolve) => fontsLoaded && resolve(true)),
        ]);

        // Add a small delay to ensure smooth transition
        await new Promise((resolve) => setTimeout(resolve, 50));

        setIsReady(true);
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, [fontsLoaded]);

  return isReady;
};

// Clerk token cache
const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        // console.log(`${key} was used 🔐 \n`);
      } else {
        // console.log("No values stored under key: " + key);
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
  const isReady = useAppLoading();
  const [showAnimatedSplash, setShowAnimatedSplash] = useState(true);

  useEffect(() => {
    if (isReady) {
      // Only hide the native splash screen when we're ready to show the animated splash
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  const onAnimationComplete = useCallback(() => {
    setShowAnimatedSplash(false);
  }, []);

  if (!isReady) {
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
              {showAnimatedSplash ? (
                <AnimatedSplash onAnimationComplete={onAnimationComplete} />
              ) : (
                <Stack screenOptions={{ headerShown: false }}>
                  {/* Auth group */}
                  <Stack.Screen
                    name="(auth)"
                    options={{ headerShown: false }}
                  />

                  {/* Onboarding group */}
                  <Stack.Screen
                    name="(onboarding)"
                    options={{ headerShown: false }}
                  />

                  {/* Main tab navigation */}
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />

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
                  <Stack.Screen
                    name="+not-found"
                    options={{ title: "Oops!" }}
                  />
                </Stack>
              )}
            </YStack>
          </ThemeProvider>
        </TamaguiProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
