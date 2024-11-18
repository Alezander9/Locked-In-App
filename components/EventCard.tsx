import React from "react";
import { FlatList } from "react-native";
import { CheckIcon, XIcon } from "@/app/components/icons";
import { format } from "date-fns";
import { XStack, YStack, Text } from "tamagui";
import { Id } from "@/convex/_generated/dataModel";
import { CircleIconButton } from "./CircleIconButton";

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
  const startDate = new Date(event.date);
  const endDate = new Date(event.date + event.duration * 60 * 1000);

  const dateStr = format(startDate, "EEE MM/dd");
  const timeStr = `${format(startDate, "h:mma")} - ${format(endDate, "h:mma")}`;

  return (
    <YStack backgroundColor="$background">
      <XStack
        backgroundColor="$lightSeparator"
        paddingHorizontal="$4"
        paddingVertical="$2"
        justifyContent="space-between"
      >
        <Text color="$separatorText" fontSize="$2">
          {event.public ? "PUBLIC STUDY SESSION" : "PRIVATE STUDY SESSION"}
        </Text>
        <Text color="$separatorText" fontSize="$2">
          {`${dateStr} ${timeStr}`}
        </Text>
      </XStack>

      <YStack space="$2" margin="$4">
        <Text fontWeight="bold" fontSize="$4">
          {event.title}
        </Text>
        <Text color="$gray11">{event.description}</Text>
      </YStack>

      <XStack
        marginHorizontal="$4"
        marginBottom="$4"
        justifyContent="space-between"
        alignItems="center"
      >
        <YStack space="$1">
          <Text>{event.location}</Text>
          <Text color="$gray11" fontSize="$3">
            {event.yesList.length} people attending
          </Text>
        </YStack>

        <XStack space="$2">
          <CircleIconButton
            icon={XIcon}
            size="medium"
            variant="secondaryOff"
            onPress={() => {}}
          />
          <CircleIconButton
            icon={CheckIcon}
            size="medium"
            variant="primaryOff"
            onPress={() => {}}
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
