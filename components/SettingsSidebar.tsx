import React, { useRef, useEffect } from "react";
import {
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  Image,
  SafeAreaView,
} from "react-native";
import { UserCheckIcon } from "@/app/components/icons";
import { Text, XStack, YStack, Stack, useTheme } from "tamagui";
import { useAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const SIDEBAR_WIDTH = Dimensions.get("window").width * 0.75; // 75% of screen width

export interface SettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userPhoto?: string | null;
}

export const SettingsSidebar = ({
  isOpen,
  onClose,
  userPhoto = null, // optional user photo URL
}: SettingsSidebarProps) => {
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const theme = useTheme();
  const { userId, signOut } = useAuth();
  const user = useQuery(api.queries.getUserByClerkId, {
    clerkId: userId || "",
  });

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

  const handleSignOut = () => {
    signOut();
    router.replace("/(auth)/login");
  };

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
              height={120}
              justifyContent="center"
              alignItems="flex-start"
              borderBottomWidth={1}
              borderBottomColor="$lightSeparator"
            >
              <XStack marginLeft="$6">
                {userPhoto ? (
                  <Image source={{ uri: userPhoto }} style={styles.userPhoto} />
                ) : (
                  <Stack
                    width={80}
                    height={80}
                    borderRadius={40}
                    backgroundColor="$lightSeparator"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <UserCheckIcon size={30} color={theme.color.val} />
                  </Stack>
                )}
              </XStack>
            </YStack>

            <TouchableOpacity
              onPress={() => {
                onClose();
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
                onClose();
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
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSignOut}>
              <XStack
                marginTop="auto"
                padding="$4"
                borderTopWidth={1}
                borderTopColor="$lightSeparator"
                borderBottomWidth={1}
                borderBottomColor="$lightSeparator"
                alignItems="center"
              >
                <Text color="$red" fontSize="$4">
                  Sign Out
                </Text>
              </XStack>
            </TouchableOpacity>
          </SafeAreaView>
        </YStack>
      </Animated.View>
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
