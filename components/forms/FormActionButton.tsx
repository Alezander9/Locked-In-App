import { XStack, Text } from "tamagui";

interface FormActionButtonProps {
  onPress: () => void;
  label: string;
  color?: string;
  marginTop?: string | number;
}

export const FormActionButton = ({ 
  onPress, 
  label,
  color = "$primary",
  marginTop = "$4"
}: FormActionButtonProps) => {
  return (
    <XStack
      pressStyle={{ opacity: 0.7 }}
      onPress={onPress}
      padding="$4"
      marginTop={marginTop}
      backgroundColor="$lightSeparator"
      borderRadius="$4"
      margin="$4"
      justifyContent="center"
    >
      <Text color={color} fontSize="$4">
        {label}
      </Text>
    </XStack>
  );
};