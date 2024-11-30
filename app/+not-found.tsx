import { ScreenWrapper } from "@/components/ScreenWrapper";
import { Link, router, Stack } from "expo-router";
import { SafeAreaView, StyleSheet } from "react-native";
import { H4 } from "tamagui";
import { Button } from "@/components/buttons/CustomButton";

export default function NotFoundScreen() {
  return (
    <ScreenWrapper>
      <SafeAreaView
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <Stack.Screen options={{ title: "Oops!" }} />
        <H4 style={{ marginBottom: 20 }}>This screen doesn't exist.</H4>
        <Button
          onPress={() => router.push("/")}
          label="Go to home screen!"
          size="large"
        />
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
