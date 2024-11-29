import { YStack, XStack, Text, Image } from "tamagui";
import { CheckIcon, XIcon, ChevronDownIcon, ChevronUpIcon, MailIcon, MessageIcon, LinkedinIcon, InstagramIcon } from "@/app/components/icons";
import { CircleIconButton } from "@/components/CircleIconButton";
import { Button } from "@/components/CustomButton";
import { useState } from "react";
import { TouchableOpacity, Linking, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

// Define and export the Match type at the top
export type Match = {
  id: string;
  name: string;
  dorm: string;
  studyPreferences: {
    preferredLocations: string[];
    weeklyHours: number;
    noiseLevel: number; // 1-3 scale
  };
  timeAgo: string;
  courseId: string;
  status: 'none' | 'accepted' | 'rejected';
  hasCreatedStudyProfile: boolean;
  image: string;
};

// Update MOCK_MATCHES with more entries
export const MOCK_MATCHES: Match[] = [
  // CS103 Matches
  {
    id: "cs103_1",
    name: "Alex Chen",
    dorm: "Wilbur",
    studyPreferences: {
      preferredLocations: ["green", "lathrop"],
      weeklyHours: 6,
      noiseLevel: 2,
    },
    timeAgo: "2h ago",
    courseId: "CS103",
    status: 'none' as const,
    hasCreatedStudyProfile: true,
    image: "https://api.dicebear.com/7.x/micah/png?seed=Alex",
  },
  {
    id: "cs103_2",
    name: "Sarah Johnson",
    dorm: "Roble",
    studyPreferences: {
      preferredLocations: ["green", "meyer"],
      weeklyHours: 5,
      noiseLevel: 1,
    },
    timeAgo: "1h ago",
    courseId: "CS103",
    status: 'none' as const,
    hasCreatedStudyProfile: true,
    image: "https://api.dicebear.com/7.x/micah/png?seed=Sarah",
  },
  {
    id: "cs103_3",
    name: "Michael Lee",
    dorm: "Stern",
    studyPreferences: {
      preferredLocations: ["meyer"],
      weeklyHours: 8,
      noiseLevel: 3,
    },
    timeAgo: "3h ago",
    courseId: "CS103",
    status: 'none' as const,
    hasCreatedStudyProfile: true,
    image: "https://api.dicebear.com/7.x/micah/png?seed=Michael",
  },

  // CS107 Matches
  {
    id: "cs107_1",
    name: "Maria Rodriguez",
    dorm: "Stern",
    studyPreferences: {
      preferredLocations: ["green", "meyer"],
      weeklyHours: 4,
      noiseLevel: 1,
    },
    timeAgo: "4h ago",
    courseId: "CS107",
    status: 'none' as const,
    hasCreatedStudyProfile: true,
    image: "https://api.dicebear.com/7.x/micah/png?seed=Maria",
  },
  {
    id: "cs107_2",
    name: "David Kim",
    dorm: "FroSoCo",
    studyPreferences: {
      preferredLocations: ["lathrop"],
      weeklyHours: 7,
      noiseLevel: 2,
    },
    timeAgo: "5h ago",
    courseId: "CS107",
    status: 'none' as const,
    hasCreatedStudyProfile: true,
    image: "https://api.dicebear.com/7.x/micah/png?seed=David",
  },
  {
    id: "cs107_3",
    name: "Emma Wilson",
    dorm: "Lagunita",
    studyPreferences: {
      preferredLocations: ["green", "lathrop"],
      weeklyHours: 6,
      noiseLevel: 2,
    },
    timeAgo: "2h ago",
    courseId: "CS107",
    status: 'none' as const,
    hasCreatedStudyProfile: true,
    image: "https://api.dicebear.com/7.x/micah/png?seed=Emma",
  },

  // MATH51 Matches
  {
    id: "math51_1",
    name: "James Wilson",
    dorm: "EVGR-A",
    studyPreferences: {
      preferredLocations: ["lathrop", "meyer"],
      weeklyHours: 8,
      noiseLevel: 3,
    },
    timeAgo: "1h ago",
    courseId: "MATH51",
    status: 'none' as const,
    hasCreatedStudyProfile: true,
    image: "https://api.dicebear.com/7.x/micah/png?seed=James",
  },
  {
    id: "math51_2",
    name: "Olivia Brown",
    dorm: "Branner",
    studyPreferences: {
      preferredLocations: ["green"],
      weeklyHours: 5,
      noiseLevel: 1,
    },
    timeAgo: "6h ago",
    courseId: "MATH51",
    status: 'none' as const,
    hasCreatedStudyProfile: true,
    image: "https://api.dicebear.com/7.x/micah/png?seed=Olivia",
  },
  {
    id: "math51_3",
    name: "Lucas Garcia",
    dorm: "Toyon",
    studyPreferences: {
      preferredLocations: ["meyer", "lathrop"],
      weeklyHours: 7,
      noiseLevel: 2,
    },
    timeAgo: "3h ago",
    courseId: "MATH51",
    status: 'none' as const,
    hasCreatedStudyProfile: true,
    image: "https://api.dicebear.com/7.x/micah/png?seed=Lucas",
  },

  // CS161 Matches
  {
    id: "cs161_1",
    name: "Sophia Park",
    dorm: "Roble",
    studyPreferences: {
      preferredLocations: ["green"],
      weeklyHours: 5,
      noiseLevel: 2,
    },
    timeAgo: "3h ago",
    courseId: "CS161",
    status: 'none' as const,
    hasCreatedStudyProfile: true,
    image: "https://api.dicebear.com/7.x/micah/png?seed=Sophia",
  },
  {
    id: "cs161_2",
    name: "Ethan Martinez",
    dorm: "Mirrielees",
    studyPreferences: {
      preferredLocations: ["meyer", "green"],
      weeklyHours: 6,
      noiseLevel: 3,
    },
    timeAgo: "4h ago",
    courseId: "CS161",
    status: 'none' as const,
    hasCreatedStudyProfile: true,
    image: "https://api.dicebear.com/7.x/micah/png?seed=Ethan",
  },
  {
    id: "cs161_3",
    name: "Ava Thompson",
    dorm: "Crothers",
    studyPreferences: {
      preferredLocations: ["lathrop"],
      weeklyHours: 7,
      noiseLevel: 1,
    },
    timeAgo: "2h ago",
    courseId: "CS161",
    status: 'none' as const,
    hasCreatedStudyProfile: true,
    image: "https://api.dicebear.com/7.x/micah/png?seed=Ava",
  },
];

// Add this export function near the top of the file, after MOCK_MATCHES
export function getRandomMatchesForClass(className: string): Match[] {
  // Filter MOCK_MATCHES to get only matches for this class
  const classMatches = MOCK_MATCHES.filter(match => match.courseId === className);
  
  // If no matches found for this class, create some default matches
  if (classMatches.length === 0) {
    // Create 3 default matches for this class
    return [
      {
        id: `${className.toLowerCase()}_1`,
        name: "Alex Smith",
        dorm: "Wilbur",
        studyPreferences: {
          preferredLocations: ["green", "meyer"],
          weeklyHours: 6,
          noiseLevel: 2,
        },
        timeAgo: "2h ago",
        courseId: className,
        status: 'none' as const,
        hasCreatedStudyProfile: true,
        image: `https://api.dicebear.com/7.x/micah/png?seed=${className}_1`,
      },
      {
        id: `${className.toLowerCase()}_2`,
        name: "Emma Davis",
        dorm: "Stern",
        studyPreferences: {
          preferredLocations: ["lathrop"],
          weeklyHours: 5,
          noiseLevel: 1,
        },
        timeAgo: "3h ago",
        courseId: className,
        status: 'none' as const,
        hasCreatedStudyProfile: true,
        image: `https://api.dicebear.com/7.x/micah/png?seed=${className}_2`,
      },
      {
        id: `${className.toLowerCase()}_3`,
        name: "James Wilson",
        dorm: "FroSoCo",
        studyPreferences: {
          preferredLocations: ["green", "meyer"],
          weeklyHours: 7,
          noiseLevel: 3,
        },
        timeAgo: "1h ago",
        courseId: className,
        status: 'none' as const,
        hasCreatedStudyProfile: true,
        image: `https://api.dicebear.com/7.x/micah/png?seed=${className}_3`,
      },
    ];
  }
  
  return classMatches;
}

// Update MatchCardProps to extend from Match
type MatchCardProps = Partial<Match> & {
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: 'none' | 'accepted' | 'rejected') => void;
};

