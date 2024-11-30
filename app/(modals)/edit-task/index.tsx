import { Stack, XStack, YStack, Text } from "tamagui";
import { router, useLocalSearchParams } from "expo-router";
import { ScreenWrapper } from "@/components/background/ScreenWrapper";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { FormSection } from "@/components/forms/FormSection";
import { FormRowTextInput } from "@/components/forms/FormRowTextInput";
import { FormRow } from "@/components/forms/FormRow";
import { FormActionButton } from "@/components/forms/FormActionButton";
import { useToast } from "@/features/toast";
import { useEditTaskStore } from "@/stores/editTaskStore";
import { format } from "date-fns";
import { FormRowSelector } from "@/components/forms/FormRowSelector";
import { useEffect } from "react";
import { Keyboard } from "react-native";
type EditTaskParams = {
  taskId: string;
} & Record<string, string>;

export default function EditTaskModal() {
  const params = useLocalSearchParams<EditTaskParams>();
  const taskId = params.taskId as Id<"tasks">;
  const { showToast } = useToast();
  const { task, updateField, setTask, resetForm, isTaskValid } =
    useEditTaskStore();

  const courses = useQuery(api.queries.getUserCourses) || [];

  const updateTask = useMutation(api.mutations.updateTask);
  const deleteTask = useMutation(api.mutations.deleteTask);
  const restoreTask = useMutation(api.mutations.restoreTask);

  // Fetch task details
  const taskDetails = useQuery(api.queries.getTask, { taskId });

  // Set initial task data when details are loaded
  useEffect(() => {
    if (taskDetails && !task) {
      setTask({
        courseId: taskDetails.courseId,
        title: taskDetails.title,
        notes: taskDetails.notes,
        dueDate: new Date(taskDetails.dueDate),
      });
    }
  }, [taskDetails, setTask]);

  const handleSave = async () => {
    Keyboard.dismiss();

    if (!task || !isTaskValid()) {
      showToast({
        message: "Please fill in all required fields",
      });
      return;
    }

    try {
      await updateTask({
        taskId,
        courseId: task.courseId,
        title: task.title,
        notes: task.notes,
        dueDate: task.dueDate.getTime(),
      });

      showToast({
        message: "Task updated successfully",
      });

      resetForm();
      router.back();
    } catch (error) {
      showToast({
        message: "Failed to update task. Please try again.",
      });
      console.error("Failed to update task:", error);
    }
  };

  const handleDelete = async () => {
    if (!task) {
      return;
    }

    try {
      // Store the task data before deletion
      const taskToRestore = {
        _id: taskId,
        courseId: task.courseId,
        title: task.title,
        notes: task.notes,
        dueDate: task.dueDate,
        isCompleted: taskDetails?.isCompleted || false,
      };

      await deleteTask({
        taskId,
      });

      showToast({
        message: "Task deleted",
        action: {
          label: "Undo",
          onPress: async () => {
            try {
              await restoreTask({
                taskId,
                courseId: taskToRestore.courseId,
                title: taskToRestore.title,
                notes: taskToRestore.notes,
                dueDate: taskToRestore.dueDate.getTime(),
                isCompleted: taskToRestore.isCompleted,
              });

              showToast({
                message: "Task restored",
              });
            } catch (error) {
              showToast({
                message: "Failed to restore task. Please try again.",
              });
              console.error("Failed to restore task:", error);
            }
          },
        },
        duration: 5000,
      });

      resetForm();
      router.back();
    } catch (error) {
      showToast({
        message: "Failed to delete task. Please try again.",
      });
      console.error("Failed to delete task:", error);
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  if (!task || !taskDetails) {
    return null;
  }

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
              onPress={() => {
                resetForm();
                router.back();
              }}
              color="$primary"
              fontSize="$4"
              padding="$4"
              width={100}
              textAlign="left"
            >
              Cancel
            </Text>
            <Text fontSize="$4" fontWeight="$4">
              Edit Task
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
              <FormSection>
                <FormRowSelector
                  label="Course"
                  value={
                    courses.find((c) => c._id === task.courseId)?.code || ""
                  }
                  onPress={() => {
                    router.push({
                      pathname: "/input/course-selector",
                      params: {
                        taskIndex: "edit",
                      },
                    });
                  }}
                />
                <FormRowTextInput
                  label="Title"
                  value={task.title}
                  onChangeText={(text) => updateField("title", text)}
                  placeholder="Enter task title..."
                />
                <FormRowTextInput
                  label="Notes"
                  value={task.notes}
                  onChangeText={(text) => updateField("notes", text)}
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
                        taskIndex: "edit",
                      },
                    });
                  }}
                />
              </FormSection>

              <FormActionButton
                label="Delete Task"
                onPress={handleDelete}
                color="$danger"
              />
            </YStack>
          </ScrollView>
        </Stack>
      </SafeAreaView>
    </ScreenWrapper>
  );
}
