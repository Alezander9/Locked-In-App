import React, { useState } from "react";
import { ScrollView, YStack, Text } from "tamagui";
import { useProfileStore } from "@/stores/useProfileStore";
import { CustomTextInput } from "@/components/profile/CustomTextInput";
import { TagInput } from "@/components/profile/TagInput";
import { LearningPreferencesGrid } from "@/components/profile/LearningPreferencesGrid";
import { WeeklyScheduleSelector } from "@/components/schedule/WeeklyScheduleSelector";
import { GeneralStudyHabits } from "@/components/profile/GeneralStudyHabits";
import {
  ANIMATION,
  GRADES,
  LEARNING_METHODS,
  STUDY_PREFERENCES,
} from "../../config/constants";
import { withProfileStep } from "../ProfileStep";
import { CustomSwitch } from "@/components/profile/CustomSwitch";
import { LockAnimation } from "@/components/animations/LockAnimation";
import { ProgressAnimation } from "@/components/animations/ProgressAnimation";
import { Button } from "@/components/buttons/CustomButton";
import { useRouter } from "expo-router";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CoursePreference } from "@/convex/types";
import { Id } from "@/convex/_generated/dataModel";
import { CourseFilterBar } from "@/components/courses/CourseFilterBar";
import { PreferenceSlider } from "@/components/profile/PreferenceSlider";
import { DropdownInput } from "@/components/profile/DropdownInput";
// Basic Info Step
export const DormStep = withProfileStep(({ config }) => {
  const { formData, updateField } = useProfileStore();

  return (
    <CustomTextInput
      placeholder="Branner, Kimball..."
      value={formData.dorm}
      onChangeText={(text) => updateField("dorm", text)}
      required
    />
  );
});

// Study Locations Step
export const StudyLocationsStep = withProfileStep(({ config }) => {
  const { formData, updateField } = useProfileStore();

  const handleLocationChange = (text: string) => {
    // Update the text input
    updateField("whereStudy", text);

    // Parse comma-separated locations and update tags
    const locations = text
      .split(",")
      .map((loc) => loc.trim())
      .filter((loc) => loc.length > 0);

    updateField("whereStudyTags", locations);
  };

  return (
    <CustomTextInput
      placeholder="Green Library, Lathrop, CoHo..."
      value={formData.whereStudy}
      onChangeText={handleLocationChange}
      helperText="Enter at least 2 study locations separated by commas"
      required
    />
  );
});

// General Study Habits Step
export const StudyHabitsStep = withProfileStep(({ config }) => {
  const { formData, updateField } = useProfileStore();

  return (
    <ScrollView
      showsVerticalScrollIndicator={true}
      contentContainerStyle={{ paddingBottom: 100 }} // Add padding for the continue button
    >
      <YStack space="$4">
        <GeneralStudyHabits
          label="Do you feel more alert in the morning or in the evening?"
          value={formData.alertnessPreference}
          minimumValue={STUDY_PREFERENCES.alertness.min}
          maximumValue={STUDY_PREFERENCES.alertness.max}
          step={STUDY_PREFERENCES.alertness.step}
          sliderType="alertnessPreference"
          onValueChange={(value) => updateField("alertnessPreference", value)}
        />

        <GeneralStudyHabits
          label="Are you usually early, on-time, or late to meetings?"
          value={formData.punctualityPreference}
          minimumValue={STUDY_PREFERENCES.punctuality.min}
          maximumValue={STUDY_PREFERENCES.punctuality.max}
          step={STUDY_PREFERENCES.punctuality.step}
          sliderType="punctualityPreference"
          onValueChange={(value) => updateField("punctualityPreference", value)}
        />

        <LearningPreferencesGrid
          label="Rate how effective each learning method is for you"
          options={LEARNING_METHODS}
          values={formData.learningPreferences}
          onChange={(id, rating) => {
            updateField("learningPreferences", {
              ...formData.learningPreferences,
              [id]: rating,
            });
          }}
        />
      </YStack>
    </ScrollView>
  );
});

// Schedule Step
export const ScheduleStep = withProfileStep(({ config }) => {
  const { formData, updateField } = useProfileStore();

  return (
    <WeeklyScheduleSelector
      value={formData.schedule}
      onChange={(schedule) => updateField("schedule", schedule)}
      helperText="Select the hours you're typically free to study"
    />
  );
});

