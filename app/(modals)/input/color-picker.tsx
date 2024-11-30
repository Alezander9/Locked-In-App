import { Stack, YStack, XStack, Text, styled } from "tamagui";
import { router, useLocalSearchParams } from "expo-router";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useColorPickerStore } from "@/stores/colorPickerStore";

// Circle button for color selection
const ColorButton = styled(Stack, {
  width: 50,
  height: 50,
  borderRadius: 25,
  margin: 8,
  pressStyle: {
    scale: 0.96,
  },
  variants: {
    selected: {
      true: {
        borderWidth: 3,
        borderColor: "$color",
      },
    },
  },
});

type ColorPickerParams = {
  courseId: string;
  courseCode: string;
  currentColor: string;
} & Record<string, string>;

// Tailwind-inspired colors
const COLORS = {
  slate: ["#94a3b8", "#64748b", "#475569", "#334155"],
  red: ["#ef4444", "#dc2626", "#b91c1c", "#991b1b"],
  orange: ["#f97316", "#ea580c", "#c2410c", "#9a3412"],
  amber: ["#f59e0b", "#d97706", "#b45309", "#92400e"],
  yellow: ["#eab308", "#ca8a04", "#a16207", "#854d0e"],
  lime: ["#84cc16", "#65a30d", "#4d7c0f", "#3f6212"],
  green: ["#22c55e", "#16a34a", "#15803d", "#166534"],
  emerald: ["#10b981", "#059669", "#047857", "#065f46"],
  teal: ["#14b8a6", "#0d9488", "#0f766e", "#115e59"],
  cyan: ["#06b6d4", "#0891b2", "#0e7490", "#155e75"],
  sky: ["#0ea5e9", "#0284c7", "#0369a1", "#075985"],
  blue: ["#3b82f6", "#2563eb", "#1d4ed8", "#1e40af"],
  indigo: ["#6366f1", "#4f46e5", "#4338ca", "#3730a3"],
  violet: ["#8b5cf6", "#7c3aed", "#6d28d9", "#5b21b6"],
  purple: ["#a855f7", "#9333ea", "#7e22ce", "#6b21a8"],
  fuchsia: ["#d946ef", "#c026d3", "#a21caf", "#86198f"],
  pink: ["#ec4899", "#db2777", "#be185d", "#9d174d"],
  rose: ["#f43f5e", "#e11d48", "#be123c", "#9f1239"],
};

export default function ColorPickerModal() {
  const params = useLocalSearchParams<ColorPickerParams>();
  const [selectedColor, setSelectedColor] = useState(params.currentColor);

  const setColorChoice = useColorPickerStore((state) => state.setColorChoice);

  const handleSave = () => {
    setColorChoice(params.courseId as Id<"courses">, selectedColor);
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
              onPress={() => router.back()}
              color="$primary"
              fontSize="$4"
              padding="$4"
              width={100}
              textAlign="left"
            >
              Cancel
            </Text>
            <YStack alignItems="center">
              <Text fontSize="$4" fontWeight="$4">
                Choose Color
              </Text>
              <Text fontSize="$3" color="$gray">
                {params.courseCode}
              </Text>
            </YStack>
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
            <YStack padding="$4" space="$4">
              {Object.entries(COLORS).map(([colorName, shades]) => (
                <YStack key={colorName} space="$2">
                  <Text fontSize="$3" textTransform="capitalize" color="$gray">
                    {colorName}
                  </Text>
                  <XStack flexWrap="wrap">
                    {shades.map((color) => (
                      <ColorButton
                        key={color}
                        backgroundColor={color}
                        selected={selectedColor === color}
                        onPress={() => setSelectedColor(color)}
                      />
                    ))}
                  </XStack>
                </YStack>
              ))}
            </YStack>
          </ScrollView>
        </Stack>
      </SafeAreaView>
    </ScreenWrapper>
  );
}
