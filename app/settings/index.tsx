// Add these type definitions at the top of your file
type TimeSlot = {
  hour: number;
  selected: boolean;
};

type DaySchedule = {
  day: string;
  timeSlots: TimeSlot[];
};

import { YStack, Text, XStack, ScrollView } from "tamagui";
import { ScreenWrapper } from "@/components/background/ScreenWrapper";
import { useAuth } from "@clerk/clerk-expo";
import { Button } from "@/components/buttons/CustomButton";
import { CustomSwitch } from "@/components/profile/CustomSwitch";
import { useState } from "react";
import { LinkIcon } from "@/app/components/icons";
import { TextInput } from "react-native";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const { signOut } = useAuth();
  const router = useRouter();
  const [showEmail, setShowEmail] = useState(false);
  const [showNumber, setShowNumber] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [nightMode, setNightMode] = useState(false);
  const [instagramLinked, setInstagramLinked] = useState(false);
  const [linkedinLinked, setLinkedinLinked] = useState(false);
  const [major, setMajor] = useState("Not Set");
  const [isEditingMajor, setIsEditingMajor] = useState(false);

  // Initialize schedule state similar to profile builder
  const [schedule, setSchedule] = useState<DaySchedule[]>(
    Array.from({ length: 7 }, (_, dayIndex) => ({
      day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayIndex],
      timeSlots: Array.from({ length: 24 }, (_, hour) => ({
        hour,
        selected: false,
      })),
    }))
  );

  const handleMajorEdit = () => {
    setIsEditingMajor(!isEditingMajor);
  };

  return (
    <ScreenWrapper>
      <ScrollView>
        <YStack flex={1} padding="$4" space="$6">
          {/* General Settings Section */}
          <YStack space="$4">
            <Text fontSize="$5" fontWeight="bold">
              General Settings
            </Text>

            <YStack borderRadius="$4" backgroundColor="$background">
              <XStack
                justifyContent="space-between"
                alignItems="center"
                paddingVertical="$3"
                paddingHorizontal="$3"
              >
                <Text fontSize="$4">Share Location</Text>
                <CustomSwitch
                  value={notifications}
                  onValueChange={setNotifications}
                  helperText="Receive notifications about matches and messages"
                />
              </XStack>

              <YStack height={0.5} backgroundColor="$iosGray2" />

              <XStack
                justifyContent="space-between"
                alignItems="center"
                paddingVertical="$3"
                paddingHorizontal="$3"
              >
                <Text fontSize="$4">Sync Contacts</Text>
                <CustomSwitch
                  value={nightMode}
                  onValueChange={setNightMode}
                  helperText="Enable dark theme for the app"
                />
              </XStack>

              <YStack height={0.5} backgroundColor="$iosGray2" />

              <XStack
                justifyContent="space-between"
                alignItems="center"
                paddingVertical="$3"
                paddingHorizontal="$3"
              >
                <Text fontSize="$4">Language</Text>
                <Text fontSize="$4">English</Text>
              </XStack>
            </YStack>
          </YStack>

          {/* Section Separator */}
          <YStack height={2} backgroundColor="$gray" />

          {/* Account Settings Section */}
          <YStack space="$4">
            <Text fontSize="$5" fontWeight="bold">
              Account Settings
            </Text>

            <YStack borderRadius="$4" backgroundColor="$background">
              <XStack
                justifyContent="space-between"
                alignItems="center"
                paddingVertical="$3"
                paddingHorizontal="$3"
              >
                <Text fontSize="$4">Show Email</Text>
                <CustomSwitch
                  value={showEmail}
                  onValueChange={setShowEmail}
                  helperText="Allow other users to see your email address"
                />
              </XStack>

              <YStack height={0.5} backgroundColor="$iosGray2" />

              <XStack
                justifyContent="space-between"
                alignItems="center"
                paddingVertical="$3"
                paddingHorizontal="$3"
              >
                <Text fontSize="$4">Show Number</Text>
                <CustomSwitch
                  value={showNumber}
                  onValueChange={setShowNumber}
                  helperText="Allow other users to see your phone number"
                />
              </XStack>

              <YStack height={0.5} backgroundColor="$iosGray2" />

              <XStack
                justifyContent="space-between"
                alignItems="center"
                paddingVertical="$3"
                paddingHorizontal="$3"
                pressStyle={{ opacity: 0.8 }}
                onPress={() => setInstagramLinked(!instagramLinked)}
              >
                <Text fontSize="$4">Instagram Account</Text>
                <XStack space="$2" alignItems="center">
                  {instagramLinked && <LinkIcon size={16} color="#0F9ED5" />}
                  <Text
                    fontSize="$4"
                    color={instagramLinked ? undefined : "$iosGray"}
                  >
                    {instagramLinked ? "Linked" : "Not Linked"}
                  </Text>
                </XStack>
              </XStack>

              <YStack height={0.5} backgroundColor="$iosGray2" />

              <XStack
                justifyContent="space-between"
                alignItems="center"
                paddingVertical="$3"
                paddingHorizontal="$3"
                pressStyle={{ opacity: 0.8 }}
                onPress={() => setLinkedinLinked(!linkedinLinked)}
              >
                <Text fontSize="$4">LinkedIn Account</Text>
                <XStack space="$2" alignItems="center">
                  {linkedinLinked && <LinkIcon size={16} color="#0F9ED5" />}
                  <Text
                    fontSize="$4"
                    color={linkedinLinked ? undefined : "$iosGray"}
                  >
                    {linkedinLinked ? "Linked" : "Not Linked"}
                  </Text>
                </XStack>
              </XStack>
            </YStack>
          </YStack>

          {/* Section Separator */}
          <YStack height={2} backgroundColor="$gray" />

          {/* Study Profile Settings Section */}
          <YStack space="$4">
            <Text fontSize="$5" fontWeight="bold">
              Study Profile Settings
            </Text>

            <YStack borderRadius="$4" backgroundColor="$background">
              <XStack
                justifyContent="space-between"
                alignItems="center"
                paddingVertical="$3"
                paddingHorizontal="$3"
                pressStyle={{ opacity: 0.8 }}
                onPress={() => {
                  router.push("/settings/schedule");
                }}
              >
                <Text fontSize="$4">Schedule</Text>
                <Text fontSize="$4" color="#0F9ED5">
                  Edit →
                </Text>
              </XStack>

              <YStack height={0.5} backgroundColor="$iosGray2" />

              <XStack
                justifyContent="space-between"
                alignItems="center"
                paddingVertical="$3"
                paddingHorizontal="$3"
                pressStyle={{ opacity: 0.8 }}
                onPress={() => {
                  router.push("/settings/generalPreferences");
                }}
              >
                <Text fontSize="$4">General Preferences</Text>
                <Text fontSize="$4" color="#0F9ED5">
                  Edit →
                </Text>
              </XStack>

              <YStack height={0.5} backgroundColor="$iosGray2" />

              <XStack
                justifyContent="space-between"
                alignItems="center"
                paddingVertical="$3"
                paddingHorizontal="$3"
                pressStyle={{ opacity: 0.8 }}
                onPress={() => {
                  router.push("/settings/classPreferences");
                }}
              >
                <Text fontSize="$4">Class-Specific Preferences</Text>
                <Text fontSize="$4" color="#0F9ED5">
                  Edit →
                </Text>
              </XStack>
            </YStack>
          </YStack>

          {/* Bottom padding */}
          <YStack height={40} />
        </YStack>
      </ScrollView>
    </ScreenWrapper>
  );
}
