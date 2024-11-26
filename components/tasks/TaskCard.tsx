import { Stack, XStack, Text, styled, YStack, useTheme } from "tamagui";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CheckedBoxIcon, UncheckedBoxIcon } from "@/app/components/icons";
import { TouchableOpacity } from "react-native";

const ColorBar = styled(Stack, {
  width: 4,
  position: "absolute",
  left: 0,
  top: 0,
  bottom: 0,
  borderTopLeftRadius: "$2",
  borderBottomLeftRadius: "$2",
});

interface TaskCardProps {
  _id: Id<"tasks">;
  title: string;
  notes: string;
  isCompleted: boolean;
  courseColor: string;
  courseCode: string;
}

export function TaskCard({
  _id,
  title,
  notes,
  isCompleted,
  courseColor,
  courseCode,
}: TaskCardProps) {
  const updateTaskCompletion = useMutation(api.mutations.updateTaskCompletion);
  const theme = useTheme();

  const handleToggleComplete = async () => {
    await updateTaskCompletion({
      taskId: _id,
      isCompleted: !isCompleted,
    });
  };

  return (
    <Stack
      backgroundColor="$lightSeparator"
      borderRadius="$2"
      padding="$3"
      marginHorizontal="$3"
      marginBottom="$2"
      position="relative"
      pressStyle={{ opacity: 0.7 }}
    >
      <ColorBar backgroundColor={courseColor} />

      <XStack space="$3" alignItems="flex-start">
        <TouchableOpacity
          onPress={handleToggleComplete}
          style={{
            width: 24,
            height: 24,
            justifyContent: "center",
            alignItems: "center",
            opacity: 0.7,
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {isCompleted ? (
            <CheckedBoxIcon size={20} color={theme.color.val} />
          ) : (
            <UncheckedBoxIcon size={20} color={theme.color.val} />
          )}
        </TouchableOpacity>

        <YStack flex={1} space="$1">
          <XStack justifyContent="space-between" alignItems="center">
            <Text
              fontSize="$4"
              fontWeight="500"
              opacity={isCompleted ? 0.5 : 1}
              textDecorationLine={isCompleted ? "line-through" : "none"}
            >
              {title}
            </Text>
            <Text fontSize="$3" color="$color">
              {courseCode}
            </Text>
          </XStack>

          {notes && (
            <Text
              fontSize="$3"
              color="$color"
              opacity={isCompleted ? 0.5 : 0.8}
            >
              {notes}
            </Text>
          )}
        </YStack>
      </XStack>
    </Stack>
  );
}
