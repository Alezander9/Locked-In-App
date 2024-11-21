import * as WebBrowser from "expo-web-browser";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { Text } from "tamagui";
import {
  CourseSearchBar,
  Course,
} from "@/components/searchBar/CourseSearchBar";

WebBrowser.maybeCompleteAuthSession();

export default function TasksScreen() {
  const handleCourseSelect = (course: Course) => {
    console.log("Selected course:", course);
  };

  return (
    <ScreenWrapper>
      <Text>Tasks</Text>
      <CourseSearchBar onCourseSelect={handleCourseSelect} />
    </ScreenWrapper>
  );
}
