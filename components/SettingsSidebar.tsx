import React, { useRef, useEffect, ChangeEvent, useState } from "react";
import {
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { UserCheckIcon, UserIcon } from "@/app/components/icons";
import { Text, XStack, YStack, Stack, useTheme } from "tamagui";
import { useAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";
import * as ImageManipulator from "expo-image-manipulator";

const SIDEBAR_WIDTH = Dimensions.get("window").width * 0.75; // 75% of screen width

export interface SettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsSidebar = ({ isOpen, onClose }: SettingsSidebarProps) => {
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const theme = useTheme();
  const { userId, signOut, isSignedIn, isLoaded } = useAuth();
  const user = useQuery(api.queries.getUserByClerkId, {
    clerkId: userId || "",
  });

  const generateUploadUrl = useMutation(api.mutations.generateUploadUrl);
  const saveProfilePicture = useMutation(api.mutations.saveProfilePicture);

  const imageUrl = useQuery(
    api.queries.getImageUrl,
    user?.profilePictureStorageId
      ? { storageId: user.profilePictureStorageId }
      : "skip"
  );

  const [isSigningOut, setIsSigningOut] = useState(false);

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
          [
            { resize: { width: 1000, height: 1000 } },
            // You can add more operations like rotate, flip, crop, etc.
          ],
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

          // Upload to storage with proper content type
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

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -SIDEBAR_WIDTH,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
      setIsSigningOut(false);
    }
  };
  // Reroute to login screen if user is not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/(auth)/login");
    }
  }, [isSignedIn, isLoaded]);

  return (
    <Stack
      position="absolute"
      left={0}
      right={0}
      top={0}
      bottom={0}
      zIndex={1000}
      pointerEvents={isOpen ? "auto" : "none"}
    >
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.backdropTouchable} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}
      >
        <YStack
          width={SIDEBAR_WIDTH}
          height="100%"
          backgroundColor="$background"
          shadowColor="$shadowColor"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.25}
          shadowRadius={3.84}
          elevation={5}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <YStack
              justifyContent="center"
              borderBottomWidth={1}
              borderBottomColor="$lightSeparator"
              paddingLeft="$6"
              paddingBottom="$4"
              gap="$2"
            >
              <Image
                source={require("@/assets/images/LockedInLogoFull.webp")}
                style={{
                  width: 200,
                  height: 60,
                  marginBottom: 12,
                  marginLeft: 24,
                }}
                resizeMode="contain"
              />

              <TouchableOpacity onPress={handleImageUpload}>
                <YStack>
                  {user?.profilePictureStorageId ? (
                    <Image
                      source={{ uri: imageUrl || "" }}
                      style={styles.userPhoto}
                    />
                  ) : (
                    <Stack
                      width={80}
                      height={80}
                      borderRadius={40}
                      backgroundColor="$iosGray"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <UserIcon size={30} color={theme.color.val} />
                    </Stack>
                  )}
                </YStack>
              </TouchableOpacity>
              <Text color="$color" fontSize="$4">
                {user?.firstName} {user?.lastName}
              </Text>
              <Text color="$color" fontSize="$3">
                {user?.email}
              </Text>
            </YStack>

            {/* <TouchableOpacity
              onPress={() => {
                console.log("Profile");
              }}
            >
              <XStack
                padding="$4"
                borderBottomWidth={1}
                borderBottomColor="$lightSeparator"
                alignItems="center"
              >
                <Text color="$color" fontSize="$4">
                  Profile
                </Text>
              </XStack>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                console.log("Preferences");
              }}
            >
              <XStack
                padding="$4"
                borderBottomWidth={1}
                borderBottomColor="$lightSeparator"
                alignItems="center"
              >
                <Text color="$color" fontSize="$4">
                  Preferences
                </Text>
              </XStack>
            </TouchableOpacity> */}

            <TouchableOpacity onPress={handleSignOut} disabled={isSigningOut}>
              <XStack
                marginTop="auto"
                padding="$4"
                borderTopWidth={1}
                borderTopColor="$lightSeparator"
                borderBottomWidth={1}
                borderBottomColor="$lightSeparator"
                alignItems="center"
              >
                <Text fontSize="$4">
                  {isSigningOut ? (
                    <ActivityIndicator size="small" color={theme.color.val} />
                  ) : (
                    "Sign Out"
                  )}
                </Text>
              </XStack>
            </TouchableOpacity>
          </SafeAreaView>
        </YStack>
      </Animated.View>

      {isSigningOut && (
        <Stack
          position="absolute"
          left={0}
          right={0}
          top={0}
          bottom={0}
          backgroundColor="rgba(0, 0, 0, 0.5)"
          justifyContent="center"
          alignItems="center"
          zIndex={2000}
        >
          <YStack gap="$4" alignItems="center">
            <ActivityIndicator size="large" color={theme.color.val} />
            <Text color="white" fontSize="$4">
              Signing out...
            </Text>
          </YStack>
        </Stack>
      )}
    </Stack>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
    zIndex: 1,
  },
  backdropTouchable: {
    flex: 1,
  },
  sidebar: {
    position: "absolute",
    zIndex: 2,
    height: "100%",
  },
  userPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});
