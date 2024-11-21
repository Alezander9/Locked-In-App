import { SafeAreaView } from "react-native";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { Spinner, XStack, YStack } from "tamagui";
import { Course, SearchBar } from "@/components/SearchBar";
import EventList, { Event } from "@/components/EventCard";
import { TouchableOpacity } from "react-native";
import { WriteIcon } from "@/app/components/icons";
import { useTheme } from "tamagui";
export default function EventsScreen() {
  const events = useQuery(api.queries.getUpcomingEvents, { limit: 10 });
  const theme = useTheme();
  const handleCourseSelect = (course: Course) => {
    console.log("Selected course:", course);
  };

  const handleMakeEvent = () => {
    console.log("Make event clicked");
    // TODO: Implement event creation logic
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
          <XStack
            marginLeft={50}
            marginRight={50}
            justifyContent="space-between"
            alignItems="center"
          >
            <SearchBar onCourseSelect={handleCourseSelect} />
            <TouchableOpacity
              onPress={handleMakeEvent}
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
            <EventList events={events as Event[]} />
          </YStack>
        </YStack>
      </SafeAreaView>
    </ScreenWrapper>
  );
}
