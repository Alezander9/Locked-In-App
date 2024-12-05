import { XStack, YStack, Text } from "tamagui";
import { Match } from "@/components/matches/MatchCard";
import { StudyProfile } from "@/convex/types";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

type ProfileStatsProps = {
  matches: Match[];
  studyProfile: StudyProfile;
};

export function ProfileStats({ matches, studyProfile }: ProfileStatsProps) {
  const acceptedMatches = matches.filter(
    (match) => match.status === "accepted"
  );

  const upcomingTasks = useQuery(api.queries.getUpcomingTasks, {
    limit: 100,
  });

  const userCourses = useQuery(api.queries.getUserCoursesOrdered, {});

  const stats = {
    matches: String(acceptedMatches.length),
    classes: String(userCourses?.length || 0),
    tasks: String(upcomingTasks?.length || 0),
  };

  const StatItem = ({ value, label }: { value: string; label: string }) => (
    <YStack alignItems="center" space="$0.5">
      <Text fontWeight="bold" fontSize="$4">
        {value}
      </Text>
      <Text color="$gray11" fontSize="$2">
        {label}
      </Text>
    </YStack>
  );

  return (
    <XStack
      justifyContent="space-around"
      alignItems="center"
      width="100%"
      marginTop="$0.5"
      paddingTop="$1"
      borderTopWidth={1}
      borderTopColor="$gray6"
    >
      <StatItem value={stats.matches} label="Matches" />
      <StatItem value={stats.classes} label="Classes" />
      <StatItem value={stats.tasks} label="Tasks" />
    </XStack>
  );
}
