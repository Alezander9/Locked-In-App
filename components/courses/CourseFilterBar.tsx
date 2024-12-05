import { ScrollView } from "react-native";
import { Stack, styled, useTheme } from "tamagui";
import { CourseFilterChip } from "./CourseFilterChip";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useState, useEffect } from "react";
import { Pressable, TouchableOpacity } from "react-native";
import { PlusIcon } from "@/app/components/icons";
import { router } from "expo-router";

interface CourseFilter {
  courseId: Id<"courses">;
  isActive: boolean;
}

interface CourseFilterBarProps {
  onFiltersChange: (activeCourseIds: Id<"courses">[]) => void;
  exclusiveSelection?: boolean;
}

export function CourseFilterBar({
  onFiltersChange,
  exclusiveSelection = false,
}: CourseFilterBarProps) {
  const userCourses = useQuery(api.queries.getUserCoursesOrdered);
  const theme = useTheme();
  const [filters, setFilters] = useState<CourseFilter[]>([]);

  // Initialize filters when userCourses changes
  useEffect(() => {
    if (userCourses) {
      const newFilters = userCourses
        .filter(
          (
            course
          ): course is typeof course & { _id: Id<"courses">; code: string } =>
            course._id !== undefined && course.code !== undefined
        )
        .map((course) => ({
          courseId: course._id,
          isActive: !exclusiveSelection,
        }));
      setFilters(newFilters);
      onFiltersChange(
        exclusiveSelection ? [] : newFilters.map((f) => f.courseId)
      );
    }
  }, [userCourses, exclusiveSelection]);

  const handleToggle = (courseId: Id<"courses">) => {
    const newFilters = filters.map((filter) => ({
      ...filter,
      isActive: exclusiveSelection
        ? filter.courseId === courseId && !filter.isActive
        : filter.courseId === courseId
          ? !filter.isActive
          : filter.isActive,
    }));
    setFilters(newFilters);

    const activeCourseIds = newFilters
      .filter((f) => f.isActive)
      .map((f) => f.courseId);
    onFiltersChange(activeCourseIds);
  };

  const handleAddCourses = () => {
    router.push("/edit-classes");
  };

  if (!userCourses) return null;

  return (
    <Stack
      height={42}
      borderTopWidth={1}
      borderBottomWidth={1}
      borderColor="$darkSeparator"
      marginTop="$1"
      backgroundColor="$background"
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 4,
          paddingRight: 8, // Reduced right padding to account for add button
        }}
      >
        {userCourses
          .filter(
            (
              course
            ): course is typeof course & {
              _id: Id<"courses">;
              code: string;
              color: string;
            } =>
              course._id !== undefined &&
              course.code !== undefined &&
              course.color !== undefined
          )
          .map((course) => (
            <CourseFilterChip
              key={course._id}
              code={course.code}
              color={course.color}
              isActive={
                filters.find((f) => f.courseId === course._id)?.isActive ?? true
              }
              onPress={() => handleToggle(course._id)}
            />
          ))}

        {/* Add Courses Button */}
        <TouchableOpacity
          onPress={handleAddCourses}
          style={[
            {
              height: 32,
              width: 32,
              borderRadius: 16,
              backgroundColor: theme.lightSeparator.val,
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 4,
            },
          ]}
        >
          <PlusIcon size={16} color={theme.separatorText.val} />
        </TouchableOpacity>
      </ScrollView>
    </Stack>
  );
}
