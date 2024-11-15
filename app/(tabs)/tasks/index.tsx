import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/CustomButton";
import { YStack, XStack, H2, H3, Separator, Theme } from "tamagui";

function ButtonSet({ title }: { title: string }) {
  return (
    <>
      <H3 color="$color">{title}</H3>
      <YStack space="$4" marginBottom="$4">
        <Button size="small" label="Small" />
        <Button size="medium" label="Medium" />
        <Button size="large" label="Large" />
      </YStack>

      <YStack space="$4" marginBottom="$4">
        <Button variant="secondary" size="small" label="Small" />
        <Button variant="secondary" size="medium" label="Medium" />
        <Button variant="secondary" size="large" label="Large" />
      </YStack>

      <YStack space="$4" marginBottom="$4">
        <Button disabled size="small" label="Small" />
        <Button disabled size="medium" label="Medium" />
        <Button disabled size="large" label="Large" />
      </YStack>

      <YStack space="$4" marginBottom="$4">
        <Button width="100%" label="Primary Full Width" />
        <Button width="100%" variant="secondary" label="Secondary Full Width" />
        <Button width="100%" disabled label="Disabled Full Width" />
      </YStack>
    </>
  );
}

export default function TasksScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Ionicons size={310} name="code-slash" style={styles.headerImage} />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore</ThemedText>
      </ThemedView>
      <YStack padding="$4" space="$6">
        <H2 color="$color">Current Theme Buttons</H2>
        <ButtonSet title="System Theme" />

        <Separator marginVertical="$4" />

        <H2 color="$color">Theme Preview</H2>

        <XStack space="$4" flexWrap="wrap">
          <Theme name="light">
            <YStack
              flex={1}
              space="$4"
              backgroundColor="$bg"
              padding="$4"
              borderRadius="$2"
            >
              <ButtonSet title="Light Theme" />
            </YStack>
          </Theme>

          <Theme name="dark">
            <YStack
              flex={1}
              space="$4"
              backgroundColor="$bg"
              padding="$4"
              borderRadius="$2"
            >
              <ButtonSet title="Dark Theme" />
            </YStack>
          </Theme>
        </XStack>
      </YStack>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
