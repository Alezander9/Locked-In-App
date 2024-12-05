import { Id } from "./_generated/dataModel";

export interface Task {
  title: string; // maps to 'title' in AI response
  dueDate: string; // maps to 'due date' in AI response
  notes: string; // maps to 'notes' in AI response
}

export class FileProcessingError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "INVALID_FILE_TYPE"
      | "FILE_TOO_LARGE"
      | "API_KEY_MISSING"
      | "UPLOAD_FAILED"
      | "PROCESSING_FAILED"
      | "EXTRACTION_FAILED"
      | "CLEANUP_FAILED"
  ) {
    super(message);
    this.name = "FileProcessingError";
  }
}

export type Class = {
  name: string;
  // Add other class properties as needed
};

export type StudyProfile = {
  _id: string;
  classes: Class[];
  dorm?: string;
  // Add other study profile properties as needed
};

export type StorageUploadResult = {
  storageId: Id<"_storage">;
};

type BaseInput = {
  key: string;
  required: boolean;
  placeholder: string;
  helperText?: string;
};

type TextInput = BaseInput & {
  type: "text";
  multiline?: boolean;
  style?: any; // We can make this more specific if needed
};

type SliderInput = BaseInput & {
  type: "slider";
  min: number;
  max: number;
  step: number;
  defaultValue: number;
};

type GridInput = BaseInput & {
  type: "learningGrid";
  options: Array<{
    id: string;
    label: string;
  }>;
};

type ScheduleInput = BaseInput & {
  type: "schedule";
};

type SwitchInput = BaseInput & {
  type: "switch";
  defaultValue: boolean;
};

export interface CoursePreference {
  courseId: Id<"courses">;
  weeklyHours: number;
  deadlinePreference: number;
  noiseLevel: number;
  targetGrade: string;
  expectedGrade: string;
}

interface CoursePreferenceInput extends BaseInput {
  type: "coursePreference";
  key: keyof CoursePreference;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number | string;
  options?: Array<{ label: string; value: string }>;
}

export type InputConfig =
  | TextInput
  | SliderInput
  | GridInput
  | ScheduleInput
  | SwitchInput
  | CoursePreferenceInput;

// Schedule types
export type TimeSlot = {
  hour: number;
  selected: boolean;
};

export type DaySchedule = {
  day: string;
  timeSlots: TimeSlot[];
};

// Form data types
export type LearningPreferences = Record<string, number>;

export type ProfileFormData = {
  // Basic info
  dorm: string;
  whereStudy: string;
  whereStudyTags: string[];

  // Study preferences
  alertnessPreference: number;
  punctualityPreference: number;
  learningPreferences: LearningPreferences;

  // Schedule
  schedule: DaySchedule[];

  // Additional settings
  additionalInfo: string;
  shareLocation: boolean;
  syncContacts: boolean;

  // Course preferences
  coursePreferences: CoursePreference[];
  currentCourseId: Id<"courses"> | null;
};

// Validation types

// Navigation state
export type NavigationState = {
  currentStep: number;
  canGoBack: boolean;
  canContinue: boolean;
};

// Store state
export type ProfileState = {
  formData: ProfileFormData;
  validation: ValidationState;
  navigation: NavigationState;
};

export type ValidationError = {
  message: string;
  type: "error" | "warning";
};

export type ValidationResult = {
  isValid: boolean;
  errors: ValidationError[];
};

export type ValidationState = {
  [K in keyof ProfileFormData]?: ValidationError[];
} & {
  currentStep?: ValidationError[];
};

// Update StepConfig to include error messages
export interface StepConfig {
  id: string;
  title: string;
  helperText?: string;
  component: React.ComponentType<StepComponentProps>;
  validate: (data: ProfileFormData) => boolean;
  getErrors?: (data: ProfileFormData) => ValidationError[];
}

export interface StepComponentProps {
  config: StepConfig;
}

export interface StoredTimeSlot {
  day: string;
  slots: number[];
}

export interface StoredStudyProfile {
  dorm: string;
  studyLocations: string[];
  alertnessPreference: number;
  punctualityPreference: number;
  learningPreferences: Record<string, number>;
  availableTimeSlots: StoredTimeSlot[];
  coursePreferences: CoursePreference[];
  additionalInfo: string;
  shareLocation: boolean;
  syncContacts: boolean;
}
