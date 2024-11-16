import { H2 } from "tamagui";
import { Button } from "@/components/CustomButton";
import { ScreenWrapper } from "@/components/ScreenWrapper";

export default function TasksScreen() {
  return (
    <ScreenWrapper>
      <H2>Explore</H2>
      <Button size="large" label="Large" />
      <Button size="large" label="Large" variant="secondary" />
    </ScreenWrapper>
  );
}
