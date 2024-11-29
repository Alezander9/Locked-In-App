import { Text, YStack } from "tamagui";
import { Slider } from "@miblanchard/react-native-slider";
import { View } from "react-native";

type GeneralStudyHabitsProps = {
  label: string;
  value: number;
  minimumValue: number;
  maximumValue: number;
  step: number;
  onValueChange: (value: number) => void;
  paddingBottom?: number;
  sliderType: "alertness" | "punctuality";
};

export function GeneralStudyHabits({
  label,
  value,
  minimumValue,
  maximumValue,
  step,
  onValueChange,
  paddingBottom = 8,
  sliderType,
}: GeneralStudyHabitsProps) {
  const getAlertnessLabel = (value: number) => {
    switch(value) {
      case 0: return 'Morning Person';
      case 1: return 'Afternoon Person';
      case 2: return 'Night Owl';
      default: return '';
    }
  };

  const getPunctualityLabel = (value: number) => {
    switch(value) {
      case 0: return 'Early Bird';
      case 1: return 'On the Dot';
      case 2: return 'Running Late';
      default: return '';
    }
  };

  const getLabel = sliderType === 'alertness' ? getAlertnessLabel : getPunctualityLabel;

  return (
    <YStack space="$1" style={{ paddingBottom }}>
      <Text fontSize="$3" fontWeight="600" color="$gray">
        {label}
      </Text>
      <YStack width="100%">
        <View style={{ width: '100%', height: 40 }}>
          <Slider
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
            alignSelf: 'flex-end',
            textAlign: 'right',
            paddingRight: 16,
          }}
        >
          {getLabel(value)}
        </Text>
      </YStack>
    </YStack>
  );
}