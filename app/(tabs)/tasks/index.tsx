import { SafeAreaView } from "react-native";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { Spinner, XStack, YStack, Text } from "tamagui";
import { TouchableOpacity } from "react-native";
import { WriteIcon } from "@/app/components/icons";
import { useTheme } from "tamagui";
import { FilterSearchBar } from "@/components/searchBar/FilterSearchBar";
import { TaskList } from "@/components/tasks/TaskList";
import { useMemo, useState } from "react";
import { router } from "expo-router";
import { Id } from "@/convex/_generated/dataModel";

// Define Task type for filtering
interface Task {
  _id: Id<"tasks">;
  title: string;
  notes: string;
  isCompleted: boolean;
  courseColor: string;
  courseCode: string;
  dueDate: number;
}

export default function TasksScreen() {
  const tasks = useQuery(api.queries.getUpcomingTasks, { limit: 20 });
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter tasks based on search term
  const filteredTasks = useMemo(() => {
    if (!tasks || !searchTerm.trim()) {
      return tasks;
    }

    const normalizedSearchTerm = searchTerm.toLowerCase().trim();
    return tasks.filter((task: Task) => {
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
  }, [tasks, searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleMakeTasks = () => {
    router.push({
      pathname: "/(modals)/create-tasks",
      params: {
        presentation: "modal",
      },
    });
  };

  // Handle loading state
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
