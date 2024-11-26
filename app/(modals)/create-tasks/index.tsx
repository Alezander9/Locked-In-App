import { Stack, YStack, XStack, Text } from "tamagui";
import { router } from "expo-router";
import { FormSection } from "@/components/forms/FormSection";
import { FormRowTextInput } from "@/components/forms/FormRowTextInput";
import { FormRow } from "@/components/forms/FormRow";
import { useTaskFormStore } from "@/stores/taskFormStore";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useToast } from "@/features/toast";
import { useEffect } from "react";
import { FormRowSelector } from "@/components/forms/FormRowSelector";

export default function CreateTasksModal() {
  const { tasks, updateTask, isTaskComplete, resetForm, addTask } =
    useTaskFormStore();
  const { showToast } = useToast();
  const courses = useQuery(api.queries.getUserCourses) || [];

  // Check if we need to add a new task section
  useEffect(() => {
    const lastIndex = tasks.length - 1;
    if (isTaskComplete(lastIndex)) {
      addTask();
    }
  }, [tasks, isTaskComplete, addTask]);

  const formatDate = (date: Date): string => {
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Handle field updates with automatic focus management
  const handleFieldUpdate = (
    index: number,
    field: keyof (typeof tasks)[0],
    value: any
  ) => {
    updateTask(index, field, value);
  };

  const handleSave = async () => {
    try {
      // Only save completed tasks (exclude the empty last one)
      const completedTasks = tasks.filter((_, index) => isTaskComplete(index));

      if (completedTasks.length === 0) {
        showToast({
          message: "Please complete at least one task",
        });
        return;
      }

      // TODO: Replace with actual API call
      // await createTasks({
      //   tasks: completedTasks.map(task => ({
      //     ...task,
      //     dueDate: task.dueDate.getTime(),
      //   })),
      // });

      showToast({
        message: "Tasks created successfully",
      });

      resetForm();
      router.back();
    } catch (error) {
      showToast({
        message: "Failed to create tasks. Please try again.",
      });
      console.error("Failed to create tasks:", error);
    }
  };

  const handleCancel = () => {
    resetForm();
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
              onPress={handleCancel}
              color="$primary"
              fontSize="$4"
              padding="$4"
              width={100}
              textAlign="left"
            >
              Cancel
            </Text>
            <Text fontSize="$4" fontWeight="$4">
              Create Tasks
            </Text>
            <Text
              onPress={handleSave}
              color="$primary"
              fontSize="$4"
              padding="$4"
              width={100}
              textAlign="right"
            >
              Save
            </Text>
          </XStack>

          <ScrollView>
            <YStack>
              {tasks.map((task, index) => (
                <FormSection key={index} title={`New Task ${index + 1}`}>
                  <FormRowSelector
                    label="Course"
                    value={
                      courses.find((c) => c._id === task.courseId)?.code || ""
                    }
                    onPress={() => {
                      router.push({
                        pathname: "/input/course-selector",
                        params: {
                          taskIndex: index.toString(),
                        },
                      });
                    }}
                  />
                  <FormRowTextInput
                    label="Title"
                    value={task.title}
                    onChangeText={(text) =>
                      handleFieldUpdate(index, "title", text)
                    }
                    placeholder="Enter task title..."
                  />
                  <FormRowTextInput
                    label="Notes"
                    value={task.notes}
                    onChangeText={(text) =>
                      handleFieldUpdate(index, "notes", text)
                    }
                    placeholder="Enter notes..."
                    multiline
                    numberOfLines={3}
                  />
                  <FormRow
                    label="Due Date"
                    value={formatDate(task.dueDate)}
                    onPress={() => {
                      router.push({
                        pathname: "/input/date-time",
                        params: {
                          title: "Due Date",
                          taskIndex: index.toString(),
                        },
                      });
                    }}
                  />
                </FormSection>
              ))}

              {/* Placeholder for AI Task Extraction Section */}
              <FormSection title="AI Task Extraction">
                <FormRow
                  label="Upload Document"
                  value="Coming soon"
                  onPress={() => {
                    showToast({
                      message: "File upload feature coming soon",
                    });
                  }}
                />
              </FormSection>
            </YStack>
          </ScrollView>
        </Stack>
      </SafeAreaView>
    </ScreenWrapper>
  );
}
