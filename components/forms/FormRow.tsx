import { Stack, Text, YStack, styled, useTheme } from "tamagui";
import { GestureResponderEvent } from "react-native";
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

const Value = styled(Text, {
  color: "$separatorText",
  fontSize: 16,
  marginRight: 8,
});

interface FormRowProps {
  label: string;
  value: string;
  onPress?: (event: GestureResponderEvent) => void;
  showArrow?: boolean;
  description?: string;
}

export const FormRow = ({
  label,
  value,
  onPress,
  showArrow = true,
  description,
}: FormRowProps) => {
  const theme = useTheme();
  return (
    <YStack>
      <FormRowContainer
        pressStyle={{
          opacity: 0.7,
          backgroundColor: "$bg",
        }}
        onPress={onPress}
      >
        <Label>{label}</Label>
        <Stack flexDirection="row" alignItems="center">
          <Value>{value}</Value>
          {showArrow && <ArrowRightIcon size={8} color={theme.primary.val} />}
        </Stack>
      </FormRowContainer>
      {description && (
        <Text
          color="$gray"
          fontSize={13}
          paddingHorizontal={16}
          paddingVertical={6}
        >
          {description}
        </Text>
      )}
    </YStack>
  );
};
