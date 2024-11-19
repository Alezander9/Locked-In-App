import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();

  // Still loading auth state - return null to keep splash screen visible
  if (!isLoaded) {
    return null;
  }

  // Auth state loaded - redirect appropriately
  if (isSignedIn) {
    console.log("signed in, redirecting to events");
    return <Redirect href="/(tabs)/events" />;
  } else {
    console.log("not signed in, redirecting to login");
    return <Redirect href="/(auth)/login" />;
  }
}
