import * as WebBrowser from "expo-web-browser";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { Text } from "tamagui";
WebBrowser.maybeCompleteAuthSession();

export default function TasksScreen() {
  return (
    <ScreenWrapper>
      <Text>Tasks</Text>
    </ScreenWrapper>
  );
}
