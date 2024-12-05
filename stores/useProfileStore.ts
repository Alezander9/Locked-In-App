import { create } from "zustand";
import {
  ProfileState,
  ProfileFormData,
  ValidationError,
  CoursePreference,
  StoredTimeSlot,
  StoredStudyProfile,
} from "@/convex/types";
import { PROFILE_STEPS } from "@/features/study-profile/config/profile-steps";
import {
  INITIAL_SCHEDULE,
  ERROR_MESSAGES,
  VALIDATION,
  DAYS,
  HOURS,
} from "@/features/study-profile/config/constants";
import { Id } from "@/convex/_generated/dataModel";

const initialFormData: ProfileFormData = {
  dorm: "",
  whereStudy: "",
  whereStudyTags: [],
  alertnessPreference: 1,
  punctualityPreference: 1,
  learningPreferences: {},
  schedule: INITIAL_SCHEDULE,
  additionalInfo: "",
  shareLocation: false,
  syncContacts: false,
  coursePreferences: [],
  currentCourseId: null,
};

interface ProfileStore extends ProfileState {
  // Existing actions
  updateField: <K extends keyof ProfileFormData>(
    field: K,
    value: ProfileFormData[K]
  ) => void;
  nextStep: () => void;
  previousStep: () => void;
  resetForm: () => void;

  // New validation actions
  validateCurrentStep: () => boolean;
  validateField: <K extends keyof ProfileFormData>(
    field: K
  ) => ValidationError[];
  getCurrentStepErrors: () => ValidationError[];
  canProceed: () => boolean;

  // New course preference actions
  updateCoursePreference: (
    courseId: Id<"courses">,
    field: keyof CoursePreference,
    value: any
  ) => void;

  initializeWithExistingProfile: (existingProfile: any) => void;

  // New step actions
  setCurrentStep: (step: number) => void;
}

export const useProfileStore = create<ProfileStore>((set, get) => ({
  formData: initialFormData,
  validation: {},
  navigation: {
    currentStep: 0,
    canGoBack: false,
    canContinue: false,
  },

  updateField: (field, value) => {
    set((state) => ({
      formData: {
        ...state.formData,
        [field]: value,
      },
      validation: {
        ...state.validation,
        [field]: get().validateField(field),
      },
    }));

    // Update navigation state based on validation
    get().canProceed();
  },

  validateField: (field) => {
    const { formData } = get();
    const errors: ValidationError[] = [];

    switch (field) {
      case "dorm":
        if (!formData.dorm.trim()) {
          errors.push({
            type: "error",
            message: ERROR_MESSAGES.REQUIRED_FIELD,
          });
        }
        break;

      case "whereStudy":
        const locations = formData.whereStudy
          .split(",")
          .map((loc) => loc.trim())
          .filter((loc) => loc.length > 0);

        if (locations.length === 0) {
          errors.push({
            type: "error",
            message: ERROR_MESSAGES.REQUIRED_FIELD,
          });
        } else if (locations.length < VALIDATION.MIN_STUDY_LOCATIONS) {
          errors.push({
            type: "error",
            message: `Please enter at least ${VALIDATION.MIN_STUDY_LOCATIONS} study locations`,
          });
        }
        break;

      case "schedule":
        const selectedSlots = formData.schedule.reduce(
          (count, day) =>
            count + day.timeSlots.filter((slot) => slot.selected).length,
          0
        );
        if (selectedSlots < VALIDATION.MIN_SCHEDULE_SLOTS) {
          errors.push({
            type: "error",
            message: ERROR_MESSAGES.MIN_SCHEDULE_SLOTS,
          });
        }
        break;

      case "coursePreferences":
        if (formData.coursePreferences.length === 0) {
          errors.push({
            type: "error",
            message: "Please add at least one course",
          });
        } else {
          const invalidCourses = formData.coursePreferences.filter(
            (pref) => !pref.targetGrade || !pref.expectedGrade
          );
          if (invalidCourses.length > 0) {
            errors.push({
              type: "error",
              message: "Please complete all course preferences",
            });
          }
        }
        break;
    }

    return errors;
  },

  validateCurrentStep: () => {
    const { currentStep } = get().navigation;
    const stepConfig = PROFILE_STEPS[currentStep];
    const errors = stepConfig.getErrors?.(get().formData) || [];

    set((state) => ({
      validation: {
        ...state.validation,
        currentStep: errors,
      },
    }));

    return errors.length === 0 && stepConfig.validate(get().formData);
  },

  getCurrentStepErrors: () => {
    const { validation } = get();
    return validation.currentStep || [];
  },

  canProceed: () => {
    const isValid = get().validateCurrentStep();

    set((state) => ({
      navigation: {
        ...state.navigation,
        canContinue: isValid,
      },
    }));

    return isValid;
  },

  nextStep: () => {
    if (!get().canProceed()) return;

    set((state) => ({
      navigation: {
        ...state.navigation,
        currentStep: state.navigation.currentStep + 1,
        canGoBack: true,
        canContinue: false, // Will be updated by validateCurrentStep
      },
    }));

    // Validate the new step
    get().canProceed();
  },

  previousStep: () => {
    set((state) => ({
      navigation: {
        ...state.navigation,
        currentStep: Math.max(0, state.navigation.currentStep - 1),
        canGoBack: state.navigation.currentStep > 1,
      },
    }));

    // Validate the new step
    get().canProceed();
  },

  resetForm: () => {
    set({
      formData: initialFormData,
      validation: {},
      navigation: {
        currentStep: 0,
        canGoBack: false,
        canContinue: false,
      },
    });
  },

  updateCoursePreference: (courseId, field, value) => {
    set((state) => {
      const updatedPreferences = state.formData.coursePreferences.map((pref) =>
        pref.courseId === courseId ? { ...pref, [field]: value } : pref
      );

      return {
        formData: {
          ...state.formData,
          coursePreferences: updatedPreferences,
        },
      };
    });

    get().canProceed();
  },

  initializeWithExistingProfile: (existingProfile: StoredStudyProfile) => {
    if (!existingProfile) return;

    const formData = {
      dorm: existingProfile.dorm,
      whereStudy: existingProfile.studyLocations.join(", "),
      whereStudyTags: existingProfile.studyLocations,
      alertnessPreference: existingProfile.alertnessPreference,
      punctualityPreference: existingProfile.punctualityPreference,
      learningPreferences: existingProfile.learningPreferences,
      schedule: DAYS.map((day) => ({
        day,
        timeSlots: HOURS.map((hour) => ({
          hour,
          selected:
            existingProfile.availableTimeSlots
              .find((slot: StoredTimeSlot) => slot.day === day)
              ?.slots.includes(hour) ?? false,
        })),
      })),
      coursePreferences: existingProfile.coursePreferences || [],
      currentCourseId: existingProfile.coursePreferences?.[0]?.courseId || null,
      additionalInfo: existingProfile.additionalInfo || "",
      shareLocation: existingProfile.shareLocation,
      syncContacts: existingProfile.syncContacts,
    };

    set({
      formData,
      navigation: {
        currentStep: 0,
        canGoBack: false,
        canContinue: true,
      },
    });
  },

  setCurrentStep: (step: number) => {
    set((state) => ({
      navigation: {
        ...state.navigation,
        currentStep: step,
        canGoBack: step > 0,
        canContinue: true,
      },
    }));
  },
}));

export default useProfileStore;
