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
import { AnimatedSplash } from "@/components/animations/AnimatedSplash";
import { Image, TouchableOpacity, Text } from "react-native";
import { ToastProvider, useToast } from "@/features/toast";
import { StudyProfileProvider } from "@/app/context/StudyProfileContext";
import Ionicons from "@expo/vector-icons/Ionicons";

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

// Add this type declaration at the top of your file
declare global {
  namespace ReactNavigation {
    interface RootParamList {
      "settings/classPreferences": {
        onHeaderPress?: () => void;
        currentClassName?: string;
      };
    }
  }
}

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
            <ToastProvider>
              <StudyProfileProvider>
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

                      {/* Add Settings Screen */}
                      <Stack.Screen
                        name="settings/index"
                        options={{
                          presentation: "card",
                          headerShown: true,
                          title: "Settings",
                          headerBackVisible: true,
                          headerBackTitle: "Back",
                        }}
                      />

                      {/* Add Schedule Screen */}
                      <Stack.Screen
                        name="settings/schedule"
                        options={{
                          presentation: "card",
                          headerShown: true,
                          title: "Schedule",
                          headerBackVisible: true,
                          headerBackTitle: "Back",
                        }}
                      />

                      {/* Add General Preferences Screen */}
                      <Stack.Screen
                        name="settings/generalPreferences"
                        options={{
                          presentation: "card",
                          headerShown: true,
                          title: "General Preferences",
                          headerBackVisible: true,
                          headerBackTitle: "Back",
                        }}
                      />

                      {/* Add Class Preferences Screen */}
                      <Stack.Screen
                        name="settings/classPreferences"
                        options={({ navigation, route }) => ({
                          presentation: "card",
                          headerShown: true,
                          title: "Class Preferences",
                          headerBackVisible: true,
                          headerBackTitle: "Back",
                          headerRight: () => (
                            <TouchableOpacity
                              onPress={() => {
                                // @ts-ignore - we know this exists because we set it
                                route.params?.onHeaderPress?.();
                              }}
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginRight: 10,
                              }}
                            >
                              <Text
                                style={{ marginRight: 8, color: "#0F9ED5" }}
                              >
                                {/* @ts-ignore - we know this exists */}
                                {route.params?.currentClassName ||
                                  "Select Class"}
                              </Text>
                              <Ionicons
                                name="chevron-down"
                                size={24}
                                color="#0F9ED5"
                              />
                            </TouchableOpacity>
                          ),
                        })}
                      />

                      {/* Modal screens */}
                      <Stack.Screen
                        name="(modals)/create-event/index"
                        options={{
                          presentation: "modal",
                          headerShown: true,
                          title: "Create Event",
                        }}
                      />

                      <Stack.Screen
                        name="(modals)/input/date-time"
                        options={{
                          presentation: "modal",
                          headerShown: true,
                        }}
                      />

                      <Stack.Screen
                        name="(modals)/input/duration"
                        options={{
                          presentation: "modal",
                          headerShown: true,
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
              </StudyProfileProvider>
            </ToastProvider>
          </ThemeProvider>
        </TamaguiProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
