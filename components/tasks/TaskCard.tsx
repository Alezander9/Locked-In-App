import { Stack, XStack, Text, styled, YStack, useTheme } from "tamagui";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CheckedBoxIcon, UncheckedBoxIcon } from "@/app/components/icons";
import { Pressable, TouchableOpacity } from "react-native";
import { format } from "date-fns";
import { router } from "expo-router";

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
  dueDate: number;
}

export function TaskCard({
  _id,
  title,
  notes,
  isCompleted,
  courseColor,
  courseCode,
  dueDate,
}: TaskCardProps) {
  const updateTaskCompletion = useMutation(api.mutations.updateTaskCompletion);
  const theme = useTheme();

  const handleToggleComplete = async () => {
    await updateTaskCompletion({
      taskId: _id,
      isCompleted: !isCompleted,
    });
  };

  const handleLongPress = () => {
    router.push({
      pathname: "/(modals)/edit-task",
      params: {
        taskId: _id,
      },
    });
  };

  return (
    <Pressable
      onLongPress={handleLongPress}
      delayLongPress={500} // Half second for long press
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <Stack
        backgroundColor="$lightSeparator"
        borderRadius="$2"
        paddingHorizontal="$3"
        paddingBottom="$3"
        paddingTop="$2"
        marginHorizontal="$3"
        marginBottom="$2"
        position="relative"
      >
        <ColorBar backgroundColor={courseColor} />
        <XStack space="$3" alignItems="center">
          <TouchableOpacity
            onPress={handleToggleComplete}
            style={{
              width: 24,
              height: 24,
              justifyContent: "center",
              alignItems: "center",
              opacity: 0.7,
              alignSelf: "flex-start",
              marginTop: 0,
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
            <Text
              fontSize="$4"
              fontWeight="500"
              opacity={isCompleted ? 0.5 : 1}
              textDecorationLine={isCompleted ? "line-through" : "none"}
            >
              {title}
            </Text>
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
          <Text fontSize="$3" color="$color">
            {dueDate ? format(new Date(dueDate), "h:mm a") : ""}
          </Text>
        </XStack>
      </Stack>
    </Pressable>
  );
}
