import { YStack } from "tamagui";
import { MatchCard } from "./MatchCard";
import { SectionList } from "react-native";
import { Text, XStack } from "tamagui";
import { FilterSearchBar } from "@/components/searchBar/FilterSearchBar";
import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MOCK_MATCHES, Match, getRandomMatchesForClass } from './MatchCard';

type MatchesContainerProps = {
  searchTerm: string;
  matches: Match[];
  setMatches: React.Dispatch<React.SetStateAction<Match[]>>;
};

// Section Header Component
const SectionHeader = ({ title }: { title: string }) => (
  <XStack
    backgroundColor="$lightSeparator"
    borderBottomWidth={1}
    borderBottomColor="$darkSeparator"
    paddingVertical="$3"
    paddingHorizontal="$4"
    justifyContent="center"
  >
    <Text
      color="$primary"
      fontSize="$4"
      fontWeight="bold"
      textAlign="center"
      width="100%"
    >
      {title}
    </Text>
  </XStack>
);

// Update the helper function to be more comprehensive
const matchesSearchTerm = (match: Match, searchTerm: string): boolean => {
  const searchLower = searchTerm.toLowerCase().trim();
  
  // Basic fields
  if (match.name.toLowerCase().includes(searchLower)) return true;
  if (match.courseId.toLowerCase().includes(searchLower)) return true;
  if (match.dorm.toLowerCase().includes(searchLower)) return true;
  
  // Study preferences
  if (match.studyPreferences.preferredLocations.some(loc => 
    loc.toLowerCase().includes(searchLower)
  )) return true;
  
  // Weekly hours (search for "5 hours" or "5h")
  if (match.studyPreferences.weeklyHours.toString().includes(searchLower) ||
      `${match.studyPreferences.weeklyHours}h`.includes(searchLower) ||
      `${match.studyPreferences.weeklyHours} hours`.includes(searchLower)) return true;
  
  // Noise level preferences
  const noiseLevel = match.studyPreferences.noiseLevel === 1 ? "quiet" :
                    match.studyPreferences.noiseLevel === 2 ? "moderate" : "social";
  if (noiseLevel.includes(searchLower)) return true;
  
  // Time posted
  if (match.timeAgo.toLowerCase().includes(searchLower)) return true;
  
  return false;
};

export function MatchesContainer({ searchTerm, matches, setMatches }: MatchesContainerProps) {
  const studyProfile = useQuery(api.queries.getStudyProfile, {});
  const [deletedMatchIds, setDeletedMatchIds] = useState<Set<string>>(new Set());

  const sections = useMemo(() => {
    if (!studyProfile?.classes?.length) return [];
    
    if (!searchTerm.trim()) {
      // Group matches by course
      const matchesByClass = studyProfile.classes.map(classInfo => {
        const classMatches = matches
          .filter(match => 
            match.courseId === classInfo.name.toUpperCase() && 
            !deletedMatchIds.has(match.id)
          );
        
        return {
          title: classInfo.name.toUpperCase(),
          data: classMatches
        };
      }).filter(section => section.data.length > 0);

      return matchesByClass;
    } else {
      // Use the new comprehensive search function
      const filteredMatches = matches
        .filter(match => !deletedMatchIds.has(match.id))
        .filter(match => matchesSearchTerm(match, searchTerm));
      
      return [{
        title: `Searching for "${searchTerm.trim()}"`,
        data: filteredMatches,
      }];
    }
  }, [matches, searchTerm, studyProfile?.classes, deletedMatchIds]);

  const handleDeleteMatch = (matchId: string) => {
    // Update both the matches state and deletedMatchIds
    setMatches(currentMatches => 
      currentMatches.filter(match => match.id !== matchId)
    );
    setDeletedMatchIds(current => {
      const updated = new Set(current);
      updated.add(matchId);
      return updated;
    });
  };

  const handleStatusChange = (matchId: string, newStatus: 'none' | 'accepted' | 'rejected') => {
    console.log('Container handling status change:', matchId, newStatus);
    
    // Update both the matches state and the MOCK_MATCHES array
    setMatches(currentMatches => {
      const updatedMatches = currentMatches.map(match => 
        match.id === matchId ? { ...match, status: newStatus } : match
      );
      
      // Also update MOCK_MATCHES to persist the change
      const matchIndex = MOCK_MATCHES.findIndex(m => m.id === matchId);
      if (matchIndex !== -1) {
        MOCK_MATCHES[matchIndex] = { ...MOCK_MATCHES[matchIndex], status: newStatus };
      }
      
      return updatedMatches;
    });
  };

  return (
    <YStack flex={1}>
      <SectionList
        sections={sections}
        renderItem={({ item }) => (
          <YStack paddingHorizontal="$4" paddingVertical="$2">
            <MatchCard 
              {...item} 
              hasCreatedStudyProfile={true}
              onDelete={handleDeleteMatch}
              onStatusChange={handleStatusChange}
            />
          </YStack>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <SectionHeader title={title} />
        )}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={true}
        contentContainerStyle={{
          paddingVertical: 16,
        }}
      />
    </YStack>
  );
}
