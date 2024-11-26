// components/courses/CourseFilterChip.tsx
import { Stack, Text, styled } from "tamagui";
import { TouchableOpacity } from "react-native";

interface CourseFilterChipProps {
  code: string;
  color: string;
  isActive: boolean;
  onPress: () => void;
}

export function CourseFilterChip({
  code,
  color,
  isActive,
  onPress,
}: CourseFilterChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        borderRadius: 20,
        marginRight: 8,
        paddingVertical: 10,
        paddingHorizontal: 12,
        display: "flex",
        alignItems: "center",
        backgroundColor: color,
        opacity: isActive ? 1 : 0.4,
      }}
    >
      <Text color="white" fontSize="$3" fontWeight="500">
        {code}
      </Text>
    </TouchableOpacity>
  );
}
