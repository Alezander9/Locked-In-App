import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/CustomButton";
import { ScreenWrapper } from "@/components/ScreenWrapper";

export default function TasksScreen() {
  return (
    <ScreenWrapper>
      <ThemedText type="title">Explore</ThemedText>
      <Button size="large" label="Large" />
      <Button size="large" label="Large" variant="secondary" />
    </ScreenWrapper>
  );
}
