import { DaySchedule } from "@/convex/types";
import { Platform } from "react-native";
// Time constants
export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const HOURS = Array.from({ length: 17 }, (_, i) => i + 8); // 8am to 12am

// Initial schedule setup
export const INITIAL_SCHEDULE: DaySchedule[] = DAYS.map((day) => ({
  day,
  timeSlots: HOURS.map((hour) => ({
    hour,
    selected: false,
  })),
}));

// Grade options
export const GRADES = [
  { label: "A+", value: "A+" },
  { label: "A", value: "A" },
  { label: "A-", value: "A-" },
  { label: "B+", value: "B+" },
  { label: "B", value: "B" },
  { label: "B-", value: "B-" },
  { label: "C+", value: "C+" },
  { label: "C", value: "C" },
  { label: "C-", value: "C-" },
];

// Learning methods
export const LEARNING_METHODS = [
  { id: "textbook", label: "Reading the textbook" },
  { id: "lectures", label: "Attending lectures" },
  { id: "recordings", label: "Watching recorded lectures" },
  { id: "practice", label: "Doing practice / homework problems" },
  { id: "office_hours", label: "Attending office hours" },
  { id: "discussing", label: "Discussing with students" },
  { id: "essays", label: "Writing essays" },
  { id: "llm", label: "Talking to a LLM" },
  { id: "creating_notes", label: "Creating notes/flashcards/study guides" },
  {
    id: "reading_notes",
    label: "Reading others' notes/flashcards/study guides",
  },
  { id: "teaching", label: "Teaching other students" },
  { id: "projects", label: "Doing independent projects" },
];

// Study preferences ranges
export const STUDY_PREFERENCES = {
  weeklyHours: {
    min: 1,
    max: 20,
    step: 1,
    default: 5,
  },
  deadlinePreference: {
    min: 0,
    max: 14,
    step: 1,
    default: 3,
  },
  noiseLevel: {
    min: 0,
    max: 5,
    step: 1,
    default: 2,
  },
  alertness: {
    min: 0,
    max: 2,
    step: 1,
    default: 1,
    labels: ["Morning person", "Flexible", "Night owl"],
  },
  punctuality: {
    min: 0,
    max: 2,
    step: 1,
    default: 1,
    labels: ["Early", "On time", "Running late"],
  },
};

// Validation constants
export const VALIDATION = {
  MIN_STUDY_LOCATIONS: 2,
  MAX_STUDY_LOCATIONS: 5,
  MIN_SCHEDULE_SLOTS: 3,
  MAX_ADDITIONAL_INFO_LENGTH: 500,
};

// Error messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: "This field is required",
  MIN_STUDY_LOCATIONS: `Please select at least ${VALIDATION.MIN_STUDY_LOCATIONS} study locations`,
  MAX_STUDY_LOCATIONS: `Maximum ${VALIDATION.MAX_STUDY_LOCATIONS} study locations allowed`,
  MIN_SCHEDULE_SLOTS: `Please select at least ${VALIDATION.MIN_SCHEDULE_SLOTS} time slots`,
  INVALID_GRADE: "Please select a valid grade",
  MAX_LENGTH: (field: string) => `${field} exceeds maximum length`,
};

// Animation timings
export const ANIMATION = {
  KEYBOARD_DURATION: 250,
  PROGRESS_DURATION: 10000,
};

// Screen layout
export const LAYOUT = {
  HEADER_HEIGHT: 60,
  BUTTON_SIZE: 50,
  PADDING: 16,
  KEYBOARD_OFFSET: Platform.OS === "ios" ? 8 : 24,
};
