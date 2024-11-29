import { YStack } from "tamagui";
import { MatchCard } from "./MatchCard";
import { SectionList } from "react-native";
import { Text, XStack } from "tamagui";
import { FilterSearchBar } from "@/components/searchBar/FilterSearchBar";
import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MOCK_MATCHES } from './MatchCard';
import { Match } from './MatchCard';

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

// Add this helper function at the top, outside the component
const contains = (text: string, searchTerm: string): boolean => {
  return text.toLowerCase().includes(searchTerm.toLowerCase());
};

export function MatchesContainer({ searchTerm, matches, setMatches }: MatchesContainerProps) {
  const studyProfile = useQuery(api.queries.getStudyProfile, {});
  const [initialDistribution] = useState(() => {
    // Create the initial distribution of matches when component mounts
    if (!studyProfile?.classes?.length) return [];
    
    let availableMatches = [...matches];
    return studyProfile.classes.map(classInfo => {
      const maxPossibleMatches = Math.min(
        availableMatches.length,
        Math.floor(Math.random() * 2) + 1
      );
      
      const classMatches = [];
      for (let i = 0; i < maxPossibleMatches; i++) {
        const randomIndex = Math.floor(Math.random() * availableMatches.length);
        const match = {
          ...availableMatches[randomIndex],
          courseId: classInfo.name.toUpperCase()
        };
        classMatches.push(match);
        availableMatches.splice(randomIndex, 1);
      }
      
      return {
        title: classInfo.name.toUpperCase(),
        data: classMatches
      };
    }).filter(section => section.data.length > 0);
  });

  const handleDeleteMatch = (matchId: string) => {
    setMatches(currentMatches => 
      currentMatches.filter(match => match.id !== matchId)
    );
  };

  const handleStatusChange = (matchId: string, newStatus: 'none' | 'accepted' | 'rejected') => {
    setMatches(currentMatches => 
      currentMatches.map(match => 
        match.id === matchId ? { ...match, status: newStatus } : match
      )
    );
  };

  // Use initialDistribution for the sections
  const sections = useMemo(() => {
    if (!searchTerm.trim()) {
      // Use the initial distribution but with updated match statuses
      return initialDistribution.map(section => ({
        ...section,
        data: section.data.map(match => {
          const updatedMatch = matches.find(m => m.id === match.id);
          return updatedMatch || match;
        })
      }));
    } else {
      // Search functionality
      const searchLower = searchTerm.trim().toLowerCase();
      const filteredMatches = matches.filter(match => 
        match.name.toLowerCase().includes(searchLower) ||
        match.courseId.toLowerCase().includes(searchLower)
      );
      
      return [{
        title: `Searching for "${searchTerm.trim()}"`,
        data: filteredMatches,
      }];
    }
  }, [matches, searchTerm, initialDistribution]);

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
