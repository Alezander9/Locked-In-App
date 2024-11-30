import { SafeAreaView } from "react-native";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { ScreenWrapper } from "@/components/background/ScreenWrapper";
import { Spinner, XStack, YStack, Text } from "tamagui";
import { TouchableOpacity } from "react-native";
import { WriteIcon } from "@/app/components/icons";
import { useTheme } from "tamagui";
import { FilterSearchBar } from "@/components/searchBar/FilterSearchBar";
import { TaskList } from "@/components/tasks/TaskList";
import { CourseFilterBar } from "@/components/courses/CourseFilterBar";
import { useMemo, useState } from "react";
import { router } from "expo-router";
import { Id } from "@/convex/_generated/dataModel";

interface Task {
  _id: Id<"tasks">;
  title: string;
  notes: string;
  isCompleted: boolean;
  courseColor: string;
  courseCode: string;
  courseId: Id<"courses">;
  dueDate: number;
}

export default function TasksScreen() {
  const tasks = useQuery(api.queries.getUpcomingTasks, { limit: 20 });
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCourseIds, setActiveCourseIds] = useState<Id<"courses">[]>([]);

  // Filter tasks based on search term and active courses
  const filteredTasks = useMemo(() => {
    if (!tasks) return [];

    let filtered = tasks;

    // Apply course filter if there are active courses
    if (activeCourseIds.length > 0) {
      filtered = filtered.filter((task) =>
        activeCourseIds.includes(task.courseId)
      );
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const normalizedSearchTerm = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((task: Task) => {
        const titleMatch = task.title
          .toLowerCase()
          .includes(normalizedSearchTerm);
        const notesMatch = task.notes
          .toLowerCase()
          .includes(normalizedSearchTerm);
        const courseMatch = task.courseCode
          .toLowerCase()
          .includes(normalizedSearchTerm);
        return titleMatch || notesMatch || courseMatch;
      });
    }

    return filtered;
  }, [tasks, searchTerm, activeCourseIds]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFiltersChange = (courseIds: Id<"courses">[]) => {
    setActiveCourseIds(courseIds);
  };

  const handleMakeTasks = () => {
    router.push({
      pathname: "/(modals)/create-tasks",
      params: {
        presentation: "modal",
      },
    });
  };

  if (tasks === undefined) {
    return (
      <ScreenWrapper>
        <SafeAreaView style={{ flex: 1 }}>
          <YStack
            flex={1}
            backgroundColor="$background"
            alignItems="center"
            justifyContent="center"
          >
            <Spinner size="large" />
          </YStack>
        </SafeAreaView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <SafeAreaView style={{ flex: 1 }}>
        <YStack flex={1} backgroundColor="$background">
          {/* Search and Add Button */}
          <XStack
            marginLeft={50}
            marginRight={50}
            justifyContent="space-between"
            alignItems="center"
          >
            <FilterSearchBar
              onSearch={handleSearch}
              placeholder="Search tasks..."
            />
            <TouchableOpacity
              onPress={handleMakeTasks}
              style={{
                paddingLeft: 6,
                paddingRight: 12,
                paddingVertical: 6,
              }}
            >
              <WriteIcon size={26} color={theme.color.val} />
            </TouchableOpacity>
          </XStack>

          {/* Course Filter Bar */}
          <CourseFilterBar onFiltersChange={handleFiltersChange} />

          {/* Task List */}
          <YStack flex={1} marginTop="$3">
            {filteredTasks && filteredTasks.length > 0 ? (
              <TaskList tasks={filteredTasks} />
            ) : (
              <YStack
                flex={1}
                alignItems="center"
                justifyContent="center"
                opacity={0.5}
              >
                <Text color="$color" fontSize="$4">
                  {searchTerm.trim()
                    ? "No tasks found matching your search"
                    : "No upcoming tasks"}
                </Text>
              </YStack>
            )}
          </YStack>
        </YStack>
      </SafeAreaView>
    </ScreenWrapper>
  );
}
