import * as WebBrowser from "expo-web-browser";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { Text, YStack, XStack, useTheme } from "tamagui";
import {
  CourseSearchBar,
  Course,
} from "@/components/searchBar/CourseSearchBar";
import { useToast } from "@/features/toast";
import { Button } from "@/components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { WriteIcon } from "@/app/components/icons";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
WebBrowser.maybeCompleteAuthSession();

export default function TasksScreen() {
  const handleCourseSelect = (course: Course) => {
    console.log("Selected course:", course);
  };

  const { showToast } = useToast();
  const theme = useTheme();

  const handleMakeTasks = () => {
    router.push({
      pathname: "/(modals)/create-tasks",
      params: {
        presentation: "modal",
      },
    });
  };

  return (
    <ScreenWrapper>
      <SafeAreaView style={{ flex: 1 }}>
        <YStack flex={1}>
          <XStack
            marginLeft={50}
            marginRight={50}
            justifyContent="space-between"
            alignItems="center"
          >
            <CourseSearchBar onCourseSelect={handleCourseSelect} />
            <TouchableOpacity
              onPress={handleMakeTasks}
              style={{
                paddingLeft: 6,
                paddingRight: 12,
                paddingVertical: 6,
              }}
            >
              <WriteIcon size={26} color={theme.color.val} />
            </TouchableOpacity>
          </XStack>
        </YStack>
      </SafeAreaView>
    </ScreenWrapper>
  );
}
