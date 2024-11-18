import { Tabs } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { EventIcon, GroupsIcon, TasksIcon } from "../components/icons";
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
        name="events/index"
        options={{
          title: "Events",
          tabBarLabel: "Events",
          tabBarIcon: ({ color, focused }) => (
            <EventIcon color={color} size={28} />
          ),
          headerShown: false,
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
            <GroupsIcon color={color} size={38} />
          ),
        }}
      />
    </Tabs>
  );
}
