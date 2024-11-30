import { Stack, YStack, XStack, Text } from "tamagui";
import { router } from "expo-router";
import { FormSection } from "@/components/forms/FormSection";
import { FormRow } from "@/components/forms/FormRow";
import { useEventFormStore } from "@/stores/eventFormStore";
import { ScreenWrapper } from "@/components/background/ScreenWrapper";
import { SafeAreaView } from "react-native-safe-area-context";
import { FormRowTextInput } from "@/components/forms/FormRowTextInput";
import { FormRowToggle } from "@/components/forms/FormRowToggle";
import { ScrollView } from "react-native";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useToast } from "@/features/toast";

export default function CreateEventModal() {
  const {
    name,
    description,
    startDate,
    duration,
    location,
    isPublic,
    updateField,
    resetForm,
  } = useEventFormStore();
  const { showToast } = useToast();

  const createEvent = useMutation(api.mutations.createEvent);

  const formatDate = (date: Date): string => {
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    // Handle edge cases
    if (minutes === 0) return "0 minutes";
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"}`;

    // Format hours only (no minutes)
    if (mins === 0) {
      return `${hours} hour${hours === 1 ? "" : "s"}`;
    }

    // Format hours and minutes
    return `${hours} hour${hours === 1 ? "" : "s"} ${mins} minute${mins === 1 ? "" : "s"}`;
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!name.trim()) {
        showToast({
          message: "Event name is required",
        });
        return;
      }

      // Convert startDate to timestamp
      const timestamp = startDate.getTime();

      await createEvent({
        title: name.trim(),
        description: description.trim(),
        location: location.trim(),
        date: timestamp,
        duration: duration,
        isPublic: isPublic,
      });

      showToast({
        message: "Event created successfully",
      });

      resetForm();
      router.back();
    } catch (error) {
      showToast({
        message: "Failed to create event. Please try again.",
      });
      console.error("Failed to create event:", error);
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
              Create Event
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
              <FormSection title="Event Details">
                <FormRowTextInput
                  label="Name"
                  value={name}
                  onChangeText={(text) => updateField("name", text)}
                  placeholder="Enter name..."
                />
                <FormRowTextInput
                  label="Description"
                  value={description}
                  onChangeText={(text) => updateField("description", text)}
                  placeholder="Enter description..."
                  multiline
                  numberOfLines={3}
                />
                <FormRowTextInput
                  label="Location"
                  value={location}
                  onChangeText={(text) => updateField("location", text)}
                  placeholder="Enter location..."
                />
              </FormSection>

              <FormSection title="Schedule">
                <FormRow
                  label="Start Date & Time"
                  value={formatDate(startDate)}
                  onPress={() => {
                    router.push({
                      pathname: "/input/date-time",
                      params: {
                        title: "Start Date & Time",
                      },
                    });
                  }}
                />
                <FormRow
                  label="Duration"
                  value={formatDuration(duration)}
                  onPress={() => {
                    router.push({
                      pathname: "/input/duration",
                      params: {
                        title: "Duration",
                      },
                    });
                  }}
                />
              </FormSection>

              <FormSection title="Visibility">
                <FormRowToggle
                  label="Public Event"
                  value={isPublic}
                  onValueChange={(value) => updateField("isPublic", value)}
                  description="Public events are visible to all users. Private events are only visible to invited participants."
                  checkedLabel="Public"
                  uncheckedLabel="Private"
                />
              </FormSection>
            </YStack>
          </ScrollView>
        </Stack>
      </SafeAreaView>
    </ScreenWrapper>
  );
}
