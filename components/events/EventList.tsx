import React from "react";
import { SectionList } from "react-native";
import { XStack, Text, useTheme } from "tamagui";
import { addDays, format, isBefore, isToday, isTomorrow } from "date-fns";
import EventCard, { Event } from "./EventCard";

interface EventListProps {
  events: Event[];
}

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

  const now = new Date();
  const oneWeekFromNow = addDays(now, 7);

  if (isBefore(date, oneWeekFromNow)) {
    return format(date, "EEEE");
  }

  return format(date, "EEEE, MM/dd");
};

const EventList: React.FC<EventListProps> = ({ events }) => {
  const sortedEvents = [...events].sort((a, b) => a.date - b.date);

  const sections: EventSection[] = sortedEvents.reduce((acc, event) => {
    const eventDate = new Date(event.date);
    const title = getDateTitle(eventDate);

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
