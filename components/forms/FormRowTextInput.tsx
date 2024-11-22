import { Stack, Text, Input, styled } from "tamagui";
import { ArrowRightIcon } from "@/app/components/icons";

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

const StyledInput = styled(Input, {
  color: "$separatorText",
  fontSize: 16,
  textAlign: "right",
  backgroundColor: "transparent",
  borderWidth: 0,
  padding: 0,
  marginRight: 8,
  flex: 1,
  maxWidth: "60%",
});

interface FormRowTextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
}

export const FormRowTextInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
}: FormRowTextInputProps) => {
  return (
    <FormRowContainer>
      <Label>{label}</Label>
      <StyledInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || label}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        placeholderTextColor="$separatorText"
      />
    </FormRowContainer>
  );
};
