import { Tabs } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ClassesIcon, GroupsIcon, TasksIcon } from "../components/icons";
import { useTheme } from "tamagui";

export default function TabLayout() {
  const theme = useTheme();
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        // Tab bar styling
        tabBarActiveTintColor: theme.primary.val,
        tabBarInactiveTintColor: theme.gray.val,
        tabBarStyle: {
          backgroundColor: theme.bg.val,
          borderTopColor: theme.borderColor.val,
        },
        // Header styling
        headerStyle: {
          backgroundColor: theme.bg.val,
        },
        headerTintColor: theme.color.val,
        headerTitleStyle: {
          color: theme.color.val,
        },
        // Header border
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="classes/index"
        options={{
          title: "Classes",
          tabBarLabel: "Classes",
          tabBarIcon: ({ color, focused }) => (
            <ClassesIcon color={color} size={30} />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks/index"
        options={{
          title: "Tasks",
          tabBarLabel: "Tasks",
          tabBarIcon: ({ color, focused }) => (
            <TasksIcon color={color} size={30} />
          ),
        }}
      />
      <Tabs.Screen
        name="groups/index"
        options={{
          title: "Groups",
          tabBarLabel: "Groups",
          tabBarIcon: ({ color, focused }) => (
            <GroupsIcon color={color} size={30} />
          ),
        }}
      />
    </Tabs>
  );
}
