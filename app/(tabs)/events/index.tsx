import { StyleSheet, Button, Platform, SafeAreaView } from "react-native";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { H1, H2, H3, XStack, YStack } from "tamagui";
import { Course, SearchBar } from "@/components/SearchBar";

export default function EventsScreen() {
  const tasks = useQuery(api.queries.getTasks);

  const handleCourseSelect = (course: Course) => {
    // Handle course selection here
    console.log("Selected course:", course);
  };

  return (
    <ScreenWrapper>
      <SafeAreaView>
        <YStack flex={1} backgroundColor="$background" marginBottom={50}>
          <SearchBar onCourseSelect={handleCourseSelect} />
        </YStack>

        <H3>Welcome!</H3>
        <H2>Test 1: connect to Convex</H2>
        <H1>If connected, you should see tasks below.</H1>
        {tasks?.map((task) => <H1 key={task._id}>{task.text}</H1>)}
        <H2>Test 2: Sign in with Clerk</H2>
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