// Mock data for testing social links
const MOCK_SOCIAL_DATA = {
  email: "president@stanford.edu",
  phoneNumber: "6507232300",  // Format: "6505555555" for "+1 (650) 555-5555"
  linkedinUsername: "stanford-university",  // From linkedin.com/in/john-smith-stanford
  instagramUsername: "stanford",  // From instagram.com/johnsmith_23
};

// Helper functions for opening links
const openEmail = (email: string) => {
  Linking.openURL(`mailto:${email}`);
};

const openMessage = (phoneNumber: string) => {
  // Format phone number with proper URI scheme
  const formattedNumber = phoneNumber.replace(/\D/g, ''); // Remove non-digits
  Linking.openURL(`sms:${formattedNumber}`);
};

const openLinkedIn = (linkedinUsername: string) => {
  Linking.openURL(`linkedin://profile/${linkedinUsername}`).catch(() => {
    // Fallback to web URL if app isn't installed
    Linking.openURL(`https://www.linkedin.com/in/${linkedinUsername}`);
  });
};

const openInstagram = (instagramUsername: string) => {
  Linking.openURL(`instagram://user?username=${instagramUsername}`).catch(() => {
    // Fallback to web URL if app isn't installed
    Linking.openURL(`https://www.instagram.com/${instagramUsername}`);
  });
};

