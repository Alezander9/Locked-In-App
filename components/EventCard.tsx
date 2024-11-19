import React, { useEffect } from "react";
import { FlatList } from "react-native";
import {
  CheckIcon,
  XIcon,
  LockIcon,
  UnlockIcon,
  LocationIcon,
  ClockIcon,
  UserCheckIcon,
  UserXIcon,
} from "@/app/components/icons";
import { format } from "date-fns";
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
  const toggleEventResponse = useMutation(api.mutations.toggleEventResponse);
  const [isLoading, setIsLoading] = React.useState(false);
  const theme = useTheme();

  const myUserId = useQuery(api.queries.getUserByClerkId, {
    clerkId: userId || "",
  });

  const [optimisticYesNo, setOptimisticYesNo] = React.useState<
    "yes" | "no" | null
  >(null);

  useEffect(() => {
    if (!myUserId) return;
    if (event.yesList.includes(myUserId._id)) {
      setOptimisticYesNo("yes");
    } else if (event.noList.includes(myUserId._id)) {
      setOptimisticYesNo("no");
    } else {
      setOptimisticYesNo(null);
    }
  }, [event, myUserId]);

  const startDate = new Date(event.date);
  const endDate = new Date(event.date + event.duration * 60 * 1000);
  const dateStr = format(startDate, "EEE MM/dd");
  const timeStr = `${format(startDate, "h:mma")} - ${format(endDate, "h:mma")}`;

  const handleResponse = (response: "yes" | "no") => {
    if (!myUserId) return;

    // Determine new state
    let newState: "yes" | "no" | null;
    if (response === "yes" && event.yesList.includes(myUserId._id)) {
      newState = null;
    } else if (response === "no" && event.noList.includes(myUserId._id)) {
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
          userId: myUserId._id,
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
            <UnlockIcon size={14} color={theme.seperatorText.val} />
          ) : (
            <LockIcon size={14} color={theme.seperatorText.val} />
          )}
          <Text color="$separatorText" fontSize="$2">
            {event.public ? "PUBLIC STUDY SESSION" : "PRIVATE STUDY SESSION"}
          </Text>
        </XStack>
        <XStack space="$2" alignItems="center">
          <ClockIcon size={14} color={theme.color.val} />
          <Text color="$separatorText" fontSize="$2">
            {`${dateStr} ${timeStr}`}
          </Text>
        </XStack>
      </XStack>

      <YStack space="$2" margin="$4">
        <Text fontWeight="bold" fontSize="$4">
          {event.title}
        </Text>
        <Text color="$color">{event.description}</Text>
      </YStack>

      <XStack
        marginHorizontal="$4"
        marginBottom="$4"
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
          <CircleIconButton
            icon={XIcon}
            size="medium"
            variant={
              myUserId && optimisticYesNo === "no"
                ? "secondaryOn"
                : "secondaryOff"
            }
            onPress={() => handleResponse("no")}
            disabled={isLoading}
          />
          <CircleIconButton
            icon={CheckIcon}
            size="medium"
            variant={
              myUserId && optimisticYesNo === "yes" ? "primaryOn" : "primaryOff"
            }
            onPress={() => handleResponse("yes")}
            disabled={isLoading}
          />
        </XStack>
      </XStack>

      <XStack height={1} backgroundColor="$darkSeparator" />
    </YStack>
  );
};

const EventList: React.FC<EventListProps> = ({ events }) => {
  return (
    <FlatList
      data={events}
      renderItem={({ item }) => <EventCard event={item} />}
      keyExtractor={(item) => item._id.toString()}
    />
  );
};

export default EventList;
