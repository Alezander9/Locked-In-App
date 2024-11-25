import { Stack, XStack, YStack, Text } from "tamagui";
import { router } from "expo-router";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEventFormStore } from "@/stores/eventFormStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenWrapper } from "@/components/ScreenWrapper";

export default function DurationInputModal() {
  const duration = useEventFormStore((state) => state.duration);
  const updateField = useEventFormStore((state) => state.updateField);

  const handleSave = () => {
    // Get hours and minutes from the selected date
    const minutes = selectedDate.getHours() * 60 + selectedDate.getMinutes();
    updateField("duration", minutes);
    router.back();
  };

  const [selectedDate, setSelectedDate] = useState(
    new Date(1970, 0, 1, Math.floor(duration / 60), duration % 60)
  );

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
              Duration
            </Text>
            <Text color="$primary" onPress={handleSave} fontSize="$4">
              Done
            </Text>
          </XStack>

          <YStack f={1} p="$4" justifyContent="center" alignItems="center">
            <DateTimePicker
              value={selectedDate}
              mode="countdown"
              display="spinner"
              onChange={(_, date) => {
                if (date) setSelectedDate(date);
              }}
              minuteInterval={5}
            />
          </YStack>
        </Stack>
      </SafeAreaView>
    </ScreenWrapper>
  );
}
