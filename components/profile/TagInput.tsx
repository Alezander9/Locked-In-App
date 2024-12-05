import { Input, Text, YStack, XStack, Circle, useTheme } from "tamagui";
import { useState, useRef } from "react";
import { TextInput, TouchableOpacity } from "react-native";
import Icons from "@/app/components/icons";

type TagInputProps = {
  placeholder?: string;
  value: string;
  tags: string[];
  minTags?: number;
  onChangeText: (text: string) => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (index: number) => void;
};

export function TagInput({
  placeholder,
  value,
  tags,
  minTags = 2,
  onChangeText,
  onAddTag,
  onRemoveTag,
}: TagInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleSubmit = () => {
    if (value.trim()) {
      onAddTag(value.trim());
      onChangeText("");
    }
  };

  const theme = useTheme();

  return (
    <YStack width="100%" space="$2">
      <XStack width="100%" alignItems="center" space="$2">
        <Input
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onSubmitEditing={handleSubmit}
          returnKeyType="done"
          flex={1}
          borderWidth={0}
          borderBottomWidth={1}
          borderBottomColor={isFocused ? "$blue10" : "$iosGray"}
          paddingVertical="$2"
          paddingHorizontal="$0"
          fontSize="$5"
          backgroundColor="transparent"
          placeholderTextColor="$iosGray"
          textAlignVertical="center"
          style={{
            color: "#000",
            height: 48,
            lineHeight: 24,
            paddingBottom: 8,
          }}
        />
        {value.trim() && (
          <TouchableOpacity
            onPress={() => value.trim() && onAddTag(value.trim())}
          >
            <Circle
              size={30}
              backgroundColor="$blue10"
              justifyContent="center"
              alignItems="center"
            >
              <Icons.Plus size={15} color="white" />
            </Circle>
          </TouchableOpacity>
        )}
      </XStack>

      {tags.length > 0 && (
        <XStack flexWrap="wrap" gap="$2">
          {tags.map((tag, index) => (
            <XStack
              key={index}
              backgroundColor="#E8F5FF"
              borderRadius={20}
              paddingHorizontal="$3"
              paddingVertical="$1"
              alignItems="center"
              space="$1"
            >
              <Text color="$primary">{tag}</Text>
              <TouchableOpacity onPress={() => onRemoveTag(index)}>
                <Icons.X size={12} color={theme.primary.val} />
              </TouchableOpacity>
            </XStack>
          ))}
        </XStack>
      )}

      <Text
        color={tags.length >= minTags ? "#22C55E" : "#EF4444"}
        fontSize="$3"
        textAlign="center"
        marginTop="$2"
      >
        Add at least {minTags} locations (
        <Text color={tags.length >= minTags ? "#22C55E" : "#EF4444"}>
          {tags.length}
        </Text>
        /{minTags})
      </Text>
    </YStack>
  );
}
