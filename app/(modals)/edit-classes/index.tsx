import { Stack, YStack, XStack, Text } from "tamagui";
import { router, useNavigation } from "expo-router";
import { ScreenWrapper } from "@/components/background/ScreenWrapper";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useToast } from "@/features/toast";
import DraggableFlatList from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useState, useEffect } from "react";
import {
  CourseSearchBar,
  type Course,
} from "@/components/searchBar/CourseSearchBar";
import type { Id } from "@/convex/_generated/dataModel";
import { EditableCourseRow } from "@/components/courses/EditableCourseRow";
import { useColorPickerStore } from "@/stores/colorPickerStore";

interface EditableCourse {
  _id: Id<"courses">;
  code: string;
  color: string;
  order: number;
}

export default function EditClassesModal() {
  const { showToast } = useToast();
  const userCourses = useQuery(api.queries.getUserCoursesOrdered) || [];
  const navigation = useNavigation();

  const addUserCourse = useMutation(api.mutations.addUserCourse);
  const updateUserCourseColor = useMutation(
    api.mutations.updateUserCourseColor
  );
  const updateUserCoursesOrder = useMutation(
    api.mutations.updateUserCoursesOrder
  );
  const deleteUserCourse = useMutation(api.mutations.deleteUserCourse);

  // Convert userCourses to EditableCourse array
  const [courses, setCourses] = useState<EditableCourse[]>([]);

  // Update state when query results change
  useEffect(() => {
    setCourses(userCourses as EditableCourse[]);
  }, [userCourses]);

  const { courseId, newColor, resetColorChoice } = useColorPickerStore();

  // Add effect to handle color updates
  useEffect(() => {
    if (courseId && newColor) {
      handleColorChange(courseId, newColor);
      resetColorChoice();
    }
  }, [courseId, newColor]);

  const handleDragEnd = async ({ data }: { data: EditableCourse[] }) => {
    // Update local state
    setCourses(data);

    // Update order in database
    try {
      await updateUserCoursesOrder({
        courseOrders: data.map((course, index) => ({
          courseId: course._id,
          order: index,
        })),
      });
    } catch (error) {
      showToast({
        message: "Failed to update course order",
      });
    }
  };

  const handleColorChange = async (
    courseId: Id<"courses">,
    newColor: string
  ) => {
    try {
      await updateUserCourseColor({
        courseId,
        color: newColor,
      });
    } catch (error) {
      showToast({
        message: "Failed to update course color",
      });
    }
  };

  const handleDelete = async (courseId: Id<"courses">) => {
    try {
      await deleteUserCourse({
        courseId,
      });
      showToast({
        message: "Course removed",
      });
    } catch (error) {
      showToast({
        message: "Failed to remove course",
      });
    }
  };

  const handleCourseSelect = async (course: Course) => {
    try {
      await addUserCourse({
        department: course.department,
        code: course.code,
        title: course.title,
      });
      showToast({
        message: "Course added",
      });
    } catch (error) {
      showToast({
        message: "Failed to add course",
      });
    }
  };

  return (
    <ScreenWrapper>
      <SafeAreaView style={{ flex: 1 }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack f={1} bg="$bg">
            {/* Header */}
            <XStack
              borderBottomColor="$borderColor"
              borderBottomWidth={1}
              justifyContent="space-between"
              alignItems="center"
            >
              <Text
                onPress={() => router.back()}
                color="$primary"
                fontSize="$4"
                padding="$4"
                width={100}
                textAlign="left"
              >
                Done
              </Text>
              <Text fontSize="$4" fontWeight="$4">
                Edit Classes
              </Text>
              <Text width={100} />
            </XStack>

            {/* Course Search */}
            <Stack
              borderBottomWidth={1}
              borderBottomColor="$borderColor"
              padding="$4"
              backgroundColor="$bg"
            >
              <CourseSearchBar onCourseSelect={handleCourseSelect} />
            </Stack>

            {/* Draggable Course List */}
            <Stack f={1}>
              <DraggableFlatList
                data={courses}
                keyExtractor={(item) => item._id}
                onDragEnd={handleDragEnd}
                renderItem={({ item, drag, isActive }) => (
                  <EditableCourseRow
                    id={item._id}
                    code={item.code}
                    color={item.color}
                    onColorPress={() => {
                      router.push({
                        pathname: "/input/color-picker",
                        params: {
                          courseId: item._id,
                          courseCode: item.code,
                          currentColor: item.color,
                        },
                      });
                    }}
                    onDelete={() => handleDelete(item._id)}
                    drag={drag}
                    isActive={isActive}
                  />
                )}
              />
            </Stack>
          </Stack>
        </GestureHandlerRootView>
      </SafeAreaView>
    </ScreenWrapper>
  );
}
