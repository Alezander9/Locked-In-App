import { Stack, XStack, YStack, Text } from "tamagui";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEventFormStore } from "@/stores/eventFormStore";
import { useTaskFormStore } from "@/stores/taskFormStore";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { SafeAreaView } from "react-native-safe-area-context";

interface DateTimeInputParams {
  title: string;
  taskIndex?: string; // Optional - if present, we're editing a task
}

export default function DateTimeInputModal() {
  const params = useLocalSearchParams<DateTimeInputParams>();

  // Get appropriate initial date and update function based on context
  const isTaskMode = params.taskIndex !== undefined;
  const taskStore = useTaskFormStore();
  const eventStore = useEventFormStore();

  const initialDate = isTaskMode
    ? taskStore.tasks[parseInt(params.taskIndex || "0")].dueDate
    : eventStore.startDate;

  const [date, setDate] = useState(initialDate);

  const handleSave = () => {
    if (isTaskMode && params.taskIndex) {
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
              mode={isTaskMode ? "date" : "datetime"} // Only date for tasks
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
