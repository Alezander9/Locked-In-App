import { StepConfig } from "@/convex/types";
import {
  DormStep,
  StudyLocationsStep,
  StudyHabitsStep,
  ScheduleStep,
  AdditionalInfoStep,
  CoursePreferencesStep,
} from "../components/steps";
import { VALIDATION } from "./constants";

export const PROFILE_STEPS: StepConfig[] = [
  {
    id: "dorm",
    title: "Which dorm do you live in?",
    component: DormStep,
    validate: (data) => !!data.dorm.trim(),
  },
  {
    id: "study_locations",
    title: "Where do you like to study?",
    component: StudyLocationsStep,
    validate: (data) => {
      const locations = data.whereStudy
        .split(",")
        .map((loc) => loc.trim())
        .filter((loc) => loc.length > 0);

      return locations.length >= VALIDATION.MIN_STUDY_LOCATIONS;
    },
    getErrors: (data) => {
      const locations = data.whereStudy
        .split(",")
        .map((loc) => loc.trim())
        .filter((loc) => loc.length > 0);

      if (locations.length === 0) {
        return [
          {
            type: "error",
            message: "Please enter some study locations",
          },
        ];
      }

      if (locations.length < VALIDATION.MIN_STUDY_LOCATIONS) {
        return [
          {
            type: "error",
            message: `Please enter at least ${VALIDATION.MIN_STUDY_LOCATIONS} locations, separated by commas`,
          },
        ];
      }

      return [];
    },
  },
  {
    id: "study_habits",
    title: "General Study Habits",
    component: StudyHabitsStep,
    validate: (data) => {
      return (
        data.alertnessPreference !== undefined &&
        data.punctualityPreference !== undefined &&
        Object.keys(data.learningPreferences).length > 0
      );
    },
  },
  {
    id: "schedule",
    title: "Study Free Time",
    helperText: "Select the hours you're typically free to study",
    component: ScheduleStep,
    validate: (data) => {
      const selectedSlots = data.schedule.reduce(
        (count, day) =>
          count + day.timeSlots.filter((slot) => slot.selected).length,
        0
      );
      return selectedSlots >= VALIDATION.MIN_SCHEDULE_SLOTS;
    },
    getErrors: (data) => {
      const selectedSlots = data.schedule.reduce(
        (count, day) =>
          count + day.timeSlots.filter((slot) => slot.selected).length,
        0
      );

      if (selectedSlots < VALIDATION.MIN_SCHEDULE_SLOTS) {
        return [
          {
            type: "error",
            message: `Please select at least ${VALIDATION.MIN_SCHEDULE_SLOTS} hours of availability`,
          },
        ];
      }
      return [];
    },
  },
  {
    id: "course_preferences",
    title: "Course Study Habits",
    helperText: "Tell us about your study preferences for each course",
    component: CoursePreferencesStep,
    validate: (data) => {
      if (data.coursePreferences.length === 0) return false;

      return data.coursePreferences.every(
        (pref) =>
          pref.weeklyHours !== undefined &&
          pref.deadlinePreference !== undefined &&
          pref.noiseLevel !== undefined &&
          pref.targetGrade &&
          pref.expectedGrade
      );
    },
  },
  {
    id: "additional_info",
    title: "Anything else you'd like to share?",
    component: AdditionalInfoStep,
    validate: () => true, // Optional step
  },
];

export default PROFILE_STEPS;
