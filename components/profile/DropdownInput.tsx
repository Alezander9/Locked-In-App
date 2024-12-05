import { useState } from "react";
import { Text, YStack, styled, useTheme } from "tamagui";
import { View, StyleProp, ViewStyle } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { CheckIcon } from "@/app/components/icons";
import { ArrowDownIcon, ArrowUpIcon } from "@/app/components/icons";

type DropdownInputProps = {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  items: { label: string; value: string }[];
  onOpen?: () => void;
  placeholder?: string;
};

const StyledDropDownPicker = styled(DropDownPicker, {
  borderColor: "$color",
  borderRadius: 8,
  backgroundColor: "$lightSeparator",
  height: 45,
});

export function DropdownInput({
  label,
  value,
  onValueChange,
  items,
  onOpen,
  placeholder = "Select a Grade (required)",
}: DropdownInputProps) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const ArrowIcon = ({ style }: { style: StyleProp<ViewStyle> }) => (
    <View style={[style, { justifyContent: "center", height: "100%" }]}>
      {open ? (
        <ArrowUpIcon size={16} color={theme.color.val} />
      ) : (
        <ArrowDownIcon size={16} color={theme.color.val} />
      )}
    </View>
  );

  const TickIcon = ({ style }: { style: StyleProp<ViewStyle> }) => (
    <View style={style}>
      <CheckIcon size={16} color={theme.color.val} />
    </View>
  );

  return (
    <YStack space="$1" marginBottom="$3">
      <Text fontSize="$3" fontWeight="600" color="$color">
        {label}
      </Text>
      <View style={{ width: "100%", zIndex: open ? 2000 : 1000 }}>
        <StyledDropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          onOpen={onOpen}
          setValue={(callback) => {
            const newValue = callback(value);
            if (typeof newValue === "string") {
              onValueChange(newValue);
            }
          }}
          textStyle={{
            fontSize: 16,
            color: theme.color.val,
          }}
          maxHeight={200}
          autoScroll
          showTickIcon
          placeholder={placeholder}
          placeholderStyle={{
            color: theme.color.val,
            fontSize: 16,
          }}
          style={{
            backgroundColor: theme.lightSeparator.val,
            borderColor: theme.color.val,
          }}
          dropDownContainerStyle={{
            backgroundColor: theme.lightSeparator.val,
            borderColor: theme.color.val,
          }}
          ArrowUpIconComponent={ArrowIcon}
          ArrowDownIconComponent={ArrowIcon}
          TickIconComponent={TickIcon}
          zIndex={3000}
          zIndexInverse={1000}
        />
      </View>
    </YStack>
  );
}
