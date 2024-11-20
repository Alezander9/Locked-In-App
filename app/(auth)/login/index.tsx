import { useOAuth, useAuth, useUser } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import { Button } from "@/components/CustomButton";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useCallback, useEffect, useState, useRef } from "react";
import {
  Platform,
  SafeAreaView,
  View,
  Image,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "tamagui";

WebBrowser.maybeCompleteAuthSession();

const FEATURE_DATA = [
  {
    id: 1,
    image: require("@/assets/images/EventsGraphic.png"),
    title: "Join Public Study Sessions",
    description: "View and host study sessions for your whole campus",
  },
  {
    id: 2,
    image: require("@/assets/images/TasksGraphic.png"),
    title: "Deconstruct Assignments",
    description:
      "Upload class materials and assignments and let our AI deconstruct them into manageable tasks",
  },
  {
    id: 3,
    image: require("@/assets/images/GroupsGraphic.png"),
    title: "Match With Study Buddies",
    description:
      "Create a study profile and get matched with compatible study buddies in your classes for weekly study sessions",
  },
];

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function LoginScreen() {
  const theme = useTheme();
  const { isSignedIn, isLoaded, signOut, userId } = useAuth();
  const { user } = useUser();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const createUser = useMutation(api.mutations.createUser);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  useEffect(() => {
    if (isSignedIn) {
      router.replace("/(tabs)/events");
    }
  }, [isSignedIn]);

  const startCreateUser = useCallback(async () => {
    if (userId && user) {
      const newUserId = await createUser({
        clerkId: userId,
        email: user.primaryEmailAddress?.emailAddress || "",
        firstName: (user.firstName || "").split(" ")[0],
        lastName: user.lastName || "",
        completedOnboarding: false,
      });
      console.log("first time login, sending to onboarding");
    }
  }, [userId, user, createUser]);

  useEffect(() => {
    if (userId && user) {
      startCreateUser();
    }
  }, [userId, user]);

  const onLoginPress = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Platform.select({
          native: "your-app-scheme://oauth/callback",
          default: "http://localhost:3000",
        }),
      });
      if (createdSessionId) {
        setActive?.({ session: createdSessionId });
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, [startOAuthFlow]);

  return (
    <ScreenWrapper>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.background.get() }}
      >
        <View style={{ height: SCREEN_HEIGHT * 0.67 }}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
            onMomentumScrollEnd={(e) => {
              const newIndex = Math.round(
                e.nativeEvent.contentOffset.x / SCREEN_WIDTH
              );
              setCurrentIndex(newIndex);
            }}
          >
            {FEATURE_DATA.map((feature, index) => (
              <View key={feature.id} style={{ width: SCREEN_WIDTH }}>
                <View style={{ height: SCREEN_HEIGHT * 0.67 }}>
                  <Image
                    source={feature.image}
                    style={{
                      width: SCREEN_WIDTH,
                      height: "100%",
                      position: "absolute",
                    }}
                    resizeMode="cover"
                  />
                  <LinearGradient
                    colors={["transparent", theme.background.get()]}
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: SCREEN_HEIGHT * 0.5,
                    }}
                  />
                  <View
                    style={{
                      position: "absolute",
                      top: 4,
                      left: 0,
                      right: 0,
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={require("@/assets/images/LockedInLogoFull.png")}
                      style={{
                        width: 200,
                        height: 60,
                        marginBottom: 12,
                      }}
                      resizeMode="contain"
                    />
                  </View>
                  <View
                    style={{
                      position: "absolute",
                      bottom: 25,
                      left: 0,
                      right: 0,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: theme.color.get(),
                        fontSize: 24,
                        fontWeight: "bold",
                        marginBottom: 8,
                        textAlign: "center",
                      }}
                    >
                      {feature.title}
                    </Text>
                    <Text
                      style={{
                        color: theme.color.get(),
                        fontSize: 16,
                        textAlign: "center",
                        paddingHorizontal: 40,
                      }}
                    >
                      {feature.description}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          <View
            style={{
              flexDirection: "row",
              position: "absolute",
              bottom: -10,
              alignSelf: "center",
            }}
          >
            {FEATURE_DATA.map((_, index) => (
              <View
                key={index}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor:
                    currentIndex === index
                      ? theme.primary.get()
                      : theme.gray.get(),
                  marginHorizontal: 4,
                }}
              />
            ))}
          </View>
        </View>

        <View
          style={{
            flex: 1,
            paddingHorizontal: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            label="Get Started"
            onPress={onLoginPress}
            size="large"
            variant="primary"
            style={{
              width: "100%",
              marginBottom: 36,
            }}
          />
          <Text
            style={{
              color: theme.gray.get(),
              fontSize: 12,
              textAlign: "center",
              marginTop: 16,
              paddingHorizontal: 40,
            }}
          >
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </SafeAreaView>
    </ScreenWrapper>
  );
}
