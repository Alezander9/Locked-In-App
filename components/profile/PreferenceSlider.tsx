import { Text, YStack, XStack } from "tamagui";
import { Slider } from "@miblanchard/react-native-slider";
import { View, TextInput } from "react-native";

type PreferenceSliderProps = {
  label: string;
  value: number;
  minimumValue: number;
  maximumValue: number;
  step: number;
  onValueChange: (value: number) => void;
  isNoiseLevel?: boolean;
  paddingBottom?: number;
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
}: PreferenceSliderProps) {
  const getNoiseLevelLabel = (value: number) => {
    switch(value) {
      case 0: return 'Silent';
      case 1: return 'Whispers';
      case 2: return 'Quiet Talking';
      case 3: return 'Discussion';
      case 4: return 'Active Discussion';
      case 5: return 'Loud Banter';
      default: return '';
    }
  };

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
            width: 120,  // Keep width for longer labels
            alignSelf: 'flex-end',
            textAlign: 'right',  // Add this to align text to the right
            paddingRight: 16,    // Add some padding from the right edge
          }}
        >
          {isNoiseLevel ? getNoiseLevelLabel(value) : value}
        </Text>
      </YStack>
    </YStack>
  );
}