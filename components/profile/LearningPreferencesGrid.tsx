import { Text, YStack, XStack } from "tamagui";
import { TouchableOpacity } from "react-native";

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
  return (
    <YStack space="$2">
      <Text fontSize="$3" fontWeight="600" color="$color">
        {label}
      </Text>

      <YStack backgroundColor="$background">
        <YStack space="$4">
          {options.map((option) => (
            <YStack key={option.id} space="$2">
              <Text fontSize="$3" color="$color" fontWeight="700">
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
                      backgroundColor={
                        values[option.id] === rating ? "$primary" : "$bg"
                      }
                      borderWidth={1}
                      borderColor={
                        values[option.id] === rating
                          ? "$primary"
                          : "$lightSeparator"
                      }
                      borderRadius="$4"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text
                        color={values[option.id] === rating ? "$bg" : "$color"}
                        fontSize="$3"
                        textAlign="center"
                      >
                        {rating === 1
                          ? "Not Effective"
                          : rating === 2
                            ? "Somewhat Effective"
                            : "Very Effective"}
                      </Text>
                    </XStack>
                  </TouchableOpacity>
                ))}
              </XStack>
            </YStack>
          ))}
        </YStack>
      </YStack>
    </YStack>
  );
}
