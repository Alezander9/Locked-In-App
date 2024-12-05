import { Switch } from "react-native";
import { Text, YStack, XStack, useTheme } from "tamagui";

type CustomSwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  subtitle?: string;
  helperText?: string;
};

export function CustomSwitch({
  value,
  onValueChange,
  subtitle,
  helperText,
}: CustomSwitchProps) {
  const theme = useTheme();

  return (
    <YStack space="$1" marginVertical="$0">
      <XStack justifyContent="space-between" alignItems="center">
        <YStack flex={1} paddingRight="$2">
          {subtitle && (
            <Text fontSize="$4" fontWeight="500" color="$gray12">
              {subtitle}
            </Text>
          )}
          {helperText && (
            <Text fontSize="$3" color="$gray" numberOfLines={2}>
              {helperText}
            </Text>
          )}
        </YStack>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: theme.gray.val, true: theme.primary.val }}
          thumbColor={theme.white.val}
          ios_backgroundColor="iosGray"
        />
      </XStack>
    </YStack>
  );
}