// Add this helper function at the top of the file
const generateEmail = (name: string): string => {
  // Convert "John Smith" to "john.smith@stanford.edu"
  return name
    .toLowerCase()
    .replace(/\s+/g, '.') // Replace spaces with dots
    .concat('@stanford.edu');
};

// Add this helper function to generate a random phone number
const generatePhone = (id: string): string => {
  // Use the id to generate a consistent phone number
  const areaCode = '650';
  const lastDigits = id
    .split('')
    .filter(char => /\d/.test(char))
    .slice(0, 7)
    .join('')
    .padEnd(7, '0');
  
  return `(${areaCode}) ${lastDigits.slice(0,3)}-${lastDigits.slice(3,7)}`;
};

export function MatchCard({ 
  hasCreatedStudyProfile = false,
  name = "",
  timeAgo = "",
  courseId = "",
  id = "",
  onDelete,
  status = 'none',
  onStatusChange,
  image = "https://api.dicebear.com/7.x/micah/png?seed=default",
  dorm = "",
  studyPreferences = {
    preferredLocations: [],
    weeklyHours: 0,
    noiseLevel: 2,
  },
}: MatchCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const deleteMatch = useMutation(api.mutations.deleteMatch);
  
  const handleCreateProfile = () => {
    router.replace("/(auth)/profile");
  };
  
  const handleRemoveMatch = (e: any) => {
    e.stopPropagation();
    Alert.alert(
      "",
      "Are you sure you want to remove this match?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          onPress: () => {
            if (!id || !onDelete) {
              console.error("No match ID provided or no delete handler");
              return;
            }
            onDelete(id);
            console.log(`Removed match with ID: ${id}`);
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };
  
  const handleStatusChange = (e: any) => {
    e.stopPropagation();
    // Only allow changing from 'none' to 'accepted'
    if (status === 'none') {
      console.log('Changing status from none to accepted');
      onStatusChange?.(id, 'accepted');
    }
    // If already accepted, do nothing
  };
  
  if (!hasCreatedStudyProfile) {
    return (
      <YStack>
        <XStack
          backgroundColor="$background"
          borderRadius="$4"
          padding="$4"
          justifyContent="center"
          alignItems="center"
        >
          <Text 
            color="$gray11" 
            fontSize="$4" 
            textAlign="center"
          >
            Create a study profile to start receiving potential study partners
          </Text>
        </XStack>
        
        <Button
          label="Create Study Profile"
          onPress={handleCreateProfile}
          size="medium"
        />
      </YStack>
    );
  }

  return (
    <YStack>
      <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
        <XStack 
          backgroundColor="$background"
          borderRadius="$4"
          padding="$3"
          space="$3"
          borderBottomWidth={1}
          borderBottomColor="$gray6"
        >
          {/* Profile Picture */}
          <YStack
            width={48}
            height={48}
            borderRadius={24}
            overflow="hidden"
          >
            <Image
              source={{ uri: image }}
              width={48}
              height={48}
              resizeMode="cover"
            />
          </YStack>

          {/* Content */}
          <YStack flex={1} space="$1">
            <XStack justifyContent="space-between" alignItems="center" width="100%">
              <Text fontWeight="bold" fontSize="$4">{name}</Text>
            </XStack>
            
            {/* Location */}
            <Text color="$gray11" fontSize="$3">
              {dorm} • {studyPreferences.preferredLocations.join(", ")}
            </Text>
            
            {/* Study Preferences */}
            <Text color="$gray11" fontSize="$3">
              {studyPreferences.weeklyHours}h/week • {
                studyPreferences.noiseLevel === 1 ? "Quiet" :
                studyPreferences.noiseLevel === 2 ? "Moderate" : "Social"
              } study
            </Text>
            
            {/* Time */}
            <Text color="$gray10" fontSize="$3">{timeAgo}</Text>
          </YStack>

          {/* Accept/Reject Buttons */}
          <XStack space="$2" alignItems="center">
            <YStack alignItems="center" space={4}>
              <CircleIconButton
                icon={XIcon}
                size="medium"
                variant={status === 'rejected' ? 'secondaryOn' : 'secondaryOff'}
                onPress={handleRemoveMatch}
              />
            </YStack>

            <YStack alignItems="center" space={4}>
              <CircleIconButton
                key={`${id}-${status}`}
                icon={CheckIcon}
                size="medium"
                variant={status === 'accepted' ? 'primaryOn' : 'primaryOff'}
                onPress={status === 'none' ? handleStatusChange : undefined}  // Disable onPress if already accepted
              />
            </YStack>
          </XStack>
        </XStack>
      </TouchableOpacity>

      {/* Expanded Content */}
      {isExpanded && (
        <YStack
          backgroundColor="$background"
          paddingHorizontal="$3"
          paddingTop="$1"
          borderBottomWidth={1}
          borderBottomColor="$gray6"
        >
          <XStack space="$2">
            <Text fontWeight="bold" color="$gray11">Email:</Text>
            <Text color="$gray11">{generateEmail(name)}</Text>
          </XStack>
          <XStack space="$2" paddingTop="$1">
            <Text fontWeight="bold" color="$gray11">Phone:</Text>
            <Text color="$gray11">{generatePhone(id)}</Text>
          </XStack>
          
          {/* Social Media Icons */}
          <XStack 
            space="$4" 
            paddingTop="$2" 
            paddingBottom="$1"
            justifyContent="center"
          >
            {/* Mail/Outlook */}
            <TouchableOpacity 
              onPress={() => openEmail(MOCK_SOCIAL_DATA.email)}
            >
              <YStack
                width={36}
                height={36}
                borderRadius={18}
                backgroundColor="#0078D4"
                justifyContent="center"
                alignItems="center"
              >
                <MailIcon size={24} color="white" />
              </YStack>
            </TouchableOpacity>

            {/* iMessage */}
            <TouchableOpacity 
              onPress={() => openMessage(MOCK_SOCIAL_DATA.phoneNumber)}
            >
              <YStack
                width={36}
                height={36}
                borderRadius={18}
                backgroundColor="#00C301"
                justifyContent="center"
                alignItems="center"
              >
                <MessageIcon size={24} color="white" />
              </YStack>
            </TouchableOpacity>

            {/* LinkedIn */}
            <TouchableOpacity 
              onPress={() => openLinkedIn(MOCK_SOCIAL_DATA.linkedinUsername)}
            >
              <YStack
                width={36}
                height={36}
                borderRadius={18}
                backgroundColor="#0A66C2"
                justifyContent="center"
                alignItems="center"
              >
                <LinkedinIcon size={24} color="white" />
              </YStack>
            </TouchableOpacity>

            {/* Instagram */}
            <TouchableOpacity 
              onPress={() => openInstagram(MOCK_SOCIAL_DATA.instagramUsername)}
            >
              <YStack
                width={36}
                height={36}
                borderRadius={18}
                backgroundColor="white"
                justifyContent="center"
                alignItems="center"
              >
                <InstagramIcon size={24} />
              </YStack>
            </TouchableOpacity>
          </XStack>
        </YStack>
      )}
    </YStack>
  );
}
