import { useOAuth, useAuth, useUser } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import { Button } from "@/components/CustomButton";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useCallback, useEffect, useState } from "react";
import { Platform, SafeAreaView } from "react-native";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { router } from "expo-router";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { isSignedIn, isLoaded, signOut, userId } = useAuth();
  const { user } = useUser();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const createUser = useMutation(api.mutations.createUser);

  useEffect(() => {
    if (isSignedIn) {
      console.log("isSignedIn", isSignedIn);
      router.replace("/(tabs)/events");
    }
  }, [isSignedIn]);

  const startCreateUser = useCallback(async () => {
    if (userId && user) {
      //   console.log("userId", userId);
      //   console.log("email", user.primaryEmailAddress?.emailAddress);
      //   console.log("firstName + middleName", user.firstName);
      //   console.log("lastName", user.lastName);

      const newUserId = await createUser({
        clerkId: userId,
        email: user.primaryEmailAddress?.emailAddress || "",
        firstName: (user.firstName || "").split(" ")[0],
        lastName: user.lastName || "",
      });
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

  const onLogoutPress = useCallback(async () => {
    try {
      await signOut();
    } catch (err) {
      console.error("Error signing out:", err);
    }
  }, [signOut]);

  return (
    <ScreenWrapper>
      <SafeAreaView style={{ flex: 1 }}>
        {!isSignedIn ? (
          <Button
            label="Sign in with Google"
            onPress={onLoginPress}
            size="large"
            variant="primary"
          />
        ) : (
          <Button
            label="Sign Out"
            onPress={onLogoutPress}
            size="large"
            variant="secondary"
          />
        )}
      </SafeAreaView>
    </ScreenWrapper>
  );
}
