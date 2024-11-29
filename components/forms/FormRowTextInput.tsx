import { Stack, Text, Input, styled } from "tamagui";
import { ArrowRightIcon } from "@/app/components/icons";

const FormRowContainer = styled(Stack, {
  flexDirection: "row",
  justifyContent: "space-between",
  paddingVertical: 12,
  paddingHorizontal: 16,
  backgroundColor: "$lightSeparator",
  variants: {
    isInvalid: {
      true: {
        borderBottomColor: "$danger",
        borderColor: "$danger",
        borderWidth: 1,
      },
      false: {
        borderBottomColor: "$darkSeparator",
        borderBottomWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
      },
    },
  } as const,
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
  padding: 0,
  marginRight: 8,
  flex: 1,
  maxWidth: "60%",
  borderWidth: 0,
  height: "100%",
});

interface FormRowTextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
  isInvalid?: boolean;
}

export const FormRowTextInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  numberOfLines = 1,
  isInvalid = false,
}: FormRowTextInputProps) => {
  const inputRef = React.useRef<any>(null);

  const handlePress = () => {
    inputRef.current?.focus();
  };

  return (
    <FormRowContainer
      height={numberOfLines * 20 + 25}
      onPress={handlePress}
      pressStyle={{ opacity: 0.7 }}
      isInvalid={value ? false : isInvalid}
    >
      <Label>{label}</Label>
      <StyledInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || label}
        multiline={multiline}
        placeholderTextColor="$separatorText"
      />
    </FormRowContainer>
  );
};
