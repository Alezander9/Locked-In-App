import { SafeAreaView } from "react-native";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { Spinner, YStack } from "tamagui";
import { Course, SearchBar } from "@/components/SearchBar";
import EventList, { Event } from "@/components/EventCard";

export default function EventsScreen() {
  const events = useQuery(api.queries.getUpcomingEvents, { limit: 10 });

  const handleCourseSelect = (course: Course) => {
    console.log("Selected course:", course);
  };

  // Handle loading state
  if (events === undefined) {
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
          <SearchBar onCourseSelect={handleCourseSelect} />
          <YStack flex={1} marginTop="$3">
            <EventList events={events as Event[]} />
          </YStack>
        </YStack>
      </SafeAreaView>
    </ScreenWrapper>
  );
}
