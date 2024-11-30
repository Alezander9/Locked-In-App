import { YStack } from "tamagui";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useState, useEffect } from "react";
import { WeeklyScheduleSelector } from "@/components/WeeklyScheduleSelector";
import { Button } from "@/components/buttons/CustomButton";
import { useRouter } from "expo-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// Add these type definitions
type TimeSlot = {
  hour: number;
  selected: boolean;
};

type DaySchedule = {
  day: string;
  timeSlots: TimeSlot[];
};

export default function ScheduleScreen() {
  const router = useRouter();
  const updateStudyProfile = useMutation(api.mutations.updateStudyProfile);
  const currentProfile = useQuery(api.queries.getStudyProfile, {
    userId: undefined,
  });

  // Initialize schedule state with FULL day names to match profile builder
  const [schedule, setSchedule] = useState<DaySchedule[]>(
    Array.from({ length: 7 }, (_, dayIndex) => ({
      day: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ][dayIndex],
      timeSlots: Array.from({ length: 24 }, (_, hour) => ({
        hour,
        selected: false,
      })),
    }))
  );

  useEffect(() => {
    if (currentProfile?.availableTimeSlots) {
      console.log(
        "Loading existing schedule:",
        currentProfile.availableTimeSlots
      );

      const newSchedule = schedule.map((day) => {
        // Find matching day in availableTimeSlots
        const availableDay = currentProfile.availableTimeSlots.find(
          (d) => d.day === day.day
        );

        console.log(
          `Processing ${day.day}:`,
          availableDay?.slots || "No slots"
        );

        const updatedTimeSlots = day.timeSlots.map((slot) => {
          const isSelected = availableDay?.slots.includes(slot.hour) ?? false;
          console.log(
            `Hour ${slot.hour}: ${isSelected ? "selected" : "not selected"}`
          );

          return {
            hour: slot.hour,
            selected: isSelected,
          };
        });

        return {
          day: day.day,
          timeSlots: updatedTimeSlots,
        };
      });

      console.log(
        "Setting new schedule with selected slots:",
        newSchedule.map((day) => ({
          day: day.day,
          selectedSlots: day.timeSlots
            .filter((slot) => slot.selected)
            .map((slot) => slot.hour),
        }))
      );

      setSchedule(newSchedule);
    }
  }, [currentProfile]);

  // Convert schedule format to availableTimeSlots format
  const convertScheduleToAvailableTimeSlots = (schedule: DaySchedule[]) => {
    return schedule
      .map((day) => ({
        day: day.day,
        slots: day.timeSlots
          .filter((slot) => slot.selected)
          .map((slot) => slot.hour),
      }))
      .filter((day) => day.slots.length > 0); // Only include days with selected slots
  };

  const handleSave = async () => {
    try {
      if (!currentProfile) return;

      // Create updated profile with new availableTimeSlots but keeping other fields
      const updatedProfile = {
        ...currentProfile,
        availableTimeSlots: convertScheduleToAvailableTimeSlots(schedule),
      };

      // Update the study profile
      await updateStudyProfile({
        studyProfile: updatedProfile,
      });

      // Return to settings
      router.back();
    } catch (error) {
      console.error("Failed to update schedule:", error);
    }
  };

  return (
    <ScreenWrapper>
      <YStack flex={1} padding="$4" space="$6">
        {/* Schedule Selector */}
        <YStack backgroundColor="$background" borderRadius="$4" padding="$4">
          <WeeklyScheduleSelector
            value={schedule}
            onChange={setSchedule}
            helperText="Tap and drag to select multiple time slots"
          />
        </YStack>

        {/* Adjust the flex spacer's minimum height */}
        <YStack flex={1} minHeight={20} />

        {/* Save Button Container - add padding bottom */}
        <YStack paddingBottom="$4">
          <Button
            size="large"
            variant="primary"
            label="Save Changes"
            onPress={handleSave}
            width="100%"
            backgroundColor="#0F9ED5"
          />
        </YStack>
      </YStack>
    </ScreenWrapper>
  );
}
