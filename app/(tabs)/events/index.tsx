import { SafeAreaView } from "react-native";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { Spinner, XStack, YStack, Text } from "tamagui";
import { TouchableOpacity } from "react-native";
import { WriteIcon } from "@/app/components/icons";
import { useTheme } from "tamagui";
import { FilterSearchBar } from "@/components/searchBar/FilterSearchBar";
import EventList, { Event } from "@/components/EventCard";
import { useMemo, useState } from "react";
import { router } from "expo-router";

export default function EventsScreen() {
  const events = useQuery(api.queries.getUpcomingEvents, { limit: 10 });
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter events based on search term
  const filteredEvents = useMemo(() => {
    if (!events || !searchTerm.trim()) {
      return events;
    }

    const normalizedSearchTerm = searchTerm.toLowerCase().trim();

    return events.filter((event: Event) => {
      const titleMatch = event.title
        ?.toLowerCase()
        .includes(normalizedSearchTerm);
      const descriptionMatch = event.description
        ?.toLowerCase()
        .includes(normalizedSearchTerm);
      return titleMatch || descriptionMatch;
    });
  }, [events, searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleMakeEvent = () => {
    router.push({
      pathname: "/(modals)/create-event",
      params: {
        presentation: "modal",
      },
    });
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
            <FilterSearchBar
              onSearch={handleSearch}
              placeholder="Search events..."
            />
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
            {filteredEvents && filteredEvents.length > 0 ? (
              <EventList events={filteredEvents as Event[]} />
            ) : (
              <YStack
                flex={1}
                alignItems="center"
                justifyContent="center"
                opacity={0.5}
              >
                <Text color="$color" fontSize="$4">
                  {searchTerm.trim()
                    ? "No events found matching your search"
                    : "No upcoming events"}
                </Text>
              </YStack>
            )}
          </YStack>
        </YStack>
      </SafeAreaView>
    </ScreenWrapper>
  );
}
