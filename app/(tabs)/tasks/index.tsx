import * as WebBrowser from "expo-web-browser";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { Text } from "tamagui";
import {
  CourseSearchBar,
  Course,
} from "@/components/searchBar/CourseSearchBar";
import { useToast } from "@/features/toast";
import { Button } from "@/components/CustomButton";
WebBrowser.maybeCompleteAuthSession();

export default function TasksScreen() {
  const handleCourseSelect = (course: Course) => {
    console.log("Selected course:", course);
  };

  const { showToast } = useToast();

  const handleAction = () => {
    showToast({
      message: "Action completed successfully",
      action: {
        label: "UNDO",
        onPress: () => console.log("Undo pressed"),
      },
      duration: 5000, // optional, defaults to 3000ms
    });
  };

  return (
    <ScreenWrapper>
      <Text>Tasks</Text>
      <CourseSearchBar onCourseSelect={handleCourseSelect} />
      <Button label="Show Toast" onPress={handleAction} size="large" />
    </ScreenWrapper>
  );
}
