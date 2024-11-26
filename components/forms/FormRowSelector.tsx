import { Stack, Text, styled } from "tamagui";
import { ArrowRightIcon } from "@/app/components/icons";
import { GestureResponderEvent } from "react-native";

const FormRowContainer = styled(Stack, {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingVertical: 12,
  paddingHorizontal: 16,
  backgroundColor: "$lightSeparator",
  borderBottomWidth: 1,
  borderBottomColor: "$darkSeparator",
});

const Label = styled(Text, {
  color: "$color",
  fontSize: 16,
});

const Value = styled(Text, {
  color: "$separatorText",
  fontSize: 16,
  marginRight: 8,
});

interface FormRowSelectorProps {
  label: string;
  value: string;
  placeholder?: string;
  onPress: (event: GestureResponderEvent) => void;
}

export const FormRowSelector = ({
  label,
  value,
  placeholder = "Select...",
  onPress,
}: FormRowSelectorProps) => {
  const displayText = value || placeholder;

  return (
    <FormRowContainer pressStyle={{ opacity: 0.7 }} onPress={onPress}>
      <Label>{label}</Label>
      <Stack flexDirection="row" alignItems="center">
        <Value>{displayText}</Value>
        <ArrowRightIcon size={8} color="$primary" />
      </Stack>
    </FormRowContainer>
  );
};
