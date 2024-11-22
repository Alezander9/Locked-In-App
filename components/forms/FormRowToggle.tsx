import { Switch, Stack, Text, styled, YStack } from "tamagui";

const FormRowContainer = styled(Stack, {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingVertical: 10,
  paddingHorizontal: 16,
  backgroundColor: "$lightSeparator",
  borderBottomWidth: 1,
  borderBottomColor: "$darkSeparator",
});

const Label = styled(Text, {
  color: "$color",
  fontSize: 16,
});

interface FormRowToggleProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  description?: string;
  checkedLabel?: string;
  uncheckedLabel?: string;
}

export const FormRowToggle = ({
  label,
  value,
  onValueChange,
  description,
  checkedLabel,
  uncheckedLabel,
}: FormRowToggleProps) => {
  return (
    <YStack>
      <FormRowContainer>
        <Label>{label}</Label>
        <Stack flexDirection="row" alignItems="center" gap={8}>
          {value
            ? checkedLabel && (
                <Text fontSize="$4" color="$separatorText">
                  {checkedLabel}
                </Text>
              )
            : uncheckedLabel && (
                <Text fontSize="$4" color="$separatorText">
                  {uncheckedLabel}
                </Text>
              )}
          <Switch
            checked={value}
            onCheckedChange={onValueChange}
            size="$6"
            backgroundColor={value ? "$blue" : "$gray"}
          >
            <Switch.Thumb animation="quick" backgroundColor="$white" />
          </Switch>
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
