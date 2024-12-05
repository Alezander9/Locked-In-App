import { XStack, Stack, Text, styled, useTheme } from "tamagui";
import { TouchableOpacity, Alert } from "react-native";
import { Id } from "@/convex/_generated/dataModel";
import { MenuIcon, XIcon } from "@/app/components/icons";

const DragHandle = styled(Stack, {
  width: 40,
  height: "100%",
  justifyContent: "center",
  alignItems: "center",
  opacity: 0.5,
});

const ColorDot = styled(TouchableOpacity, {
  width: 24,
  height: 24,
  borderRadius: 12,
  marginLeft: 8,
  pressStyle: {
    opacity: 0.7,
  },
});

const DeleteButton = styled(Stack, {
  width: 40,
  height: "100%",
  justifyContent: "center",
  alignItems: "center",
  opacity: 0.7,
});

interface EditableCourseRowProps {
  id: Id<"courses">;
  code: string;
  color: string;
  onColorPress: () => void;
  onDelete: () => void;
  drag: () => void;
  isActive: boolean;
}

export function EditableCourseRow({
  id,
  code,
  color,
  onColorPress,
  onDelete,
  drag,
  isActive,
}: EditableCourseRowProps) {
  const theme = useTheme();
  const handleDelete = () => {
    Alert.alert("Remove Course", `Are you sure you want to remove ${code}?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Remove",
        style: "destructive",
        onPress: onDelete,
      },
    ]);
  };

  return (
    <XStack
      backgroundColor="$lightSeparator"
      borderBottomWidth={1}
      borderBottomColor="$darkSeparator"
      height={60}
      alignItems="center"
      opacity={isActive ? 0.5 : 1}
    >
      <DragHandle onPressIn={drag}>
        <MenuIcon size={20} color={theme.separatorText.val} />
      </DragHandle>

      <TouchableOpacity
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          marginLeft: 8,
          backgroundColor: color,
        }}
        onPress={onColorPress}
      />

      <Text flex={1} fontSize="$4" marginLeft="$4" color={theme.color.val}>
        {code}
      </Text>

      <DeleteButton onPress={handleDelete}>
        <XIcon size={20} color={theme.color.val} />
      </DeleteButton>
    </XStack>
  );
}
