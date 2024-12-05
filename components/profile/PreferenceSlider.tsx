import { Text, YStack, useTheme } from "tamagui";
import { Slider } from "@miblanchard/react-native-slider";
import { View } from "react-native";

type PreferenceSliderProps = {
  label?: string;
  value: number;
  minimumValue: number;
  maximumValue: number;
  step: number;
  onValueChange: (value: number) => void;
  isNoiseLevel?: boolean;
  paddingBottom?: number;
  labels?: string[];
};

export function PreferenceSlider({
  label,
  value,
  minimumValue,
  maximumValue,
  step,
  onValueChange,
  isNoiseLevel,
  paddingBottom = 8,
  labels,
}: PreferenceSliderProps) {
  const theme = useTheme();

  const getNoiseLevelLabel = (value: number) => {
    switch (value) {
      case 0:
        return "Silent";
      case 1:
        return "Whispers";
      case 2:
        return "Quiet Talking";
      case 3:
        return "Discussion";
      case 4:
        return "Active Discussion";
      case 5:
        return "Loud Banter";
      default:
        return "";
    }
  };

  const getLabel = (value: number) => {
    if (isNoiseLevel) {
      return getNoiseLevelLabel(value);
    }
    if (labels && labels.length > 0) {
      return labels[value];
    }
    return value;
  };

  return (
    <YStack space="$1" style={{ paddingBottom }}>
      {label && (
        <Text fontSize="$3" fontWeight="600" color="$gray">
          {label}
        </Text>
      )}
      <YStack width="100%">
        <View style={{ width: "100%", height: 40 }}>
          <Slider
            value={value}
            onValueChange={([value]) => onValueChange(value as number)}
            minimumValue={minimumValue}
            maximumValue={maximumValue}
            step={step}
            thumbTintColor={theme.primary.val}
            minimumTrackTintColor={theme.primary.val}
            maximumTrackTintColor={theme.gray.val}
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
          {getLabel(value)}
        </Text>
      </YStack>
    </YStack>
  );
}
