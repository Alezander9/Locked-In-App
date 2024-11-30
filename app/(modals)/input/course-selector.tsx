import { Stack, XStack, YStack, Text } from "tamagui";
import { router, useLocalSearchParams } from "expo-router";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useTaskFormStore } from "@/stores/taskFormStore";
import { useEditTaskStore } from "@/stores/editTaskStore";
import { Id } from "@/convex/_generated/dataModel";
import { FormActionButton } from "@/components/forms/FormActionButton";

type CourseSelectorParams = {
  taskIndex: string;
} & Record<string, string>;

export default function CourseSelectorModal() {
  const params = useLocalSearchParams<CourseSelectorParams>();
  const { updateTask } = useTaskFormStore();
  const { updateField } = useEditTaskStore();
  const userCourses = useQuery(api.queries.getUserCourses) || [];

  const isEditMode = params.taskIndex === "edit";
  const taskIndex =
    params.taskIndex === "file"
      ? "file"
      : isEditMode
        ? "edit"
        : parseInt(params.taskIndex || "0");

  const handleSelect = (courseId: Id<"courses"> | undefined) => {
    if (!courseId) return;

    if (isEditMode) {
      updateField("courseId", courseId);
    } else {
      updateTask(taskIndex, "courseId", courseId);
    }

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
              <FormActionButton
                label="Add or Edit Classes"
                onPress={() => router.push("/edit-classes")}
              />
            </YStack>
          </ScrollView>
        </Stack>
      </SafeAreaView>
    </ScreenWrapper>
  );
}
