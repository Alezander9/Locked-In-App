import { Stack, Text, styled } from "tamagui";
import { ActivityIndicator } from "react-native";

const FormRowContainer = styled(Stack, {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 12,
  paddingHorizontal: 16,
  backgroundColor: "$lightSeparator",
  borderBottomWidth: 1,
  borderBottomColor: "$darkSeparator",
});

interface FormRowButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  loadingText?: string;
  textColor?: string;
  disabled?: boolean;
}

export const FormRowButton = ({
  label,
  onPress,
  loading = false,
  loadingText,
  textColor = "$primary",
  disabled = false,
}: FormRowButtonProps) => {
  return (
    <FormRowContainer
      pressStyle={{ opacity: 0.7 }}
      onPress={!disabled && !loading ? onPress : undefined}
      opacity={disabled ? 0.5 : 1}
    >
      {loading ? (
        <Stack flexDirection="row" alignItems="center" gap={8}>
          <ActivityIndicator color={textColor} />
          <Text color={textColor} fontSize={16}>
            {loadingText || "Loading..."}
          </Text>
        </Stack>
      ) : (
        <Text color={textColor} fontSize={16} textAlign="center">
          {label}
        </Text>
      )}
    </FormRowContainer>
  );
};
