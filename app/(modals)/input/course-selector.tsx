import { Stack, XStack, YStack, Text } from "tamagui";
import { router, useLocalSearchParams } from "expo-router";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useTaskFormStore } from "@/stores/taskFormStore";
import { Id } from "@/convex/_generated/dataModel";

interface CourseSelectorParams {
  taskIndex: string;
}

interface CourseWithColor {
  _id: Id<"courses">;
  code: string;
  title: string;
  color?: string;
}

export default function CourseSelectorModal() {
  const params = useLocalSearchParams<CourseSelectorParams>();
  const taskIndex = parseInt(params.taskIndex || "0");
  const { updateTask } = useTaskFormStore();

  // Query user's courses
  const userCourses = useQuery(api.queries.getUserCourses) || [];

  const handleSelect = (courseId: Id<"courses"> | undefined) => {
    if (!courseId) return;
    updateTask(taskIndex, "courseId", courseId);
    router.back();
  };

  return (
    <ScreenWrapper>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack f={1} bg="$bg">
          <XStack
            borderBottomColor="$borderColor"
            borderBottomWidth={1}
            justifyContent="space-between"
            alignItems="center"
            marginBottom="$4"
          >
            <Text
              onPress={() => router.back()}
              color="$primary"
              fontSize="$4"
              padding="$4"
              width={100}
              textAlign="left"
            >
              Cancel
            </Text>
            <Text fontSize="$4" fontWeight="$4">
              Select Course
            </Text>
            <Text width={100} />
          </XStack>

          <ScrollView>
            <YStack>
              {userCourses.map((course) => (
                <XStack
                  key={course._id}
                  pressStyle={{ opacity: 0.7 }}
                  onPress={() => handleSelect(course._id)}
                  padding="$4"
                  borderBottomWidth={1}
                  borderBottomColor="$borderColor"
                  alignItems="center"
                >
                  {/* Color indicator */}
                  <Stack
                    width={12}
                    height={12}
                    borderRadius={6}
                    backgroundColor={course.color || "$gray"}
                    marginRight="$3"
                  />
                  <YStack flex={1}>
                    <Text fontSize="$4" marginBottom="$1">
                      {course.code}
                    </Text>
                    <Text fontSize="$3" color="$gray">
                      {course.title}
                    </Text>
                  </YStack>
                </XStack>
              ))}

              {/* Add Classes Button */}
              <XStack
                pressStyle={{ opacity: 0.7 }}
                onPress={() => {
                  router.push("/edit-classes");
                }}
                padding="$4"
                marginTop="$4"
                backgroundColor="$lightSeparator"
                borderRadius="$4"
                margin="$4"
                justifyContent="center"
              >
                <Text color="$primary" fontSize="$4">
                  Add or Edit Classes
                </Text>
              </XStack>
            </YStack>
          </ScrollView>
        </Stack>
      </SafeAreaView>
    </ScreenWrapper>
  );
}
