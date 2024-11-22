import { Stack, XStack, YStack, Text } from "tamagui";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEventFormStore } from "@/stores/eventFormStore";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { SafeAreaView } from "react-native-safe-area-context";

interface DateTimeInputParams {
  title: string;
}

export default function DateTimeInputModal() {
  const params = useLocalSearchParams<DateTimeInputParams>();
  const startDate = useEventFormStore((state) => state.startDate);
  const updateField = useEventFormStore((state) => state.updateField);
  const [date, setDate] = useState(startDate);

  const handleSave = () => {
    updateField("startDate", date);
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
