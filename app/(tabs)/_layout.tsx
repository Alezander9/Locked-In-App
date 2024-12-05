import { Tabs } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  EventIcon,
  GroupsIcon,
  MenuIcon,
  SettingsIcon,
  TasksIcon,
  UserCheckIcon,
} from "../components/icons";
import { useTheme, YStack } from "tamagui";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { useState } from "react";
import { TouchableOpacity, Image } from "react-native";

export default function TabLayout() {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const HEADERS_SHOWN = true;

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
            backgroundColor: theme.blue.val,
            height: 80,
          },
          headerTitleStyle: {
            color: theme.white.val,
            fontSize: 24,
          },
          // Adjust header title position
          headerTitleAlign: "center",
          // Optional: Add padding/margin to the title
          headerTitleContainerStyle: {
            paddingTop: 0,
            paddingLeft: 0,
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
            headerShown: HEADERS_SHOWN,
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
            headerShown: HEADERS_SHOWN,
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
            headerShown: HEADERS_SHOWN,
          }}
        />
      </Tabs>
      <TouchableOpacity
        onPress={() => setIsSidebarOpen(true)}
        style={{
          position: "absolute",
          top: HEADERS_SHOWN ? 82 : 42, // previous 42 before headers added, 82 with headers
          left: 4,
          zIndex: 1,
          padding: 10,
        }}
      >
        <Image
          source={require("@/assets/images/LockedInLogo256x256.png")}
          style={{
            width: 34,
            height: 34,
          }}
          resizeMode="contain"
        />
        {/* <MenuIcon size={24} color={theme.color.val} /> */}
      </TouchableOpacity>
      <SettingsSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </YStack>
  );
}
