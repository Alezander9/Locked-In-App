// Add these type definitions at the top of your file
type TimeSlot = {
  hour: number;
  selected: boolean;
};

type DaySchedule = {
  day: string;
  timeSlots: TimeSlot[];
};

import { YStack, Text, XStack, ScrollView, useTheme } from "tamagui";
import { ScreenWrapper } from "@/components/background/ScreenWrapper";
import { Button } from "@/components/buttons/CustomButton";
import { CustomSwitch } from "@/components/profile/CustomSwitch";
import { useState } from "react";
import { LinkIcon } from "@/app/components/icons";
import { SafeAreaView, TextInput } from "react-native";
import { useRouter } from "expo-router";

// Define reusable SettingsSection component
const SettingsSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <YStack>
    <Text fontSize="$5" fontWeight="bold">
      {title}
    </Text>
    <YStack borderRadius="$4" backgroundColor="$background">
      {children}
    </YStack>
  </YStack>
);

// Define reusable SettingsRow component
const SettingsRow = ({
  label,
  children,
  onPress,
}: {
  label: string;
  children: React.ReactNode;
  onPress: () => void;
}) => (
  <XStack
    justifyContent="space-between"
    alignItems="center"
    paddingVertical="$3"
    paddingHorizontal="$3"
    pressStyle={{ opacity: 0.8 }}
    onPress={onPress}
  >
    <Text fontSize="$4">{label}</Text>
    {children}
  </XStack>
);

export default function SettingsScreen() {
  const router = useRouter();
  const theme = useTheme();
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
      <SafeAreaView style={{ flex: 1 }}>
        <XStack
          borderBottomColor="$borderColor"
          borderBottomWidth={1}
          justifyContent="space-between"
          alignItems="center"
          marginBottom="$4"
        >
          <Text
            onPress={() => router.back()}
            color="$primary"
            fontSize="$4"
            padding="$4"
            width={100}
            textAlign="left"
          >
            Back
          </Text>
          <Text fontSize="$4" fontWeight="$4">
            Settings
          </Text>
          <Text width={100} />
        </XStack>

        <ScrollView>
          <YStack flex={1} padding="$4" space="$6">
            {/* General Settings Section */}
            <SettingsSection title="General Settings">
              <SettingsRow label="Share Location" onPress={() => {}}>
                <CustomSwitch
                  value={notifications}
                  onValueChange={setNotifications}
                  helperText="Receive notifications about matches and messages"
                />
              </SettingsRow>

              <YStack height={0.5} backgroundColor="$lightSeparator" />

              <SettingsRow label="Sync Contacts" onPress={() => {}}>
                <CustomSwitch
                  value={nightMode}
                  onValueChange={setNightMode}
                  helperText="Enable dark theme for the app"
                />
              </SettingsRow>

              <YStack height={0.5} backgroundColor="$lightSeparator" />

              <SettingsRow label="Language" onPress={() => {}}>
                <Text fontSize="$4">English</Text>
              </SettingsRow>
            </SettingsSection>

            {/* Section Separator */}
            <YStack height={2} backgroundColor="$gray" />

            {/* Account Settings Section */}
            <SettingsSection title="Account Settings">
              <SettingsRow label="Show Email" onPress={() => {}}>
                <CustomSwitch
                  value={showEmail}
                  onValueChange={setShowEmail}
                  helperText="Allow other users to see your email address"
                />
              </SettingsRow>

              <YStack height={0.5} backgroundColor="$lightSeparator" />

              <SettingsRow label="Show Number" onPress={() => {}}>
                <CustomSwitch
                  value={showNumber}
                  onValueChange={setShowNumber}
                  helperText="Allow other users to see your phone number"
                />
              </SettingsRow>

              <YStack height={0.5} backgroundColor="$lightSeparator" />

              <SettingsRow
                label="Instagram Account"
                onPress={() => setInstagramLinked(!instagramLinked)}
              >
                <XStack space="$2" alignItems="center">
                  {instagramLinked && (
                    <LinkIcon size={16} color={theme.primary.val} />
                  )}
                  <Text
                    fontSize="$4"
                    color={instagramLinked ? undefined : "$iosGray"}
                  >
                    {instagramLinked ? "Linked" : "Not Linked"}
                  </Text>
                </XStack>
              </SettingsRow>

              <YStack height={0.5} backgroundColor="$lightSeparator" />

              <SettingsRow
                label="LinkedIn Account"
                onPress={() => setLinkedinLinked(!linkedinLinked)}
              >
                <XStack space="$2" alignItems="center">
                  {linkedinLinked && (
                    <LinkIcon size={16} color={theme.primary.val} />
                  )}
                  <Text
                    fontSize="$4"
                    color={linkedinLinked ? undefined : "$iosGray"}
                  >
                    {linkedinLinked ? "Linked" : "Not Linked"}
                  </Text>
                </XStack>
              </SettingsRow>
            </SettingsSection>

            {/* Section Separator */}
            <YStack height={2} backgroundColor="$gray" />

            {/* Study Profile Settings Section */}
            <SettingsSection title="Study Profile Settings">
              <SettingsRow
                label="General Preferences"
                onPress={() => {
                  router.push({
                    pathname: "/profile",
                    params: { step: "general_preferences" },
                  });
                }}
              >
                <Text fontSize="$4" color="$primary">
                  Edit →
                </Text>
              </SettingsRow>

              <YStack height={0.5} backgroundColor="$lightSeparator" />

              <SettingsRow
                label="Class-Specific Preferences"
                onPress={() => {
                  router.push({
                    pathname: "/profile",
                    params: { step: "course_preferences" },
                  });
                }}
              >
                <Text fontSize="$4" color="$primary">
                  Edit →
                </Text>
              </SettingsRow>

              <YStack height={0.5} backgroundColor="$lightSeparator" />

              <SettingsRow
                label="Schedule"
                onPress={() => {
                  router.push({
                    pathname: "/profile",
                    params: { step: "schedule" },
                  });
                }}
              >
                <Text fontSize="$4" color="$primary">
                  Edit →
                </Text>
              </SettingsRow>
            </SettingsSection>

            {/* Bottom padding */}
            <YStack height={40} />
          </YStack>
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
}
