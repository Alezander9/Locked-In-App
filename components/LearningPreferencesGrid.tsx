import { Text, YStack, XStack } from "tamagui";
import { TouchableOpacity, ScrollView, Dimensions } from "react-native";

type LearningOption = {
  id: string;
  label: string;
};

type LearningPreferencesGridProps = {
  label: string;
  options: LearningOption[];
  values: Record<string, number>;
  onChange: (id: string, rating: number) => void;
};

const RATINGS = [1, 2, 3];

export function LearningPreferencesGrid({
  label,
  options,
  values,
  onChange,
}: LearningPreferencesGridProps) {
  // Height calculation: approximately 4 items plus header
  // Each item is about 80px (40px for text + 40px for buttons)
  const CONTAINER_HEIGHT = 320; // This will show ~4 items

  return (
    <YStack space="$2">
      <Text fontSize="$3" fontWeight="600" color="$gray">
        {label}
      </Text>

      <YStack height={CONTAINER_HEIGHT} backgroundColor="$background">
        <ScrollView 
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <YStack space="$4">
            {options.map((option) => (
              <YStack key={option.id} space="$2">
                <Text 
                  fontSize="$3" 
                  color="$gray11"
                  fontWeight="700"
                >
                  {option.label}
                </Text>
                <XStack space="$2" justifyContent="space-between">
                  {RATINGS.map((rating) => (
                    <TouchableOpacity
                      key={rating}
                      onPress={() => onChange(option.id, rating)}
                      style={{ flex: 1 }}
                    >
                      <XStack
                        height={40}
                        backgroundColor={values[option.id] === rating ? "#0F9ED5" : "white"}
                        borderWidth={1}
                        borderColor={values[option.id] === rating ? "#0F9ED5" : "$gray5"}
                        borderRadius="$4"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Text 
                          color={values[option.id] === rating ? "white" : "$gray11"}
                          fontSize="$3"
                          textAlign="center"
                        >
                          {rating === 1 ? "Not Effective" : 
                           rating === 2 ? "Somewhat Effective" : 
                           "Very Effective"}
                        </Text>
                      </XStack>
                    </TouchableOpacity>
                  ))}
                </XStack>
              </YStack>
            ))}
          </YStack>
        </ScrollView>
      </YStack>
    </YStack>
  );
}