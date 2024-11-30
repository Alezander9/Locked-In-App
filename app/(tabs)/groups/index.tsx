import { Button } from "@/components/buttons/CustomButton";
import { YStack, XStack, Text, Image } from "tamagui";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import {
  UserIcon,
  SettingsIcon,
  PlusIcon,
  PencilIcon,
} from "@/app/components/icons";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTheme } from "tamagui";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { TouchableOpacity } from "react-native";
import { MatchesContainer } from "./MatchesContainer";
import { useState, useEffect } from "react";
import { FilterSearchBar } from "@/components/searchBar/FilterSearchBar";
import { useRouter } from "expo-router";
import { MOCK_MATCHES, Match, getRandomMatchesForClass } from "./MatchCard";
import { TextInput } from "react-native";

type ProfileStatsProps = {
  matches: Match[];
  studyProfile: any;
};

function ProfileStats({ matches, studyProfile }: ProfileStatsProps) {
  // Only count accepted matches
  const acceptedMatches = matches.filter(
    (match) => match.status === "accepted"
  );

  const stats = {
    matches: String(acceptedMatches.length),
    classes: String(studyProfile?.classes?.length || 0),
    tasks: "0",
  };

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
      {/* Matches */}
      <YStack alignItems="center" space="$0.5">
        <Text fontWeight="bold" fontSize="$4">
          {stats.matches}
        </Text>
        <Text color="$gray11" fontSize="$2">
          Matches
        </Text>
      </YStack>

      {/* Classes */}
      <YStack alignItems="center" space="$0.5">
        <Text fontWeight="bold" fontSize="$4">
          {stats.classes}
        </Text>
        <Text color="$gray11" fontSize="$2">
          Classes
        </Text>
      </YStack>

      {/* Tasks */}
      <YStack alignItems="center" space="$0.5">
        <Text fontWeight="bold" fontSize="$4">
          {stats.tasks}
        </Text>
        <Text color="$gray11" fontSize="$2">
          Tasks
        </Text>
      </YStack>
    </XStack>
  );
}

// Create a reusable circular icon component
function CircularIcon({
  Icon,
  size = 44,
  iconSize = 24,
  onPress,
}: {
  Icon: any;
  size?: number;
  iconSize?: number;
  onPress?: () => void;
}) {
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={onPress}>
      <YStack
        width={size}
        height={size}
        borderRadius={size / 2}
        backgroundColor="$iosGray"
        justifyContent="center"
        alignItems="center"
        shadowColor="black"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={4}
        elevation={3}
      >
        <YStack
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          justifyContent="center"
          alignItems="center"
        >
          <Icon size={iconSize} color={theme.color.val} />
        </YStack>
      </YStack>
    </TouchableOpacity>
  );
}

