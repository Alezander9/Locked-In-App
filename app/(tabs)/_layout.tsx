import { Tabs } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  EventIcon,
  GroupsIcon,
  SettingsIcon,
  TasksIcon,
  UserCheckIcon,
} from "../components/icons";
import { useTheme, YStack } from "tamagui";
import { SettingsSidebar } from "@/components/SettingsSidebar";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
export default function TabLayout() {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <YStack flex={1}>
      <Tabs
        screenOptions={{
          // Tab bar styling
          tabBarActiveTintColor: theme.primary.val,
          tabBarInactiveTintColor: theme.gray.val,
          tabBarStyle: {
            backgroundColor: theme.bg.val,
            borderTopColor: theme.darkSeparator.val,
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
      <TouchableOpacity
        onPress={() => setIsSidebarOpen(true)}
        style={{
          position: "absolute",
          top: 58,
          left: 20,
          zIndex: 1,
        }}
      >
        <SettingsIcon size={24} color={theme.color.val} />
      </TouchableOpacity>
      <SettingsSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </YStack>
  );
}
