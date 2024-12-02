import { useState, useEffect } from "react";
import { SafeAreaView, TouchableOpacity } from "react-native";
import { YStack, XStack, Text } from "tamagui";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTheme } from "tamagui";
import {
  Match,
  getRandomMatchesForClass,
} from "@/components/matches/MatchCard";
import { StudyProfile } from "@/convex/types";

import { Button } from "@/components/buttons/CustomButton";
import { ScreenWrapper } from "@/components/background/ScreenWrapper";
import { FilterSearchBar } from "@/components/searchBar/FilterSearchBar";
import { SettingsIcon } from "@/app/components/icons";
import { MatchesContainer } from "@/components/matches/MatchesContainer";
import { ProfileBackground } from "@/components/profile/ProfileBackground";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { Id } from "@/convex/_generated/dataModel";
function ProfileHeader({ matches }: { matches: Match[] }) {
  const { userId } = useAuth();
  const theme = useTheme();

  const user = useQuery(api.queries.getUserByClerkId, {
    clerkId: userId || "",
  });
  const studyProfile = useQuery(api.queries.getStudyProfile, {}) as
    | StudyProfile
    | null
    | undefined;

  const saveProfilePicture = useMutation(api.mutations.saveProfilePicture);
  const saveBackgroundPicture = useMutation(
    api.mutations.saveBackgroundPicture
  );
  const updateStudyProfile = useMutation(api.mutations.updateStudyProfile);

  const imageUrl = useQuery(
    api.queries.getImageUrl,
    user?.profilePictureStorageId
      ? { storageId: user.profilePictureStorageId }
      : "skip"
  );

  const backgroundImageUrl = useQuery(
    api.queries.getImageUrl,
    user?.backgroundPictureStorageId
      ? { storageId: user.backgroundPictureStorageId }
      : "skip"
  );

  const handleSaveProfilePicture = async (storageId: Id<"_storage">) => {
    if (!user?._id) return;
    await saveProfilePicture({
      storageId,
      userID: user._id as Id<"users">,
    });
  };

  const handleSaveBackgroundPicture = async (storageId: Id<"_storage">) => {
    if (!user?._id) return;
    await saveBackgroundPicture({
      storageId,
      userID: user._id as Id<"users">,
    });
  };

  return (
    <YStack>
      <YStack position="relative">
        <ProfileBackground
          backgroundImageUrl={backgroundImageUrl}
          onUploadSuccess={handleSaveBackgroundPicture}
          userId={userId || ""}
        />

        <YStack
          position="absolute"
          bottom={10}
          width="100%"
          alignItems="center"
          justifyContent="center"
        >
          <ProfileAvatar
            imageUrl={imageUrl}
            onUploadSuccess={handleSaveProfilePicture}
            userId={userId || ""}
          />
        </YStack>
      </YStack>

      <YStack
        backgroundColor="$background"
        marginTop={8}
        marginBottom="$2"
        padding="$3"
        alignItems="center"
      >
        <Text
          fontSize="$5"
          fontWeight="bold"
          textAlign="center"
          marginBottom="$2"
        >
          {user?.firstName} {user?.lastName}
        </Text>
        {studyProfile && (
          <ProfileStats matches={matches} studyProfile={studyProfile} />
        )}
      </YStack>
    </YStack>
  );
}

export default function GroupsScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const studyProfile = useQuery(api.queries.getStudyProfile, {}) as
    | StudyProfile
    | null
    | undefined;
  const router = useRouter();
  const theme = useTheme();
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    if (studyProfile?.classes?.length) {
      const newMatches = studyProfile.classes.flatMap((classInfo) =>
        getRandomMatchesForClass(classInfo.name.toUpperCase())
      );
      setMatches(newMatches);
    }
  }, [studyProfile?.classes]);

  if (studyProfile === undefined) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text>Loading...</Text>
      </YStack>
    );
  }

  if (studyProfile === null) {
    return (
      <ScreenWrapper>
        <YStack
          flex={1}
          justifyContent="center"
          alignItems="center"
          padding="$4"
          space="$4"
        >
          <Text fontSize="$5" fontWeight="bold" textAlign="center">
            Complete Your Study Profile
          </Text>
          <Text color="$gray11" textAlign="center">
            Fill out your study preferences to get matched with compatible study
            partners
          </Text>
          <Button
            size="large"
            variant="primary"
            label="Create Profile"
            onPress={() => router.push("/(auth)/profile")}
            width="100%"
            backgroundColor="#0F9ED5"
          />
        </YStack>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <SafeAreaView style={{ flex: 1 }}>
        <YStack flex={1}>
          <XStack
            marginLeft={50}
            marginRight={50}
            justifyContent="space-between"
            alignItems="center"
            marginBottom="$2"
          >
            <FilterSearchBar
              onSearch={setSearchTerm}
              placeholder="Search matches..."
            />
            <TouchableOpacity
              onPress={() => router.push("/settings")}
              style={{
                paddingLeft: 6,
                paddingRight: 12,
                paddingVertical: 6,
              }}
            >
              <SettingsIcon size={26} color={theme.color.val} />
            </TouchableOpacity>
          </XStack>

          <ProfileHeader matches={matches} />
          <YStack flex={1}>
            <MatchesContainer
              searchTerm={searchTerm}
              matches={matches}
              setMatches={setMatches}
            />
          </YStack>
        </YStack>
      </SafeAreaView>
    </ScreenWrapper>
  );
}
