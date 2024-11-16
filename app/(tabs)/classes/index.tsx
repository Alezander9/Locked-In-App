import { StyleSheet, Button, Platform } from "react-native";
import { api } from "@/convex/_generated/api";
import { useOAuth, useAuth } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useState } from "react";
import { useQuery } from "convex/react";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { H1, H2, H3, XStack, YStack } from "tamagui";
import { Course, SearchBar } from "@/components/SearchBar";

// This is important for OAuth flow
WebBrowser.maybeCompleteAuthSession();

export default function ClassesScreen() {
  const tasks = useQuery(api.queries.getTasks);
  const { isSignedIn, isLoaded, signOut } = useAuth();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onLoginPress = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Platform.select({
          native: "your-app-scheme://oauth/callback",
          default: "http://localhost:3000",
        }),
        // This code does not work, fix later
        // Add restrictions for Google OAuth
        // strategy: "oauth_google",
        // allowedRedirectURIs: Platform.select({
        //   native: ["your-app-scheme://oauth/callback"],
        //   default: ["http://localhost:3000"],
        // }),
        // additionalScopes: ["email"], // Make sure email scope is included
        // emailAddress: "*@stanford.edu", // Restrict to specific domain
      });

      if (createdSessionId) {
        setActive?.({ session: createdSessionId });
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, [startOAuthFlow]);

  const onLogoutPress = useCallback(async () => {
    try {
      await signOut();
    } catch (err) {
      console.error("Error signing out:", err);
    }
  }, [signOut]);

  const handleCourseSelect = (course: Course) => {
    // Handle course selection here
    console.log("Selected course:", course);
  };

  return (
    <ScreenWrapper>
      <YStack flex={1} backgroundColor="$background">
        <SearchBar onCourseSelect={handleCourseSelect} />
      </YStack>

      <H3>Welcome!</H3>
      <H2>Test 1: connect to Convex</H2>
      <H1>If connected, you should see tasks below.</H1>
      {tasks?.map((task) => <H1 key={task._id}>{task.text}</H1>)}
      <H2>Test 2: Sign in with Clerk</H2>
      <H1>
        {isLoaded
          ? isSignedIn
            ? "You are signed in!"
            : "Please sign in."
          : "Loading..."}
      </H1>
      {!isSignedIn ? (
        <Button title="Sign in with Google" onPress={onLoginPress} />
      ) : (
        <Button title="Sign Out" onPress={onLogoutPress} color="red" />
      )}
      {/* <CustomButton>Default Button</CustomButton> */}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
