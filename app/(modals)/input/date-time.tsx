import { Stack, XStack, YStack, Text } from "tamagui";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEventFormStore } from "@/stores/eventFormStore";
import { useTaskFormStore } from "@/stores/taskFormStore";
import { useEditTaskStore } from "@/stores/editTaskStore";
import { ScreenWrapper } from "@/components/background/ScreenWrapper";
import { SafeAreaView } from "react-native-safe-area-context";

type DateTimeInputParams = {
  title: string;
  taskIndex?: string; // Can be a number for create, "edit" for edit mode, or undefined for event
} & Record<string, string>;

export default function DateTimeInputModal() {
  const params = useLocalSearchParams<DateTimeInputParams>();
  const taskStore = useTaskFormStore();
  const eventStore = useEventFormStore();
  const editStore = useEditTaskStore();

  // Determine the mode and get initial date
  const isTaskMode = params.taskIndex !== undefined;
  const isEditMode = params.taskIndex === "edit";

  const initialDate = (() => {
    if (isEditMode) {
      return editStore.task?.dueDate || new Date();
    } else if (isTaskMode) {
      return taskStore.tasks[parseInt(params.taskIndex || "0")].dueDate;
    } else {
      return eventStore.startDate;
    }
  })();

  const [date, setDate] = useState(initialDate);

  const handleSave = () => {
    if (isEditMode) {
      editStore.updateField("dueDate", date);
    } else if (isTaskMode && params.taskIndex) {
      taskStore.updateTask(parseInt(params.taskIndex), "dueDate", date);
    } else {
      eventStore.updateField("startDate", date);
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
            p="$4"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text color="$primary" onPress={() => router.back()} fontSize="$4">
              Cancel
            </Text>
            <Text fontSize="$4" fontWeight="$4">
              {params.title}
            </Text>
            <Text color="$primary" onPress={handleSave} fontSize="$4">
              Done
            </Text>
          </XStack>
          <YStack f={1} p="$4" justifyContent="center" alignItems="center">
            <DateTimePicker
              value={date}
              mode="datetime"
              display="spinner"
              onChange={(_, selectedDate) => {
                if (selectedDate) setDate(selectedDate);
              }}
            />
          </YStack>
        </Stack>
      </SafeAreaView>
    </ScreenWrapper>
  );
}
