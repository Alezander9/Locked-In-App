import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/CustomButton";
import { YStack, XStack, H2, Separator } from "tamagui";

export default function TabTwoScreen() {
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
      <YStack space="$4" padding="$4">
        <H2>Primary Buttons</H2>
        <XStack space="$4" flexWrap="wrap">
          <Button size="small" label="Small" />
          <Button size="medium" label="Medium" />
          <Button size="large" label="Large" />
        </XStack>

        <Separator marginVertical="$4" />

        <H2>Secondary Buttons</H2>
        <XStack space="$4" flexWrap="wrap">
          <Button variant="secondary" size="small" label="Small" />
          <Button variant="secondary" size="medium" label="Medium" />
          <Button variant="secondary" size="large" label="Large" />
        </XStack>

        <Separator marginVertical="$4" />

        <H2>Disabled Buttons</H2>
        <XStack space="$4" flexWrap="wrap">
          <Button disabled size="small" label="Small" />
          <Button disabled size="medium" label="Medium" />
          <Button disabled size="large" label="Large" />
        </XStack>

        <Separator marginVertical="$4" />

        <H2>Full Width Buttons</H2>
        <YStack space="$4">
          <Button width="100%" label="Primary Full Width" />
          <Button
            width="100%"
            variant="secondary"
            label="Secondary Full Width"
          />
          <Button width="100%" disabled label="Disabled Full Width" />
        </YStack>

        <Separator marginVertical="$4" />
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
