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
import { TouchableOpacity, Image, Platform } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const insets = useSafeAreaInsets();

  const HEADERS_SHOWN = true;

  const getHeaderHeight = () => {
    const baseHeight = 42; 
    const topInset = insets.top;
    return baseHeight + topInset;
  };

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
            height: getHeaderHeight(),
          },
          headerTitleStyle: {
            color: theme.white.val,
            fontSize: 24,
          },
          headerTitleContainerStyle: {
            paddingTop: 0,
          },
          headerTitleAlign: "center",
          headerStatusBarHeight: insets.top,
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
          top: HEADERS_SHOWN ? getHeaderHeight() + 2 : insets.top + 2,
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
