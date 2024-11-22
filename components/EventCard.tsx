import React, { useEffect } from "react";
import { FlatList, SectionList } from "react-native";
import {
  CheckIcon,
  XIcon,
  LockIcon,
  UnlockIcon,
  LocationIcon,
  ClockIcon,
  UserCheckIcon,
} from "@/app/components/icons";
import { addDays, format, isBefore, isToday, isTomorrow } from "date-fns";
import { XStack, YStack, Text, useTheme } from "tamagui";
import { Id } from "@/convex/_generated/dataModel";
import { CircleIconButton } from "./CircleIconButton";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";

export interface Event {
  _id: Id<"events">;
  title: string;
  description: string;
  location: string;
  date: number;
  duration: number;
  public: boolean;
  yesList: Id<"users">[];
  noList: Id<"users">[];
}

interface EventCardProps {
  event: Event;
}

interface EventListProps {
  events: Event[];
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { userId } = useAuth();
  const user = useQuery(api.queries.getUserByClerkId, {
    clerkId: userId || "",
  });

  const toggleEventResponse = useMutation(api.mutations.toggleEventResponse);
  const [isLoading, setIsLoading] = React.useState(false);
  const theme = useTheme();

  const [optimisticYesNo, setOptimisticYesNo] = React.useState<
    "yes" | "no" | null
  >(null);

  useEffect(() => {
    if (!user) return;
    if (event.yesList.includes(user._id)) {
      setOptimisticYesNo("yes");
    } else if (event.noList.includes(user._id)) {
      setOptimisticYesNo("no");
    } else {
      setOptimisticYesNo(null);
    }
  }, [event, user]);

  const startDate = new Date(event.date);
  const endDate = new Date(event.date + event.duration * 60 * 1000);
  const dateStr = format(startDate, "EEE MM/dd");
  const timeStr = `${format(startDate, "h:mma")} - ${format(endDate, "h:mma")}`;

  const handleResponse = (response: "yes" | "no") => {
    if (!user) return;

    // Determine new state
    let newState: "yes" | "no" | null;
    if (response === "yes" && event.yesList.includes(user._id)) {
      newState = null;
    } else if (response === "no" && event.noList.includes(user._id)) {
      newState = null;
    } else {
      newState = response;
    }

    // Update state immediately
    setOptimisticYesNo(newState);

    // Handle API call in separate async function
    const updateServer = async () => {
      try {
        await toggleEventResponse({
          eventId: event._id,
          userId: user._id,
          response: response,
        });
      } catch (error) {
        // Revert on error
        setOptimisticYesNo(optimisticYesNo);
        console.error("Failed to toggle response:", error);
      }
    };

    // Fire and forget
    updateServer();
  };

  return (
    <YStack backgroundColor="$background">
      <XStack
        backgroundColor="$lightSeparator"
        paddingHorizontal="$4"
        paddingVertical="$2"
        justifyContent="space-between"
      >
        <XStack space="$2" alignItems="center">
          {event.public ? (
            <UnlockIcon size={14} color={theme.separatorText.val} />
          ) : (
            <LockIcon size={14} color={theme.separatorText.val} />
          )}
          <Text color="$separatorText" fontSize="$2">
            {event.public ? "PUBLIC STUDY SESSION" : "PRIVATE STUDY SESSION"}
          </Text>
        </XStack>
        <XStack space="$2" alignItems="center">
          <ClockIcon size={14} color={theme.separatorText.val} />
          <Text color="$separatorText" fontSize="$2">
            {`${dateStr} ${timeStr}`}
          </Text>
        </XStack>
      </XStack>

      <YStack space="$2" marginHorizontal="$4" marginBottom="$4" marginTop="$2">
        <Text fontWeight="bold" fontSize="$4">
          {event.title}
        </Text>
        <Text color="$color">{event.description}</Text>
      </YStack>

      <XStack
        marginHorizontal="$4"
        marginBottom="$1"
        justifyContent="space-between"
        alignItems="center"
      >
        <YStack space="$2">
          <XStack space="$2" alignItems="center">
            <LocationIcon size={10} color={theme.color.val} />
            <Text>{event.location}</Text>
          </XStack>
          <XStack space="$2" alignItems="center">
            <UserCheckIcon size={18} color={theme.color.val} />
            <Text color={theme.color.val} fontSize="$3">
              {event.yesList.length} people attending
            </Text>
          </XStack>
        </YStack>

        <XStack space="$2">
          <YStack alignItems="center" space={4}>
            <CircleIconButton
              icon={XIcon}
              size="medium"
              variant={
                user && optimisticYesNo === "no"
                  ? "secondaryOn"
                  : "secondaryOff"
              }
              onPress={() => handleResponse("no")}
              disabled={isLoading}
            />
            <Text fontSize="$2" color="$color">
              Can't Go
            </Text>
          </YStack>

          <YStack alignItems="center" space={4}>
            <CircleIconButton
              icon={CheckIcon}
              size="medium"
              variant={
                user && optimisticYesNo === "yes" ? "primaryOn" : "primaryOff"
              }
              onPress={() => handleResponse("yes")}
              disabled={isLoading}
            />
            <Text fontSize="$2" color="$color">
              Going
            </Text>
          </YStack>
        </XStack>
      </XStack>

      <XStack height={1} backgroundColor="$darkSeparator" />
    </YStack>
  );
};

interface EventSection {
  title: string;
  data: Event[];
}

const SectionHeader: React.FC<{ title: string }> = ({ title }) => {
  const theme = useTheme();

  return (
    <XStack
      backgroundColor="$lightSeparator"
      borderBottomWidth={1}
      borderBottomColor="$darkSeparator"
      paddingVertical="$1"
    >
      <Text
        color="$primary"
        fontSize="$4"
        textAlign="center"
        width="100%"
        fontWeight="bold"
      >
        {title}
      </Text>
    </XStack>
  );
};

const getDateTitle = (date: Date): string => {
  if (isToday(date)) {
    return "Today";
  }

  if (isTomorrow(date)) {
    return "Tomorrow";
  }

  // Calculate the date exactly one week from now
  const now = new Date();
  const oneWeekFromNow = addDays(now, 7);

  // If the date is less than one week away, just show the day name
  if (isBefore(date, oneWeekFromNow)) {
    return format(date, "EEEE"); // Returns just the day name (e.g., "Friday")
  }

  // For dates a week or more away, show the full format
  return format(date, "EEEE, MM/dd");
};

const EventList: React.FC<EventListProps> = ({ events }) => {
  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => a.date - b.date);

  // Group events by date sections
  const sections: EventSection[] = sortedEvents.reduce((acc, event) => {
    const eventDate = new Date(event.date);
    const title = getDateTitle(eventDate);

    // Find existing section or create new one
    const existingSection = acc.find((section) => section.title === title);
    if (existingSection) {
      existingSection.data.push(event);
    } else {
      acc.push({
        title,
        data: [event],
      });
    }

    return acc;
  }, [] as EventSection[]);

  return (
    <SectionList
      sections={sections}
      renderItem={({ item }) => <EventCard event={item} />}
      renderSectionHeader={({ section: { title } }) => (
        <SectionHeader title={title} />
      )}
      keyExtractor={(item) => item._id.toString()}
      stickySectionHeadersEnabled={true}
    />
  );
};

export default EventList;
