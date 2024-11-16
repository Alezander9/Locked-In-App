import { useState, useRef, useEffect } from "react";
import { Input, XStack, styled, Button, Text, Stack, YStack } from "tamagui";
import {
  InputAccessoryView,
  Keyboard,
  Platform,
  Pressable,
  TextInput,
} from "react-native";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useDebounce } from "../hooks/useDebounce";

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
  paddingHorizontal: "$3",
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

const IconPlaceholder = styled(Text, {
  fontSize: "$2",
  color: "$color",
});

const KeyboardAccessory = styled(Stack, {
  backgroundColor: "$iosGray",
  borderTopWidth: 1,
  borderBottomWidth: 1,
  borderTopColor: "$iosGray2",
  borderBottomColor: "$iosGray2",
  padding: "$2",
});

const DoneButton = styled(Button, {
  backgroundColor: "transparent",
  color: "$primary",
});

const DismissOverlay = styled(Stack, {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "transparent",
});

const ResultsContainer = styled(YStack, {
  position: "absolute",
  top: 48, // height of search bar + small gap
  left: "$3",
  right: "$3",
  backgroundColor: "$bg",
  borderRadius: "$2",
  padding: "$2",
  shadowColor: "$shadowColor",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 3,
  elevation: 3, // for Android shadow
  zIndex: 1000,
});

const ResultRow = styled(Pressable, {
  paddingVertical: "$2",
  paddingHorizontal: "$3",
  backgroundColor: "$bg",

  // Add hover/pressed state
  pressStyle: {
    backgroundColor: "$gray",
    opacity: 0.1,
  },
});

const ResultCode = styled(Text, {
  color: "$color",
  fontSize: "$3",
  fontWeight: "500",
});

const ResultTitle = styled(Text, {
  color: "$color",
  fontSize: "$3",
  opacity: 0.7,
  flex: 1,
});

export interface Course {
  department: string;
  code: string;
  title: string;
}

const INPUT_ACCESSORY_ID = "searchBarAccessoryID";

interface SearchBarProps {
  onCourseSelect?: (course: Course) => void;
}

export function SearchBar({ onCourseSelect }: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<TextInput>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const searchResults = useQuery(api.queries.searchCourses, {
    searchTerm: debouncedSearchTerm,
  });

  const dismissKeyboard = () => {
    Keyboard.dismiss();
    setFocused(false);
  };

  const handleCourseSelect = (course: Course) => {
    onCourseSelect?.(course);
    dismissKeyboard();
    setSearchTerm("");
  };

  return (
    <>
      {focused && (
        <DismissOverlay
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          onPress={dismissKeyboard}
        />
      )}

      <YStack>
        <SearchContainer
          focused={focused}
          pressStyle={{ scale: 0.99 }}
          onPress={() => {
            inputRef.current?.focus();
          }}
        >
          <IconPlaceholder>[Search]</IconPlaceholder>
          <SearchInput
            ref={inputRef}
            placeholder="Search..."
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            color="$color"
            placeholderTextColor="$color"
            inputAccessoryViewID={
              Platform.OS === "ios" ? INPUT_ACCESSORY_ID : undefined
            }
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <Button
            chromeless
            paddingHorizontal="$2"
            onPress={() => {
              setSearchTerm("");
            }}
          >
            <IconPlaceholder>
              {searchTerm ? "[Clear]" : "[Mic]"}
            </IconPlaceholder>
          </Button>
        </SearchContainer>

        {focused && searchResults && searchResults.length > 0 && (
          <ResultsContainer enterStyle={{ opacity: 0, scale: 0.95 }}>
            {searchResults.map((course: Course) => (
              <ResultRow
                key={`${course.department}${course.code}`}
                onPress={() => handleCourseSelect(course)}
              >
                <XStack alignItems="center" space="$2">
                  <ResultCode>
                    {course.department} {course.code}:
                  </ResultCode>
                  <ResultTitle numberOfLines={1} ellipsizeMode="tail">
                    {course.title}
                  </ResultTitle>
                </XStack>
              </ResultRow>
            ))}
          </ResultsContainer>
        )}
      </YStack>

      {Platform.OS === "ios" && (
        <InputAccessoryView nativeID={INPUT_ACCESSORY_ID}>
          <KeyboardAccessory>
            <XStack justifyContent="flex-end">
              <DoneButton onPress={dismissKeyboard}>
                <Text color="$primary" fontSize="$3">
                  Done
                </Text>
              </DoneButton>
            </XStack>
          </KeyboardAccessory>
        </InputAccessoryView>
      )}
    </>
  );
}
