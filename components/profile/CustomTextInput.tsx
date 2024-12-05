import { Input, Text, YStack, styled } from "tamagui";
import { useState } from "react";
import {
  TextInput,
  TextInputProps,
  StyleProp,
  TextStyle,
  StyleSheet,
} from "react-native";
import { useRef } from "react";

type CustomTextInputProps = {
  label?: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  helperText?: string;
  showWhyLink?: boolean;
  onWhyPress?: () => void;
  multiline?: boolean;
  numberOfLines?: number;
  textAlignVertical?: "auto" | "top" | "bottom" | "center";
  style?: StyleProp<TextStyle>;
} & Omit<TextInputProps, "onChangeText" | "style">;

// New styled components
const StyledInput = styled(Input, {
  color: "$color",
  opacity: 1,
  height: 48,
  lineHeight: 24,
  paddingBottom: 8,
  borderWidth: 0,
  borderBottomWidth: 1,
  borderBottomColor: "$gray",
  paddingVertical: "$2",
  paddingHorizontal: "$0",
  fontSize: "$5",
  backgroundColor: "transparent",
  placeholderTextColor: "$gray",
  width: "100%",
  marginBottom: "$2",

  variants: {
    multiline: {
      true: {
        minHeight: 80,
        textAlignVertical: "top",
        paddingTop: 12,
        borderWidth: 1,
        borderColor: "$color",
        borderRadius: 8,
      },
    },
    focused: {
      true: {
        borderBottomColor: "$blue10",
      },
    },
  } as const,
});

const HelperText = styled(Text, {
  fontSize: "$3",
  color: "$gray",
  marginTop: "$2",
});

const WhyLink = styled(Text, {
  color: "$primary",
  pressStyle: {
    opacity: 0.8,
  },
});

export function CustomTextInput({
  label,
  placeholder,
  required = false,
  value,
  onChangeText,
  helperText,
  showWhyLink = false,
  onWhyPress = () => console.log("Why pressed"),
  multiline,
  numberOfLines,
  textAlignVertical,
  style,
  ...props
}: CustomTextInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  return (
    <YStack width="100%">
      <StyledInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        textAlignVertical={textAlignVertical || "center"}
        multiline={multiline}
        numberOfLines={numberOfLines}
        focused={isFocused}
        enterStyle={{
          scale: 1,
          opacity: 1,
        }}
        exitStyle={{
          scale: 0.98,
          opacity: 0.8,
        }}
        pressStyle={{
          scale: 0.98,
        }}
        {...props}
      />
      {helperText && (
        <HelperText>
          {helperText}{" "}
          {showWhyLink && <WhyLink onPress={onWhyPress}>Why?</WhyLink>}
        </HelperText>
      )}
    </YStack>
  );
}