function ProfileHeader({ matches }: { matches: Match[] }) {
  const { userId } = useAuth();
  const theme = useTheme();
  const router = useRouter();
  const [isEditingDorm, setIsEditingDorm] = useState(false);
  const [tempDorm, setTempDorm] = useState("");

  const user = useQuery(api.queries.getUserByClerkId, {
    clerkId: userId || "",
  });
  const studyProfile = useQuery(api.queries.getStudyProfile, {});

  const generateUploadUrl = useMutation(api.mutations.generateUploadUrl);
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

  const handleImageUpload = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert("Permission to access camera roll is required!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;

        // Manipulate the image before upload
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          imageUri,
          [{ resize: { width: 1000, height: 1000 } }],
          {
            compress: 0.7,
            format: ImageManipulator.SaveFormat.JPEG,
          }
        );

        if (user && user._id) {
          // Get upload URL from Convex
          const postUrl = await generateUploadUrl();

          // For iOS, we need to read the file as a blob
          const response = await fetch(manipulatedImage.uri);
          const blob = await response.blob();

          // Upload to storage
          const uploadResult = await fetch(postUrl, {
            method: "POST",
            body: blob,
            headers: {
              "Content-Type": "image/jpeg",
            },
          });

          const { storageId } = await uploadResult.json();
          await saveProfilePicture({ storageId, userID: user._id });
        }
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    }
  };

  const handleBackgroundUpload = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert("Permission to access camera roll is required!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.5,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;

        const manipulatedImage = await ImageManipulator.manipulateAsync(
          imageUri,
          [{ resize: { width: 1920, height: 1080 } }],
          {
            compress: 0.7,
            format: ImageManipulator.SaveFormat.JPEG,
          }
        );

        if (user && user._id) {
          const postUrl = await generateUploadUrl();
          const response = await fetch(manipulatedImage.uri);
          const blob = await response.blob();

          const uploadResult = await fetch(postUrl, {
            method: "POST",
            body: blob,
            headers: {
              "Content-Type": "image/jpeg",
            },
          });

          const { storageId } = await uploadResult.json();
          await saveBackgroundPicture({ storageId, userID: user._id });
        }
      }
    } catch (error) {
      console.error("Error uploading background image:", error);
      alert("Failed to upload background image. Please try again.");
    }
  };

  const handleDormSubmit = async () => {
    if (!tempDorm.trim()) {
      setIsEditingDorm(false);
      return;
    }

    // Optimistically update the UI first
    const previousDorm = studyProfile?.dorm;
    setIsEditingDorm(false);

    try {
      await updateStudyProfile({
        studyProfile: {
          ...studyProfile!,
          dorm: tempDorm.trim(),
        },
      });
    } catch (error) {
      // If the update fails, revert to the previous value
      console.error("Failed to update dorm:", error);
      alert("Failed to update dorm. Please try again.");
      if (previousDorm) {
        await updateStudyProfile({
          studyProfile: {
            ...studyProfile!,
            dorm: previousDorm,
          },
        });
      }
    }
  };

  return (
    <YStack>
      <YStack position="relative">
        {/* Modified Background Image */}
        <TouchableOpacity onPress={handleBackgroundUpload}>
          <YStack height={160} width="100%" borderRadius="$4" overflow="hidden">
            <Image
              source={
                backgroundImageUrl
                  ? { uri: backgroundImageUrl }
                  : require("@/assets/images/mountains.jpg")
              }
              style={{
                width: "100%",
                height: "100%",
              }}
              resizeMode="cover"
            />
            {/* Settings Icon remains the same */}
            <YStack position="absolute" top={10} right={10}>
              <CircularIcon
                Icon={SettingsIcon}
                onPress={() => router.push("/settings")}
              />
            </YStack>
          </YStack>
        </TouchableOpacity>

        {/* Profile Avatar - removed surrounding XStack and Plus icon */}
        <YStack
          position="absolute"
          bottom={10}
          width="100%"
          alignItems="center"
          justifyContent="center"
        >
          <TouchableOpacity onPress={handleImageUpload}>
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: 55,
                  borderWidth: 3,
                  borderColor: theme.background.val,
                }}
              />
            ) : (
              <YStack
                width={110}
                height={110}
                borderRadius={55}
                backgroundColor="$iosGray"
                justifyContent="center"
                alignItems="center"
                borderWidth={3}
                borderColor={theme.background.val}
              >
                <UserIcon size={55} color={theme.color.val} />
              </YStack>
            )}
          </TouchableOpacity>
        </YStack>
      </YStack>

      {/* Combined Name, Location, and Stats Card */}
      <YStack
        backgroundColor="$background"
        marginHorizontal="$4"
        marginTop={8}
        marginBottom="$2"
        padding="$3"
        borderRadius="$4"
        alignItems="center"
        shadowColor="black"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={8}
        elevation={3}
      >
        <Text fontSize="$4" fontWeight="bold" marginBottom="$0.5">
          {user ? `${user.firstName} ${user.lastName}` : ""}
        </Text>
        <XStack
          alignItems="center"
          justifyContent="center"
          space="$2"
          marginBottom="$2"
          width="100%"
        >
          {isEditingDorm ? (
            <XStack space="$2" alignItems="center" justifyContent="center">
              <TextInput
                value={tempDorm}
                onChangeText={setTempDorm}
                placeholder="Enter dorm"
                onSubmitEditing={handleDormSubmit}
                style={{
                  borderWidth: 1,
                  borderColor: theme.gray.val,
                  borderRadius: 4,
                  padding: 8,
                  minWidth: 120,
                  textAlign: "center",
                  color: theme.color.val,
                  fontSize: 14,
                }}
                autoFocus
              />
              <TouchableOpacity onPress={handleDormSubmit}>
                <YStack backgroundColor="$blue8" padding="$2" borderRadius="$2">
                  <Text color="white" fontSize="$2">
                    Save
                  </Text>
                </YStack>
              </TouchableOpacity>
            </XStack>
          ) : (
            <XStack space="$2" alignItems="center" justifyContent="center">
              <Text color="$gray11" fontSize="$2">
                {studyProfile?.dorm || "No dorm set"}
              </Text>
              <TouchableOpacity onPress={() => setIsEditingDorm(true)}>
                <PencilIcon size={16} color={theme.gray.val} />
              </TouchableOpacity>
            </XStack>
          )}
        </XStack>

        <ProfileStats matches={matches} studyProfile={studyProfile} />
      </YStack>
    </YStack>
  );
}

export default function GroupsScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const studyProfile = useQuery(api.queries.getStudyProfile, {});
  const router = useRouter();

  // Move matches state initialization to useEffect to handle studyProfile changes
  const [matches, setMatches] = useState<Match[]>([]);

  // Use useEffect to update matches when studyProfile changes
  useEffect(() => {
    if (studyProfile?.classes?.length) {
      const newMatches = studyProfile.classes.flatMap((classInfo) =>
        getRandomMatchesForClass(classInfo.name.toUpperCase())
      );
      setMatches(newMatches);
    }
  }, [studyProfile?.classes]); // Only re-run when classes change

  const handleMatchesUpdate = (
    newMatches: Match[] | ((prev: Match[]) => Match[])
  ) => {
    setMatches(newMatches);
  };

  // Loading state
  if (studyProfile === undefined) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text>Loading...</Text>
      </YStack>
    );
  }

  // Simply check if studyProfile is null
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

  // If we get here, studyProfile exists
  return (
    <ScreenWrapper>
      <YStack flex={1}>
        <ProfileHeader matches={matches} />
        <YStack flex={1}>
          <XStack
            paddingHorizontal="$4"
            paddingBottom="$2"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text fontSize="$5" fontWeight="bold">
              My Matches
            </Text>
            <XStack flex={1} marginLeft="$4" maxWidth={500}>
              <FilterSearchBar
                onSearch={setSearchTerm}
                placeholder="Search name, class, or field"
              />
            </XStack>
          </XStack>

          <MatchesContainer
            searchTerm={searchTerm}
            matches={matches}
            setMatches={handleMatchesUpdate}
          />
        </YStack>
      </YStack>
    </ScreenWrapper>
  );
}
