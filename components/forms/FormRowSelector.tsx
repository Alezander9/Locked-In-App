import { Stack, Text, Theme, styled, useTheme } from "tamagui";
import { ArrowRightIcon } from "@/app/components/icons";
import { GestureResponderEvent } from "react-native";

const FormRowContainer = styled(Stack, {
  flexDirection: "row",
  alignItems: "center",
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
  isInvalid?: boolean;
}

export const FormRowSelector = ({
  label,
  value,
  placeholder = "Select...",
  onPress,
  isInvalid = false,
}: FormRowSelectorProps) => {
  const displayText = value || placeholder;
  const theme = useTheme();

  return (
    <FormRowContainer
      isInvalid={value ? false : isInvalid}
      pressStyle={{ opacity: 0.7 }}
      onPress={onPress}
    >
      <Label>{label}</Label>
      <Stack flexDirection="row" alignItems="center">
        <Value>{displayText}</Value>
        <ArrowRightIcon size={8} color={theme.primary.val} />
      </Stack>
    </FormRowContainer>
  );
};
