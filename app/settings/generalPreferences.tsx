import { YStack, Text } from "tamagui";
import { ScreenWrapper } from "@/components/background/ScreenWrapper";
import { useState, useEffect } from "react";
import { Button } from "@/components/buttons/CustomButton";
import { useRouter } from "expo-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LearningPreferencesGrid } from "@/app/(tabs)/groups/LearningPreferencesGrid";
import { Slider } from "@miblanchard/react-native-slider";
import { View } from "react-native";

// Custom slider component directly in this file
function CustomStudyHabitSlider({
  label,
  value,
  minimumValue,
  maximumValue,
  step,
  onValueChange,
  sliderType,
}: {
  label: string;
  value: number;
  minimumValue: number;
  maximumValue: number;
  step: number;
  onValueChange: (value: number) => void;
  sliderType: "alertness" | "punctuality";
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Force a re-render after mount
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const getLabel = (type: string, value: number) => {
    if (type === "alertness") {
      switch (value) {
        case 0:
          return "Morning Person";
        case 1:
          return "Flexible";
        case 2:
          return "Night Owl";
        default:
          return "";
      }
    } else {
      switch (value) {
        case 0:
          return "Early";
        case 1:
          return "On Time";
        case 2:
          return "Running Late";
        default:
          return "";
      }
    }
  };

  if (!mounted) {
    return null; // or a loading placeholder
  }

  return (
    <YStack space="$1">
      <Text fontSize="$3" fontWeight="600" color="$gray">
        {label}
      </Text>
      <YStack width="100%">
        <View style={{ width: "100%", height: 40 }}>
          <Slider
            key={`slider-${mounted}`} // Add a key to force re-render
            value={value}
            onValueChange={([value]) => onValueChange(value as number)}
            minimumValue={minimumValue}
            maximumValue={maximumValue}
            step={step}
            thumbTintColor="#0F9ED5"
            minimumTrackTintColor="#0F9ED5"
            maximumTrackTintColor="#E5E5E5"
          />
        </View>
        <Text
          fontSize="$3"
          color="$gray10"
          style={{
            width: 120,
            alignSelf: "flex-end",
            textAlign: "right",
            paddingRight: 16,
          }}
        >
          {getLabel(sliderType, value)}
        </Text>
      </YStack>
    </YStack>
  );
}

// Learning options constant from profile builder
const LEARNING_OPTIONS = [
  { id: "textbook", label: "Reading the textbook" },
  { id: "lectures", label: "Attending lectures" },
  { id: "recordings", label: "Watching recorded lectures" },
  { id: "practice", label: "Doing practice / homework problems" },
  { id: "office_hours", label: "Attending office hours" },
  { id: "discussing", label: "Discussing with students" },
  { id: "essays", label: "Writing essays" },
  { id: "llm", label: "Talking to a LLM" },
  { id: "creating_notes", label: "Creating notes/flashcards/study guides" },
  {
    id: "reading_notes",
    label: "Reading others' notes/flashcards/study guides",
  },
  { id: "teaching", label: "Teaching other students" },
  { id: "projects", label: "Doing independent projects" },
];

export default function GeneralPreferencesScreen() {
  const router = useRouter();
  const updateStudyProfile = useMutation(api.mutations.updateStudyProfile);
  const currentProfile = useQuery(api.queries.getStudyProfile, {
    userId: undefined,
  });

  const [preferences, setPreferences] = useState({
    alertnessPreference: 1,
    punctualityPreference: 1,
    learningPreferences: {},
  });

  useEffect(() => {
    if (currentProfile) {
      setPreferences({
        alertnessPreference: currentProfile.alertnessPreference ?? 1,
        punctualityPreference: currentProfile.punctualityPreference ?? 1,
        learningPreferences: currentProfile.learningPreferences ?? {},
      });
    }
  }, [currentProfile]);

  const handleSave = async () => {
    try {
      if (!currentProfile) return;

      const updatedProfile = {
        ...currentProfile,
        alertnessPreference: preferences.alertnessPreference,
        punctualityPreference: preferences.punctualityPreference,
        learningPreferences: preferences.learningPreferences,
      };

      await updateStudyProfile({
        studyProfile: updatedProfile,
      });

      router.back();
    } catch (error) {
      console.error("Failed to update preferences:", error);
    }
  };

  return (
    <ScreenWrapper>
      <YStack flex={1} padding="$4" space="$4">
        {/* General Study Habits Section */}
        <YStack backgroundColor="$background" borderRadius="$4" padding="$4">
          <YStack space="$4">
            <Text fontSize="$4" fontWeight="bold">
              Study Habits
            </Text>

            <CustomStudyHabitSlider
              label="Do you feel more alert in the morning or in the evening?"
              value={preferences.alertnessPreference}
              minimumValue={0}
              maximumValue={2}
              step={1}
              sliderType="alertness"
              onValueChange={(value) =>
                setPreferences((prev) => ({
                  ...prev,
                  alertnessPreference: value,
                }))
              }
            />

            <CustomStudyHabitSlider
              label="Are you usually early, on-time, or late to meetings?"
              value={preferences.punctualityPreference}
              minimumValue={0}
              maximumValue={2}
              step={1}
              sliderType="punctuality"
              onValueChange={(value) =>
                setPreferences((prev) => ({
                  ...prev,
                  punctualityPreference: value,
                }))
              }
            />
          </YStack>
        </YStack>

        {/* Learning Preferences Grid */}
        <YStack backgroundColor="$background" borderRadius="$4" padding="$4">
          <LearningPreferencesGrid
            label="Rate how effective each learning method is for you"
            options={LEARNING_OPTIONS}
            values={preferences.learningPreferences}
            onChange={(id, rating) => {
              setPreferences((prev) => ({
                ...prev,
                learningPreferences: {
                  ...prev.learningPreferences,
                  [id]: rating,
                },
              }));
            }}
          />
        </YStack>

        {/* Save Button */}
        <YStack marginTop="-$4">
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
