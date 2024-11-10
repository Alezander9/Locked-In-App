import { Image, StyleSheet, Button, Platform } from "react-native";
import { api } from "@/convex/_generated/api";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useOAuth, useAuth } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import { useCallback } from "react";
import { useQuery } from "convex/react";

// This is important for OAuth flow
WebBrowser.maybeCompleteAuthSession();

export default function HomeScreen() {
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
        // Add restrictions for Google OAuth
        strategy: "oauth_google",
        allowedRedirectURIs: Platform.select({
          native: ["your-app-scheme://oauth/callback"],
          default: ["http://localhost:3000"],
        }),
        additionalScopes: ["email"], // Make sure email scope is included
        emailAddress: "*@stanford.edu", // Restrict to specific domain
      });

      if (createdSessionId) {
        setActive({ session: createdSessionId });
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

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Test 1: connect to Convex</ThemedText>
        <ThemedText>If connected, you should see tasks below.</ThemedText>
        {tasks?.map((task) => (
          <ThemedText key={task._id}>{task.text}</ThemedText>
        ))}
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Test 2: Sign in with Clerk</ThemedText>
        <ThemedText>
          {isLoaded
            ? isSignedIn
              ? "You are signed in!"
              : "Please sign in."
            : "Loading..."}
        </ThemedText>
        {!isSignedIn ? (
          <Button title="Sign in with Google" onPress={onLoginPress} />
        ) : (
          <Button title="Sign Out" onPress={onLogoutPress} color="red" />
        )}
      </ThemedView>
    </ParallaxScrollView>
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
