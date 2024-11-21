import { useState } from "react";
import { styled, Text, XStack, YStack } from "tamagui";
import { Pressable } from "react-native";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useDebounce } from "../../hooks/useDebounce";
import { BaseSearchBar } from "./BaseSearchBar";

const ResultsContainer = styled(YStack, {
  position: "absolute",
  top: 48,
  left: "$3",
  right: "$3",
  backgroundColor: "$bg",
  borderRadius: "$2",
  padding: "$2",
  shadowColor: "$shadowColor",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 3,
  elevation: 3,
  zIndex: 1000,
});

const ResultRow = styled(Pressable, {
  paddingVertical: "$2",
  paddingHorizontal: "$3",
  backgroundColor: "$bg",
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

interface CourseSearchBarProps {
  onCourseSelect?: (course: Course) => void;
}

export function CourseSearchBar({ onCourseSelect }: CourseSearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 200);

  const searchResults = useQuery(api.queries.searchCourses, {
    searchTerm: debouncedSearchTerm,
  });

  const handleCourseSelect = (course: Course) => {
    onCourseSelect?.(course);
    setSearchTerm("");
  };

  return (
    <>
      <BaseSearchBar
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Search courses..."
        showDismissOverlay={true}
        accessoryId="courseSearchAccessoryID"
      />

      {searchResults && searchResults.length > 0 && (
        <ResultsContainer enterStyle={{ opacity: 0, scale: 0.95 }}>
          {searchResults.map((course: Course) => (
            <ResultRow
              key={`${course.department}${course.code}`}
              onPress={() => handleCourseSelect(course)}
            >
              <XStack alignItems="center" space="$2">
                <ResultCode>{course.code}:</ResultCode>
                <ResultTitle numberOfLines={1} ellipsizeMode="tail">
                  {course.title}
                </ResultTitle>
              </XStack>
            </ResultRow>
          ))}
        </ResultsContainer>
      )}
    </>
  );
}
