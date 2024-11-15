import { Tabs } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        // Add your default tab screen options here
        tabBarActiveTintColor: colorScheme === "dark" ? "white" : "black",
      }}
    >
      <Tabs.Screen
        name="classes/index"
        options={{
          title: "Classes",
          tabBarLabel: "Classes",
          // Add tab icon here if desired
        }}
      />
      <Tabs.Screen
        name="tasks/index"
        options={{
          title: "Tasks",
          tabBarLabel: "Tasks",
          // Add tab icon here if desired
        }}
      />
      <Tabs.Screen
        name="groups/index"
        options={{
          title: "Groups",
          tabBarLabel: "Groups",
          // Add tab icon here if desired
        }}
      />
    </Tabs>
  );
}
