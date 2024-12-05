import { Text, YStack } from "tamagui";
import { PreferenceSlider } from "@/components/profile/PreferenceSlider";

interface GeneralStudyHabitsProps {
  label: string;
  value: number;
  minimumValue: number;
  maximumValue: number;
  step: number;
  sliderType: string;
  onValueChange: (value: number) => void;
  paddingBottom?: number;
}

export const GeneralStudyHabits = ({
  label,
  value,
  minimumValue,
  maximumValue,
  step,
  sliderType,
  onValueChange,
  paddingBottom,
}: GeneralStudyHabitsProps) => {
  const getLabels = (type: string) => {
    switch (type) {
      case "alertnessPreference":
        return ["Morning Person", "Flexible", "Night Owl"];
      case "punctualityPreference":
        return ["Early", "On Time", "Running Late"];
      default:
        return ["Low", "Medium", "High"];
    }
  };

  const labels = getLabels(sliderType);

  return (
    <YStack space="$2" paddingBottom={paddingBottom}>
      <Text fontSize="$3" color="$gray11">
        {label}
      </Text>
      <PreferenceSlider
        value={value}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        onValueChange={onValueChange}
        labels={labels}
      />
    </YStack>
  );
};
