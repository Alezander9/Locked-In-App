import { useState, useRef } from "react";
import {
  Input,
  XStack,
  styled,
  Button,
  Stack,
  YStack,
  Text,
  useTheme,
} from "tamagui";
import {
  InputAccessoryView,
  Keyboard,
  Platform,
  TextInput,
  useColorScheme,
} from "react-native";
import { MicrophoneIcon, SearchIcon } from "@/app/components/icons";

const SearchInput = styled(Input, {
  flex: 1,
  borderWidth: 0,
  backgroundColor: "transparent",
  fontSize: "$3",
  height: "auto",
  paddingLeft: 0,
  focusStyle: {
    borderWidth: 0,
    outlineWidth: 0,
  },
});

const SearchContainer = styled(XStack, {
  backgroundColor: "$bg",
  height: 44,
  borderRadius: "$2",
  paddingLeft: "$3",
  paddingRight: "$2",
  marginHorizontal: "$3",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "$gray",
  hoverStyle: {
    borderColor: "$primary",
  },
  variants: {
    focused: {
      true: {
        borderColor: "$primary",
      },
    },
  },
});

const KeyboardAccessory = styled(Stack, {
  backgroundColor: "$iosGray",
  borderTopWidth: 1,
  borderBottomWidth: 1,
  borderTopColor: "$iosGray2",
  borderBottomColor: "$iosGray2",
});

const AccessoryButton = styled(Button, {
  backgroundColor: "transparent",
  color: "$primary",
  minHeight: 32,
});

const AccessoryButtonText = styled(Text, {
  color: "$primary",
  fontSize: "$4",
  paddingHorizontal: "$4",
  minHeight: 22,
});

const DismissOverlay = styled(Stack, {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "transparent",
});

interface BaseSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  showDismissOverlay?: boolean;
  onDismiss?: () => void;
  accessoryId?: string; // New prop for unique accessory ID
}

export function BaseSearchBar({
  value,
  onChangeText,
  placeholder = "Search...",
  showDismissOverlay = false,
  onDismiss,
  accessoryId = "defaultSearchBarAccessoryID", // Default value
}: BaseSearchBarProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
    setFocused(false);
    onDismiss?.();
  };

  return (
    <>
      {showDismissOverlay && focused && (
        <DismissOverlay
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          onPress={dismissKeyboard}
        />
      )}

      <YStack width="100%">
        <SearchContainer
          focused={focused}
          pressStyle={{ scale: 0.99 }}
          onPress={() => {
            inputRef.current?.focus();
          }}
        >
          <SearchIcon
            size={18}
            color={theme.color.val}
            style={{ marginRight: 8 }}
          />
          <SearchInput
            ref={inputRef}
            placeholder={placeholder}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            color="$color"
            placeholderTextColor="$color"
            inputAccessoryViewID={
              Platform.OS === "ios" ? accessoryId : undefined
            }
            value={value}
            onChangeText={onChangeText}
          />
          {/* {value.length > 0 && (
            <Button
              chromeless
              paddingHorizontal="$2"
              onPress={() => {
                onChangeText("");
              }}
            >
              <MicrophoneIcon size={14} color={theme.color.val} />
            </Button>
          )} */}
        </SearchContainer>
      </YStack>

      {Platform.OS === "ios" && (
        <InputAccessoryView nativeID={accessoryId}>
          <KeyboardAccessory>
            <XStack justifyContent="space-between">
              <AccessoryButton
                onPress={() => {
                  onChangeText("");
                }}
              >
                <AccessoryButtonText>Clear</AccessoryButtonText>
              </AccessoryButton>
              <AccessoryButton onPress={dismissKeyboard}>
                <AccessoryButtonText>Done</AccessoryButtonText>
              </AccessoryButton>
            </XStack>
          </KeyboardAccessory>
        </InputAccessoryView>
      )}
    </>
  );
}
