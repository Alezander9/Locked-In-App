import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  Keyboard,
} from "react-native";
import { Stack, YStack, Circle, useTheme, Text } from "tamagui";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenWrapper } from "@/components/background/ScreenWrapper";
import { ProfileCreationHeader } from "@/components/profile/ProfileCreationHeader";
import { useProfileStore } from "@/stores/useProfileStore";
import { PROFILE_STEPS } from "@/features/study-profile/config/profile-steps";
import Icons from "@/app/components/icons";
import { LAYOUT, ANIMATION } from "@/features/study-profile/config/constants";
import { Button } from "@/components/buttons/CustomButton";
import { ProgressAnimation } from "@/components/animations/ProgressAnimation";
import { LockAnimation } from "@/components/animations/LockAnimation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";

export default function StudyProfileCreation() {
  const router = useRouter();
  const { step } = useLocalSearchParams();
  const theme = useTheme();
  const { userId } = useAuth();
  const buttonAnimation = useRef(new Animated.Value(0)).current;
  const [showProgress, setShowProgress] = useState(false);
  const [isLockAnimating, setIsLockAnimating] = useState(false);

  // Replace existing user query with new one and add initialization
  const user = useQuery(api.queries.getUserByClerkId, {
    clerkId: userId || "",
  });
  const { initializeWithExistingProfile, setCurrentStep } = useProfileStore();

  // Add new useEffect for profile initialization
  useEffect(() => {
    if (user?.studyProfile) {
      console.log("[Debug] Initializing with existing profile:", user.studyProfile);
      initializeWithExistingProfile(user.studyProfile);
    }
  }, [user]);

  const {
    navigation: { currentStep, canGoBack, canContinue },
    nextStep,
    previousStep,
    getCurrentStepErrors,
  } = useProfileStore();

  const updateStudyProfile = useMutation(api.mutations.updateStudyProfile);

  // Keyboard handling
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (event) => {
        const keyboardHeight = event.endCoordinates.height;
        const maxSlide = Math.min(
          keyboardHeight,
          Dimensions.get("window").height * 0.05
        );

        Animated.timing(buttonAnimation, {
          toValue: maxSlide,
          duration: ANIMATION.KEYBOARD_DURATION,
          useNativeDriver: true,
        }).start();
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        Animated.timing(buttonAnimation, {
          toValue: 0,
          duration: ANIMATION.KEYBOARD_DURATION,
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const handleContinue = async () => {
    if (currentStep === PROFILE_STEPS.length - 1) {
      try {
        console.log("[Debug] Starting final step submission");
        setIsLockAnimating(true);
        setShowProgress(true);

        const submitData = async () => {
          try {
            console.log("[Debug] Beginning profile submission");
            const { formData } = useProfileStore.getState();
            
            // Transform schedule data to the format the mutation expects
            const availableTimeSlots = formData.schedule
              .map((day) => ({
                day: day.day,
                slots: day.timeSlots
                  .filter((slot) => slot.selected)
                  .map((slot) => slot.hour),
              }))
              .filter((day) => day.slots.length > 0);

            // Package the data
            const profileData = {
              dorm: formData.dorm,
              studyLocations: formData.whereStudyTags,
              alertnessPreference: formData.alertnessPreference,
              punctualityPreference: formData.punctualityPreference,
              learningPreferences: formData.learningPreferences,
              availableTimeSlots,
              coursePreferences: formData.coursePreferences.map((pref) => ({
                courseId: pref.courseId,
                weeklyHours: pref.weeklyHours,
                deadlinePreference: pref.deadlinePreference,
                noiseLevel: pref.noiseLevel,
                targetGrade: pref.targetGrade,
                expectedGrade: pref.expectedGrade,
              })),
              additionalInfo: formData.additionalInfo || "",
              shareLocation: formData.shareLocation,
              syncContacts: formData.syncContacts,
            };

            // Start navigation
            setTimeout(() => {
              console.log("[Debug] Executing navigation to groups");
              router.replace("/(tabs)/groups");
              
              // Call mutation after navigation starts
              setTimeout(async () => {
                console.log("[Debug] Calling updateStudyProfile mutation");
                await updateStudyProfile({
                  studyProfile: profileData,
                });
              }, 100); // Small delay after navigation starts
              
            }, ANIMATION.PROGRESS_DURATION);
            
          } catch (error) {
            console.error("[Debug] Profile submission failed:", error);
            setIsLockAnimating(false);
            setShowProgress(false);
          }
        };

        await submitData();
        
      } catch (error) {
        console.error("[Debug] Outer submission error:", error);
        setIsLockAnimating(false);
        setShowProgress(false);
      }
    } else {
      console.log("[Debug] Moving to next step:", currentStep + 1);
      nextStep();
    }
  };

  const CurrentStepComponent = PROFILE_STEPS[currentStep].component;
  const stepConfig = PROFILE_STEPS[currentStep];

  // Add step mapping
  const STEP_MAPPING = {
    dorm: 1,
    study_locations: 2,
    schedule: 3,
    general_preferences: 4,
    course_preferences: 5,
    additional_info: 6,
  };

  // Add step navigation effect
  useEffect(() => {
    if (step && STEP_MAPPING[step as keyof typeof STEP_MAPPING] !== undefined) {
      console.log("[Debug] Step navigation triggered:", {
        incomingStep: step,
        mappedStep: STEP_MAPPING[step as keyof typeof STEP_MAPPING]
      });
      setCurrentStep(STEP_MAPPING[step as keyof typeof STEP_MAPPING]);
    }
  }, [step]);

  const renderFinalStep = () => (
    <YStack flex={1} paddingHorizontal="$4">
      <Text fontSize="$6" fontWeight="800" textAlign="center" marginBottom="$8">
        Are you ready to get LockedIn?
      </Text>

      <YStack
        flex={1}
        justifyContent="center"
        alignItems="center"
        position="relative"
        marginTop="-$8"
      >
        <YStack alignItems="center">
          <LockAnimation isAnimating={isLockAnimating} />

          <YStack width="100%" paddingHorizontal="$8" marginTop="$8">
            {showProgress && (
              <ProgressAnimation
                duration={ANIMATION.PROGRESS_DURATION}
                onComplete={() => router.replace("/(tabs)/groups")}
              />
            )}
          </YStack>

          {!showProgress && (
            <Text
              color="$gray"
              fontSize="$4"
              textAlign="center"
              marginTop="$8"
              lineHeight={24}
            >
              We'll analyze your study preferences and match you with compatible
              study partners. This process usually takes about 2-3 minutes.
            </Text>
          )}
        </YStack>
      </YStack>

      {!showProgress && (
        <YStack paddingBottom="$6">
          <Button
            size="large"
            variant="primary"
            label="Continue"
            onPress={handleContinue}
            width="100%"
            disabled={showProgress}
            backgroundColor="$primary"
          />
        </YStack>
      )}
    </YStack>
  );

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={-LAYOUT.KEYBOARD_OFFSET}
        style={{ flex: 1 }}
      >
        <Stack flex={1} paddingHorizontal="$4" paddingTop="$8">
          <ProfileCreationHeader
            currentStep={currentStep}
            totalSteps={PROFILE_STEPS.length}
            onBack={previousStep}
          />

          <YStack flex={1}>
            {currentStep === PROFILE_STEPS.length - 1 ? (
              renderFinalStep()
            ) : (
              <CurrentStepComponent config={stepConfig} />
            )}
          </YStack>

          {/* Continue Button - only show for non-final steps */}
          {currentStep !== PROFILE_STEPS.length - 1 && (
            <Animated.View
              style={{
                transform: [{ translateY: buttonAnimation }],
                position: "absolute",
                bottom: LAYOUT.KEYBOARD_OFFSET + 50,
                right: LAYOUT.PADDING,
              }}
            >
              <Circle
                size={LAYOUT.BUTTON_SIZE}
                backgroundColor={canContinue ? "$primary" : "$gray"}
                justifyContent="center"
                alignItems="center"
                pressStyle={{
                  opacity: 0.8,
                  scale: 0.98,
                }}
                onPress={handleContinue}
                disabled={!canContinue}
              >
                <Icons.ArrowRight size={15} color={theme.bg.val} />
              </Circle>
            </Animated.View>
          )}
        </Stack>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
