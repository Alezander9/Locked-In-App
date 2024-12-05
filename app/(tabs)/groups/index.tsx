import { useState, useEffect } from "react";
import { SafeAreaView, TouchableOpacity, View, Image } from "react-native";
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
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

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
  const userCourses = useQuery(api.queries.getUserCoursesOrdered, {});
  const router = useRouter();
  const theme = useTheme();
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    if (userCourses?.length) {
      const newMatches = userCourses.flatMap((courseInfo) =>
        getRandomMatchesForClass(
          courseInfo.code?.toUpperCase() || "Unkown Course"
        )
      );
      setMatches(newMatches);
    }
  }, [userCourses]);

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
        <SafeAreaView
          style={{ flex: 1, backgroundColor: theme.background.get() }}
        >
          <View style={{ height: SCREEN_HEIGHT * 0.67 }}>
            <Image
              source={require("@/assets/images/GroupsGraphic.webp")}
              style={{
                width: SCREEN_WIDTH,
                height: "100%",
                position: "absolute",
              }}
              resizeMode="cover"
            />
            <LinearGradient
              colors={["transparent", theme.background.get()]}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: SCREEN_HEIGHT * 0.5,
              }}
            />
            <View
              style={{
                position: "absolute",
                top: 4,
                left: 0,
                right: 0,
                alignItems: "center",
              }}
            >
              <Image
                source={require("@/assets/images/LockedInLogoFull.webp")}
                style={{
                  width: 200,
                  height: 60,
                  marginBottom: 12,
                }}
                resizeMode="contain"
              />
            </View>
            <View
              style={{
                position: "absolute",
                bottom: 25,
                left: 0,
                right: 0,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: theme.color.get(),
                  fontSize: 24,
                  fontWeight: "bold",
                  marginBottom: 8,
                  textAlign: "center",
                }}
              >
                Complete Your Study Profile
              </Text>
              <Text
                style={{
                  color: theme.color.get(),
                  fontSize: 16,
                  textAlign: "center",
                  paddingHorizontal: 40,
                }}
              >
                Fill out your study preferences to get matched with compatible
                study partners
              </Text>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              paddingHorizontal: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              size="large"
              variant="primary"
              label="Create Profile"
              onPress={() => router.push("/profile")}
              style={{
                width: "100%",
                marginBottom: 36,
              }}
            />
          </View>
        </SafeAreaView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <SafeAreaView style={{ flex: 1, marginTop: 10 }}>
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
