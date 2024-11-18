import { useOAuth, useAuth } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import { H2 } from "tamagui";
import { Button } from "@/components/CustomButton";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useCallback, useState } from "react";
import { Platform } from "react-native";
import { CheckIcon, TasksIcon, XIcon } from "@/app/components/icons";
import { CircleIconButton } from "@/components/CircleIconButton";

// This is important for OAuth flow
WebBrowser.maybeCompleteAuthSession();

export default function TasksScreen() {
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
  return (
    <ScreenWrapper>
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
      <CircleIconButton icon={CheckIcon} size="small" variant="primaryOff" />
      <CircleIconButton icon={CheckIcon} size="medium" variant="primaryOff" />
      <CircleIconButton icon={CheckIcon} size="large" variant="primaryOn" />
      <CircleIconButton icon={XIcon} size="small" variant="secondaryOff" />
      <CircleIconButton icon={XIcon} size="medium" variant="secondaryOff" />
      <CircleIconButton icon={XIcon} size="large" variant="secondaryOn" />
    </ScreenWrapper>
  );
}