// Additional Info Step
export const AdditionalInfoStep = withProfileStep(({ config }) => {
  const { formData, updateField } = useProfileStore();

  return (
    <YStack space="$4">
      <CustomTextInput
        placeholder="Non-negotiables, learning disabilities, anything else (optional)"
        value={formData.additionalInfo}
        onChangeText={(text) => updateField("additionalInfo", text)}
        multiline
        numberOfLines={4}
        style={{ height: 80, textAlignVertical: "top" }}
      />

      <CustomSwitch
        value={formData.shareLocation}
        onValueChange={(value) => updateField("shareLocation", value)}
        subtitle="Share Location"
        helperText="Allow us to suggest study spots and partners nearby"
      />

      <CustomSwitch
        value={formData.syncContacts}
        onValueChange={(value) => updateField("syncContacts", value)}
        subtitle="Sync Contacts"
        helperText="Find your friends who are already on the platform"
      />
    </YStack>
  );
});

export const CoursePreferencesStep = withProfileStep(({ config }) => {
  const { formData, updateField, updateCoursePreference } = useProfileStore();

  const handleCourseSelect = (courseIds: Id<"courses">[]) => {
    const selectedId = courseIds[0];
    if (!selectedId) return;

    let updatedPreferences = [...(formData.coursePreferences || [])];

    // Add new course if it doesn't exist
    if (!updatedPreferences.find((p) => p.courseId === selectedId)) {
      updatedPreferences.push({
        courseId: selectedId,
        weeklyHours: 5,
        deadlinePreference: 3,
        noiseLevel: 2,
        targetGrade: "",
        expectedGrade: "",
      });
      updateField("coursePreferences", updatedPreferences);
    }

    updateField("currentCourseId", selectedId);
  };

  const currentPreference = formData.coursePreferences?.find(
    (p) => p.courseId === formData.currentCourseId
  );

  const handlePreferenceUpdate = (key: keyof CoursePreference, value: any) => {
    if (!formData.currentCourseId) return;

    const updatedPreferences = formData.coursePreferences.map((pref) =>
      pref.courseId === formData.currentCourseId
        ? { ...pref, [key]: value }
        : pref
    );

    updateField("coursePreferences", updatedPreferences);
  };

  return (
    <YStack space="$4">
      <CourseFilterBar
        onFiltersChange={handleCourseSelect}
        exclusiveSelection={true}
      />

      {currentPreference && (
        <YStack space="$4" paddingHorizontal="$4">
          <PreferenceSlider
            label="How many hours per week do you plan to work on this class?"
            value={currentPreference.weeklyHours}
            minimumValue={STUDY_PREFERENCES.weeklyHours.min}
            maximumValue={STUDY_PREFERENCES.weeklyHours.max}
            step={STUDY_PREFERENCES.weeklyHours.step}
            onValueChange={(value) =>
              handlePreferenceUpdate("weeklyHours", value)
            }
          />

          <PreferenceSlider
            label="How many days before a deadline do you start your assignments?"
            value={currentPreference.deadlinePreference}
            minimumValue={STUDY_PREFERENCES.deadlinePreference.min}
            maximumValue={STUDY_PREFERENCES.deadlinePreference.max}
            step={STUDY_PREFERENCES.deadlinePreference.step}
            onValueChange={(value) =>
              handlePreferenceUpdate("deadlinePreference", value)
            }
          />

          <PreferenceSlider
            label="What is your preferred noise level when studying for this class?"
            value={currentPreference.noiseLevel}
            minimumValue={STUDY_PREFERENCES.noiseLevel.min}
            maximumValue={STUDY_PREFERENCES.noiseLevel.max}
            step={STUDY_PREFERENCES.noiseLevel.step}
            onValueChange={(value) =>
              handlePreferenceUpdate("noiseLevel", value)
            }
            isNoiseLevel
          />

          <DropdownInput
            label="What grade do you want to achieve in this class?"
            value={currentPreference.targetGrade}
            onValueChange={(value) =>
              handlePreferenceUpdate("targetGrade", value)
            }
            items={GRADES}
          />

          <DropdownInput
            label="What grade do you currently expect to receive in this class?"
            value={currentPreference.expectedGrade}
            onValueChange={(value) =>
              handlePreferenceUpdate("expectedGrade", value)
            }
            items={GRADES}
          />
        </YStack>
      )}
    </YStack>
  );
});
