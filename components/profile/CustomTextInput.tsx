import { Input, Text, YStack } from "tamagui";
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

  // Create a default style object
  const defaultStyle: TextStyle = {
    color: "#000",
    opacity: 1,
    height: 48,
    lineHeight: 24,
    paddingBottom: 8,
  };

  // Merge default style with provided style
  const combinedStyle = StyleSheet.flatten([defaultStyle, style as TextStyle]);

  return (
    <YStack width="100%">
      <Input
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        borderWidth={0}
        borderBottomWidth={1}
        borderBottomColor={isFocused ? "$blue10" : "$iosGray"}
        paddingVertical="$2"
        paddingHorizontal="$0"
        fontSize="$5"
        backgroundColor="transparent"
        placeholderTextColor="$iosGray"
        width="100%"
        marginBottom="$2"
        textAlignVertical={textAlignVertical || "center"}
        multiline={multiline}
        numberOfLines={numberOfLines}
        style={[
          combinedStyle,
          multiline && {
            minHeight: combinedStyle.height || 80,
            textAlignVertical: "top",
            paddingTop: 12,
            borderWidth: 1,
            borderColor: "$gray5",
            borderRadius: 8,
          },
        ]}
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
        focusStyle={{
          borderBottomColor: "$blue10",
          scale: 1,
        }}
        {...props}
      />
      {helperText && (
        <Text fontSize="$3" color="#666666" marginTop="$2">
          {helperText}{" "}
          {showWhyLink && (
            <Text
              color="$blue10"
              onPress={onWhyPress}
              pressStyle={{
                opacity: 0.8,
              }}
            >
              Why?
            </Text>
          )}
        </Text>
      )}
    </YStack>
  );
}
