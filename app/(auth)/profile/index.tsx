import { Stack, Text, YStack, Circle } from "tamagui";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { CustomInput } from "@/components/CustomInput";
import { ProfileCreationHeader } from "@/components/ProfileCreationHeader";
import { useState, useEffect, useRef } from "react";
import Icons from "@/app/components/icons";
import {
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Keyboard,
  KeyboardEvent,
  Dimensions,
  View,
  Modal,
  TextInput,
  StyleProp,
  TextStyle,
} from "react-native";
import { useRouter } from "expo-router";
import { TagInput } from "@/components/TagInput";
import { WeeklyScheduleSelector } from "@/components/WeeklyScheduleSelector";
import { PreferenceSlider } from "@/components/PreferenceSlider";
import { DropdownInput } from "@/components/DropdownInput";
import { XStack } from "tamagui";
import { GeneralStudyHabits } from "@/components/GeneralStudyHabits";
import { LearningPreferencesGrid } from "@/components/LearningPreferencesGrid";
import { CustomSwitch } from "@/components/CustomSwitch";
import { Button } from "@/components/buttons/CustomButton";
import { ProgressAnimation } from "@/components/ProgressAnimation";
import { LockAnimation } from "@/components/LockAnimation";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

// Add these type definitions at the top of the file
type BaseInput = {
  placeholder: string;
  key: string;
  required: boolean;
  helperText?: string;
  showWhyLink?: boolean;
};

type TextInputConfig = BaseInput & {
  type?: "text";
  style?: StyleProp<TextStyle>;
};

type TagInput = BaseInput & {
  type: "tag";
};

// New types for the schedule
type TimeSlot = {
  hour: number;
  selected: boolean;
};

type DaySchedule = {
  day: string;
  timeSlots: TimeSlot[];
};

type ScheduleInput = BaseInput & {
  type: "schedule";
};

type SliderInput = BaseInput & {
  type: "slider";
  min: number;
  max: number;
  step: number;
  defaultValue: number;
};

type DropdownInput = BaseInput & {
  type: "dropdown";
  options: { label: string; value: string }[];
  defaultValue: string;
};

type LearningGridInput = BaseInput & {
  type: "learningGrid";
  options: { id: string; label: string }[];
};

type SwitchInput = BaseInput & {
  type: "switch";
  defaultValue?: boolean;
  helperText?: string;
};

type InputConfig =
  | TextInputConfig
  | TagInput
  | ScheduleInput
  | SliderInput
  | DropdownInput
  | LearningGridInput
  | SwitchInput;

// Constants for the schedule
const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const HOURS = Array.from({ length: 17 }, (_, i) => i + 8); // 8am to 12am

// Move GRADES constant up, before PROFILE_STEPS
const GRADES = [
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

// Update the PROFILE_STEPS type
type Step = {
  title: string;
  helperText?: string;
  inputs: InputConfig[];
};

// Update your PROFILE_STEPS array typing
const PROFILE_STEPS: Step[] = [
  {
    title: "Which dorm do you live in?",
    inputs: [
      {
        placeholder: "Branner, Kimball...",
        key: "dorm",
        required: true,
      },
    ],
  },
  {
    title: "Where do you like to study?",
    inputs: [
      {
        placeholder: "Green Library, Lathrop...",
        key: "whereStudy",
        required: true,
        type: "tag",
      },
    ],
  },
  {
    title: "General Study Habits",
    inputs: [
      {
        type: "slider",
        placeholder: "Do you feel more alert in the morning or in the evening?",
        key: "alertnessPreference",
        required: true,
        min: 0,
        max: 2,
        step: 1,
        defaultValue: 1,
      },
      {
        type: "slider",
        placeholder: "Are you usually early, on-time, or late to meetings?",
        key: "punctualityPreference",
        required: true,
        min: 0,
        max: 2,
        step: 1,
        defaultValue: 1,
      },
      {
        type: "learningGrid",
        placeholder: "Rate how effective each learning method is for you",
        key: "learningPreferences",
        required: true,
        options: [
          { id: "textbook", label: "Reading the textbook" },
          { id: "lectures", label: "Attending lectures" },
          { id: "recordings", label: "Watching recorded lectures" },
          { id: "practice", label: "Doing practice / homework problems" },
          { id: "office_hours", label: "Attending office hours" },
          { id: "discussing", label: "Discussing with students" },
          { id: "essays", label: "Writing essays" },
          { id: "llm", label: "Talking to a LLM" },
          {
            id: "creating_notes",
            label: "Creating notes/flashcards/study guides",
          },
          {
            id: "reading_notes",
            label: "Reading others' notes/flashcards/study guides",
          },
          { id: "teaching", label: "Teaching other students" },
          { id: "projects", label: "Doing independent projects" },
        ],
      },
    ],
  },
  {
    title: "Study Habits",
    helperText: "Tell us about your study preferences",
    inputs: [
      {
        placeholder:
          "How many hours per week do you plan to work on this class?",
        key: "weeklyHours",
        required: true,
        type: "slider",
        min: 1,
        max: 20,
        step: 1,
        defaultValue: 5,
      },
      {
        placeholder:
          "In general, how many days before a deadline do you start your assignments?",
        key: "deadlinePreference",
        required: true,
        type: "slider",
        min: 0,
        max: 14,
        step: 1,
        defaultValue: 3,
      },
      {
        placeholder:
          "What is your preferred noise level when studying for this class?",
        key: "noiseLevel",
        required: true,
        type: "slider",
        min: 0,
        max: 5,
        step: 1,
        defaultValue: 2,
      },
      {
        placeholder: "What grade do you want to achieve in this class?",
        key: "targetGrade",
        required: true,
        type: "dropdown",
        options: GRADES,
        defaultValue: "",
      },
      {
        placeholder:
          "What grade do you currently expect to receive in this class?",
        key: "expectedGrade",
        required: true,
        type: "dropdown",
        options: GRADES,
        defaultValue: "",
      },
    ],
  },
  {
    title: "Study Free Time",
    helperText: "Select the hours you're typically free to study",
    inputs: [
      {
        placeholder: "Select your availability",
        key: "schedule",
        required: true,
        type: "schedule",
      },
    ],
  },
  {
    title: "Anything else you'd like to share?",
    inputs: [
      {
        placeholder:
          "Non-negotiables, learning disabilities, anything else (optional)",
        key: "additionalInfo",
        required: false,
        type: "text",
        style: {
          height: 100,
          textAlignVertical: "top",
          paddingTop: 8,
        },
      },
      {
        placeholder: "Share Location", // This will be used as the subtitle
        key: "shareLocation",
        required: false,
        type: "switch",
        defaultValue: false,
        helperText: "Allow us to suggest study spots and partners nearby",
      },
      {
        placeholder: "Sync Contacts", // This will be used as the subtitle
        key: "syncContacts",
        required: false,
        type: "switch",
        defaultValue: false,
        helperText: "Find your friends who are already on the platform",
      },
    ],
  },
  {
    title: "Are you ready to get LockedIn?",
    inputs: [],
  },
];

// Define the class data type
type ClassData = {
  id: string;
  name: string;
  weeklyHours: number;
  deadlinePreference: number;
  targetGrade: string;
  expectedGrade: string;
  noiseLevel: number;
  [key: string]: string | number | boolean; // Add index signature to allow dynamic properties
};

// Update the FormData type to make toggle fields optional
type FormData = {
  classes: ClassData[];
  currentClassId: string | null;
  dorm: string;
  whereStudy: string;
  whereStudyTags: string[];
  studySpot: string;
  studyTime: string;
  goal: string;
  bio: string;
  schedule: DaySchedule[];
  learningPreferences: Record<string, number>;
  additionalInfo: string;
  shareLocation: boolean;
  syncContacts: boolean;
  [key: string]:
    | string
    | string[]
    | DaySchedule[]
    | number
    | ClassData[]
    | null
    | Record<string, number>
    | boolean
    | undefined; // Update index signature
};

// Add this near your other type definitions
type ClassChipProps = {
  name: string;
  isSelected: boolean;
  onPress: () => void;
  onDelete: () => void;
};

// Type guard functions
const isScheduleInput = (input: InputConfig): input is ScheduleInput => {
  return input.type === "schedule";
};

const isTagInput = (input: InputConfig): input is TagInput => {
  return input.type === "tag";
};

const isLearningGridInput = (
  input: InputConfig
): input is LearningGridInput => {
  return input.type === "learningGrid";
};

const isSwitchInput = (input: InputConfig): input is SwitchInput => {
  console.log("Checking if switch input:", input); // Debug log
  const isSwitch = input.type === "switch";
  console.log("Is switch?", isSwitch); // Debug log
  return isSwitch;
};

// First, add this type guard near your other type guards
const isTextInput = (input: InputConfig): input is TextInputConfig => {
  return !input.type || input.type === "text";
};

// Add this interface with your other type definitions
type StudyProfileData = {
  dorm: string;
  studyLocations: string[];
  alertnessPreference: number;
  punctualityPreference: number;
  learningPreferences: Record<string, number>;
  availableTimeSlots: {
    day: string;
    slots: number[];
  }[];
  classes: {
    name: string;
    weeklyHours: number;
    deadlinePreference: number;
    targetGrade: string;
    expectedGrade: string;
    noiseLevel: number;
  }[];
  additionalInfo: string;
  shareLocation: boolean;
  syncContacts: boolean;
};

// Then your packageFormData function can use this type
const packageFormData = (formData: FormData): StudyProfileData => {
  console.log("Raw punctualityPreference:", formData.punctualityPreference);
  console.log(
    "Type of punctualityPreference:",
    typeof formData.punctualityPreference
  );

  const punctualityValue =
    formData.punctualityPreference !== undefined &&
    formData.punctualityPreference !== null
      ? Number(formData.punctualityPreference)
      : 1;

  console.log("Converted punctualityPreference:", punctualityValue);

  return {
    dorm: formData.dorm as string,
    studyLocations: formData.whereStudyTags as string[],

    alertnessPreference:
      formData.alertnessPreference !== undefined
        ? Number(formData.alertnessPreference)
        : 1,

    punctualityPreference: punctualityValue,

    learningPreferences: formData.learningPreferences as Record<string, number>,

    availableTimeSlots: formData.schedule
      .map((day) => ({
        day: day.day,
        slots: day.timeSlots
          .filter((slot) => slot.selected)
          .map((slot) => slot.hour),
      }))
      .filter((day) => day.slots.length > 0),

    classes: formData.classes.map((classData) => ({
      name: classData.name,
      weeklyHours: Number(classData.weeklyHours),
      deadlinePreference: Number(classData.deadlinePreference),
      targetGrade: classData.targetGrade,
      expectedGrade: classData.expectedGrade,
      noiseLevel: Number(classData.noiseLevel),
    })),

    additionalInfo: formData.additionalInfo as string,
    shareLocation: Boolean(formData.shareLocation),
    syncContacts: Boolean(formData.syncContacts),
  };
};

export default function CreateStudyProfile() {
  const [currentStep, setCurrentStep] = useState(PROFILE_STEPS.length - 1);
  const [formData, setFormData] = useState<FormData>({
    classes: [],
    currentClassId: null,
    dorm: "",
    whereStudy: "",
    whereStudyTags: [],
    studySpot: "",
    studyTime: "",
    goal: "",
    bio: "",
    schedule: DAYS.map((day) => ({
      day,
      timeSlots: HOURS.map((hour) => ({
        hour,
        selected: false,
      })),
    })),
    weeklyHours: 5,
    deadlinePreference: 3,
    targetGrade: "",
    expectedGrade: "",
    noiseLevel: 2,
    alertnessPreference: 1,
    punctualityPreference: 1,
    learningPreferences: {},
    additionalInfo: "",
    shareLocation: false,
    syncContacts: false,
  });

  // Animation setup remains the same
  const buttonAnimation = useRef(new Animated.Value(0)).current;
  const screenHeight = Dimensions.get("window").height;
  const router = useRouter();

  // Keyboard animation logic remains the same
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (event: KeyboardEvent) => {
        const keyboardHeight = event.endCoordinates.height;
        const maxSlide = Math.min(keyboardHeight, screenHeight * 0.05);

        Animated.timing(buttonAnimation, {
          toValue: maxSlide,
          duration: Platform.OS === "ios" ? event.duration : 250,
          useNativeDriver: true,
        }).start();
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      (event: KeyboardEvent) => {
        Animated.timing(buttonAnimation, {
          toValue: 0,
          duration: Platform.OS === "ios" ? event.duration : 250,
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const translateY = buttonAnimation.interpolate({
    inputRange: [0, 1000],
    outputRange: [0, -1000],
  });

  const handleInputChange = (key: string, value: string | number | boolean) => {
    const currentStepData = PROFILE_STEPS[currentStep];

    if (currentStepData.title === "Study Habits" && formData.currentClassId) {
      setFormData((prev) => ({
        ...prev,
        classes: prev.classes.map((c) =>
          c.id === prev.currentClassId
            ? ({ ...c, [key]: value } as ClassData)
            : c
        ),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  const handleContinue = () => {
    const currentStepData = PROFILE_STEPS[currentStep];

    // Special handling for "Anything else you'd like to share?" page
    if (currentStepData.title === "Anything else you'd like to share?") {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    if (currentStepData.title === "Study Habits") {
      if (!isButtonDisabled()) {
        setCurrentStep((prev) => prev + 1);
      }
      return;
    }

    // Special handling for General Study Habits page
    if (currentStepData.title === "General Study Habits") {
      const learningGridInput = currentStepData.inputs.find(
        (input) => input.type === "learningGrid"
      );
      if (learningGridInput && !isButtonDisabled()) {
        if (currentStep < PROFILE_STEPS.length - 1) {
          setCurrentStep((prev) => prev + 1);
        } else {
          router.replace("/(tabs)/groups");
        }
      }
      return;
    }

    // For other pages
    const input = currentStepData.inputs[0];
    const isValid = isScheduleInput(input)
      ? formData.schedule.some((day) =>
          day.timeSlots.some((slot) => slot.selected)
        )
      : isTagInput(input)
        ? (formData[`${input.key}Tags`] as string[]).length >= 2
        : typeof formData[input.key] === "string" &&
          (formData[input.key] as string).trim() !== "";

    if (isValid) {
      if (currentStep < PROFILE_STEPS.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        router.replace("/(tabs)/groups");
      }
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const currentStepData = PROFILE_STEPS[currentStep];

  // Helper function to check if any slots are selected
  const hasSelectedSlots = () => {
    if (currentStepData.inputs[0].type === "schedule") {
      const schedule = formData.schedule as DaySchedule[];
      return schedule.some((day) =>
        day.timeSlots.some((slot) => slot.selected)
      );
    }
    return false;
  };

  // Update the button's disabled state
  const isButtonDisabled = () => {
    // Make the button always enabled for "Anything else you'd like to share?" page
    if (currentStepData.title === "Anything else you'd like to share?") {
      return false;
    }

    const currentInput = currentStepData.inputs[0];

    if (currentStepData.title === "Study Habits") {
      // First check if there are any classes
      if (formData.classes.length === 0) {
        return true;
      }

      // Check if all classes have their required fields filled out
      return formData.classes.some((classData) => {
        const missingFields = [
          "weeklyHours",
          "deadlinePreference",
          "noiseLevel",
          "targetGrade",
          "expectedGrade",
        ].some((field) => {
          if (typeof classData[field] === "string") {
            return !classData[field];
          } else if (typeof classData[field] === "number") {
            return classData[field] === undefined || classData[field] === null;
          }
          return true;
        });

        return !classData.name || missingFields;
      });
    }

    if (currentInput.type === "schedule") {
      return !formData.schedule.some((day) =>
        day.timeSlots.some((slot) => slot.selected)
      );
    }

    if (currentInput.type === "tag") {
      return (formData[`${currentInput.key}Tags`] as string[]).length < 2;
    }

    if (currentStepData.title === "General Study Habits") {
      // Only check if all learning preferences have been rated
      const learningGridInput = currentStepData.inputs.find(
        (input) => input.type === "learningGrid"
      );
      if (learningGridInput && learningGridInput.type === "learningGrid") {
        const requiredOptions = learningGridInput.options.map((opt) => opt.id);
        return requiredOptions.some(
          (optionId) => !formData.learningPreferences[optionId]
        );
      }
      return false;
    }

    return !formData[currentInput.key];
  };

  // Add state to track which dropdown is open
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Add state for class name input modal
  const [showClassModal, setShowClassModal] = useState(false);
  const [newClassName, setNewClassName] = useState("");

  const handleAddClass = () => {
    setShowClassModal(true);
  };

  const handleCreateClass = () => {
    if (newClassName.trim()) {
      const newClass: ClassData = {
        id: Date.now().toString(),
        name: newClassName,
        weeklyHours: 5,
        deadlinePreference: 7,
        noiseLevel: 2,
        targetGrade: "",
        expectedGrade: "",
      };

      setFormData((prev) => ({
        ...prev,
        classes: [...prev.classes, newClass],
        currentClassId: newClass.id,
      }));

      setNewClassName("");
      setShowClassModal(false);
    }
  };

  const currentClass = formData.classes.find(
    (c) => c.id === formData.currentClassId
  );

  // Update the ClassSelector component
  const ClassSelector = () => (
    <XStack
      space="$0"
      marginBottom="$2"
      flexWrap="wrap"
      paddingHorizontal="$4"
      gap="$1"
    >
      {formData.classes.map((classData) => (
        <XStack
          key={classData.id}
          backgroundColor={
            classData.id === formData.currentClassId ? "#0F9ED5" : "white"
          }
          borderWidth={1}
          borderColor={
            classData.id === formData.currentClassId ? "#0F9ED5" : "$gray"
          }
          borderRadius="$4"
          paddingVertical="$1"
          paddingHorizontal="$2"
          marginBottom={0}
          marginRight={0}
          alignItems="center"
          pressStyle={{
            opacity: 0.8,
            scale: 0.98,
          }}
        >
          <TouchableOpacity
            onPress={() =>
              setFormData((prev) => ({
                ...prev,
                currentClassId: classData.id,
              }))
            }
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              color={
                classData.id === formData.currentClassId ? "white" : "$gray12"
              }
              fontSize="$3"
              fontWeight="500"
            >
              {classData.name}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setFormData((prev) => {
                const newClasses = prev.classes.filter(
                  (c) => c.id !== classData.id
                );
                return {
                  ...prev,
                  classes: newClasses,
                  currentClassId:
                    newClasses.length > 0 ? newClasses[0].id : null,
                };
              });
            }}
            style={{ marginLeft: 4 }}
          >
            <Text
              color={
                classData.id === formData.currentClassId ? "white" : "$gray"
              }
              fontSize="$3"
              fontWeight="600"
            >
              ×
            </Text>
          </TouchableOpacity>
        </XStack>
      ))}
    </XStack>
  );

  const [showProgress, setShowProgress] = useState(false);
  const [isLockAnimating, setIsLockAnimating] = useState(false);

  // Optional: If you want an easy way to switch between first and last step during testing,
  // you can add this somewhere in your component:
  useEffect(() => {
    // Set this to true to start at the last step, false to start at the first step
    const testingFinalStep = false;
    setCurrentStep(testingFinalStep ? PROFILE_STEPS.length - 1 : 0);
  }, []);

  // Add this near your other hooks
  const updateStudyProfile = useMutation(api.mutations.updateStudyProfile);

  // Add this state at the top of your component
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Add these keyboard listeners in a useEffect
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => setKeyboardVisible(true)
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={-100}
        style={{ flex: 1 }}
      >
        <Stack flex={1} paddingHorizontal="$4" paddingTop="$8">
          <ProfileCreationHeader
            currentStep={currentStep}
            totalSteps={PROFILE_STEPS.length}
            onBack={handleBack}
            showAddClass={currentStepData.title === "Study Habits"}
            showImport={currentStepData.title === "Study Free Time"}
            onAddClass={() => {
              setShowClassModal(true);
            }}
            onImport={() => {
              console.log("Import schedule clicked");
            }}
          />

          {formData.classes.length > 0 &&
            currentStepData.title === "Study Habits" && <ClassSelector />}

          {/* Add Modal for new class name */}
          <Modal visible={showClassModal} transparent>
            <YStack
              flex={1}
              justifyContent="center"
              alignItems="center"
              backgroundColor="rgba(0,0,0,0.5)"
            >
              <YStack
                backgroundColor="white"
                padding="$4"
                borderRadius="$4"
                width="80%"
              >
                <Text fontSize="$4" fontWeight="600" marginBottom="$4">
                  Add New Class
                </Text>
                <CustomInput
                  placeholder="Enter class name"
                  value={newClassName}
                  onChangeText={setNewClassName}
                />
                <XStack space="$4" marginTop="$4">
                  <TouchableOpacity onPress={() => setShowClassModal(false)}>
                    <Text color="$gray">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleCreateClass}>
                    <Text color="#0F9ED5">Add</Text>
                  </TouchableOpacity>
                </XStack>
              </YStack>
            </YStack>
          </Modal>

          <YStack flex={1}>
            <YStack flex={1} marginTop="$1">
              {currentStepData.title === "Study Habits" ? (
                <>
                  {formData.classes.length > 0 ? (
                    <XStack
                      space="$2"
                      alignItems="center"
                      marginBottom="$4"
                      paddingHorizontal="$4"
                    >
                      <Text fontSize="$5" fontWeight="800">
                        Study Habits for
                      </Text>
                      <TextInput
                        value={currentClass?.name}
                        onChangeText={(newName) => {
                          setFormData((prev) => ({
                            ...prev,
                            classes: prev.classes.map((c) =>
                              c.id === prev.currentClassId
                                ? { ...c, name: newName }
                                : c
                            ),
                          }));
                        }}
                        style={{
                          color: "#0F9ED5",
                          fontSize: 20,
                          fontWeight: "800",
                          padding: 0,
                          margin: 0,
                          minWidth: 80,
                          borderBottomWidth: 1,
                          borderBottomColor: "#0F9ED5",
                        }}
                        placeholder="Class Name"
                      />
                    </XStack>
                  ) : (
                    <Text
                      fontSize="$5"
                      fontWeight="800"
                      marginBottom="$4"
                      paddingHorizontal="$4"
                    >
                      Study Habits
                    </Text>
                  )}

                  {formData.classes.length === 0 ? (
                    <YStack
                      flex={1}
                      justifyContent="center"
                      alignItems="center"
                      paddingHorizontal="$4"
                    >
                      <Text color="$gray" fontSize="$4" textAlign="center">
                        Add a class using the + button above to start setting
                        your class-specific preferences
                      </Text>
                    </YStack>
                  ) : (
                    <YStack space="$2" paddingHorizontal="$4">
                      {currentStepData.inputs.map((input) => {
                        console.log("Processing input:", input); // Debug log

                        // Handle switch input FIRST, before any other conditions
                        if (input.type === "switch") {
                          console.log("Rendering switch component"); // Debug log
                          return (
                            <CustomSwitch
                              key={input.key}
                              value={formData[input.key] as boolean}
                              onValueChange={(value) =>
                                handleInputChange(input.key, value)
                              }
                            />
                          );
                        }

                        // Then handle text input
                        if (!input.type || input.type === "text") {
                          return (
                            <CustomInput
                              key={input.key}
                              placeholder={input.placeholder}
                              value={formData[input.key] as string}
                              onChangeText={(value) =>
                                handleInputChange(input.key, value)
                              }
                              required={input.required}
                              style={input.style}
                            />
                          );
                        }

                        if (input.type === "slider") {
                          return (
                            <PreferenceSlider
                              key={input.key}
                              label={input.placeholder}
                              value={
                                (currentClass?.[input.key] as number) ??
                                input.defaultValue
                              }
                              minimumValue={input.min}
                              maximumValue={input.max}
                              step={input.step}
                              isNoiseLevel={input.key === "noiseLevel"}
                              onValueChange={(value) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  classes: prev.classes.map((c) =>
                                    c.id === prev.currentClassId
                                      ? { ...c, [input.key]: value }
                                      : c
                                  ),
                                }));
                              }}
                            />
                          );
                        }

                        if (input.type === "dropdown") {
                          return (
                            <View
                              key={input.key}
                              style={{
                                zIndex:
                                  activeDropdown === input.key ? 4000 : 3000,
                              }}
                            >
                              <DropdownInput
                                label={input.placeholder}
                                value={
                                  (currentClass?.[input.key] as string) ?? ""
                                }
                                onValueChange={(value) => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    classes: prev.classes.map((c) =>
                                      c.id === prev.currentClassId
                                        ? { ...c, [input.key]: value }
                                        : c
                                    ),
                                  }));
                                }}
                                items={input.options}
                                onOpen={() => setActiveDropdown(input.key)}
                              />
                            </View>
                          );
                        }

                        if (input.type === "learningGrid") {
                          return (
                            <LearningPreferencesGrid
                              key={input.key}
                              label={input.placeholder}
                              options={input.options}
                              values={formData.learningPreferences || {}}
                              onChange={(id, rating) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  learningPreferences: {
                                    ...prev.learningPreferences,
                                    [id]: rating,
                                  },
                                }));
                              }}
                            />
                          );
                        }

                        return (
                          <CustomInput
                            key={input.key}
                            placeholder={input.placeholder}
                            value={formData[input.key] as string}
                            onChangeText={(value) =>
                              handleInputChange(input.key, value)
                            }
                            required={input.required}
                          />
                        );
                      })}
                    </YStack>
                  )}
                </>
              ) : (
                <>
                  <Text
                    fontSize="$5"
                    fontWeight="800"
                    marginBottom="$4"
                    paddingHorizontal="$4"
                  >
                    {currentStepData.title}
                  </Text>

                  {currentStepData.title ===
                  "Anything else you'd like to share?" ? (
                    <YStack paddingHorizontal="$4">
                      <CustomInput
                        placeholder="Non-negotiables, learning disabilities, anything else to share (optional)"
                        value={formData.additionalInfo as string}
                        onChangeText={(value) =>
                          handleInputChange("additionalInfo", value)
                        }
                        style={{
                          height: 70,
                          textAlignVertical: "top",
                          paddingTop: 8,
                        }}
                        multiline
                      />

                      <YStack height="$2" />

                      <CustomSwitch
                        value={formData.shareLocation}
                        onValueChange={(value) =>
                          handleInputChange("shareLocation", value)
                        }
                        subtitle="Share Location"
                        helperText="Allow us to suggest study spots and partners nearby (optional)"
                      />

                      <YStack height="$4" />

                      <CustomSwitch
                        value={formData.syncContacts}
                        onValueChange={(value) =>
                          handleInputChange("syncContacts", value)
                        }
                        subtitle="Sync Contacts"
                        helperText="Find your friends who are already on the platform (optional)"
                      />
                    </YStack>
                  ) : (
                    <YStack space="$2" paddingHorizontal="$4">
                      {currentStepData.inputs.map((input) => {
                        if (
                          currentStepData.title === "General Study Habits" &&
                          input.type === "slider"
                        ) {
                          return (
                            <GeneralStudyHabits
                              key={input.key}
                              label={input.placeholder}
                              value={
                                (formData[input.key] as number) ??
                                input.defaultValue
                              }
                              minimumValue={input.min}
                              maximumValue={input.max}
                              step={input.step}
                              sliderType={
                                input.key === "alertnessPreference"
                                  ? "alertness"
                                  : "punctuality"
                              }
                              onValueChange={(value) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  [input.key]: value,
                                }));
                              }}
                              paddingBottom={16}
                            />
                          );
                        }

                        if (
                          currentStepData.title === "General Study Habits" &&
                          input.type === "learningGrid"
                        ) {
                          return (
                            <YStack key={input.key} marginTop="-$4">
                              <LearningPreferencesGrid
                                label={input.placeholder}
                                options={input.options}
                                values={formData.learningPreferences}
                                onChange={(id, rating) => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    learningPreferences: {
                                      ...prev.learningPreferences,
                                      [id]: rating,
                                    },
                                  }));
                                }}
                              />
                            </YStack>
                          );
                        }

                        if (input.type === "schedule") {
                          return (
                            <YStack key={input.key} paddingTop="$2">
                              <WeeklyScheduleSelector
                                value={formData.schedule}
                                onChange={(newSchedule) => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    schedule: newSchedule,
                                  }));
                                }}
                                helperText={currentStepData.helperText}
                              />
                            </YStack>
                          );
                        }

                        if (input.type === "tag") {
                          return (
                            <TagInput
                              key={input.key}
                              placeholder={input.placeholder}
                              value={
                                formData[
                                  input.key as keyof typeof formData
                                ] as string
                              }
                              tags={
                                formData[
                                  `${input.key}Tags` as keyof typeof formData
                                ] as string[]
                              }
                              onChangeText={(value) =>
                                handleInputChange(input.key, value)
                              }
                              onAddTag={(tag) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  [`${input.key}Tags`]: [
                                    ...(prev[
                                      `${input.key}Tags` as keyof typeof formData
                                    ] as string[]),
                                    tag,
                                  ],
                                }));
                              }}
                              onRemoveTag={(index) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  [`${input.key}Tags`]: (
                                    prev[
                                      `${input.key}Tags` as keyof typeof formData
                                    ] as string[]
                                  ).filter((_, i) => i !== index),
                                }));
                              }}
                            />
                          );
                        }

                        return (
                          <CustomInput
                            key={input.key}
                            placeholder={input.placeholder}
                            value={
                              formData[
                                input.key as keyof typeof formData
                              ] as string
                            }
                            onChangeText={(value) =>
                              handleInputChange(input.key, value)
                            }
                            required={input.required}
                            onWhyPress={() => console.log("Why pressed")}
                          />
                        );
                      })}
                    </YStack>
                  )}
                </>
              )}
            </YStack>

            {currentStep !== PROFILE_STEPS.length - 1 ? (
              <Animated.View
                style={{
                  transform: [
                    {
                      translateY:
                        currentStepData.title ===
                        "Anything else you'd like to share?"
                          ? buttonAnimation.interpolate({
                              inputRange: [0, 1000],
                              outputRange: [0, -1700],
                            })
                          : translateY,
                    },
                  ],
                  paddingHorizontal: 16,
                  paddingBottom: Platform.OS === "ios" ? 8 : 24,
                  marginBottom: Platform.OS === "ios" ? 8 : 16,
                  alignItems: "flex-end",
                  position: "absolute",
                  bottom:
                    Platform.OS === "ios"
                      ? currentStepData.title ===
                        "Anything else you'd like to share?"
                        ? keyboardVisible
                          ? 20
                          : 20
                        : keyboardVisible
                          ? 50
                          : 50
                      : 24,
                  right: 0,
                }}
              >
                <TouchableOpacity
                  onPress={handleContinue}
                  disabled={isButtonDisabled()}
                >
                  <Circle
                    size={50}
                    backgroundColor={
                      isButtonDisabled() ? "$iosGray" : "#0F9ED5"
                    }
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Icons.ArrowRight size={15} color="white" />
                  </Circle>
                </TouchableOpacity>
              </Animated.View>
            ) : (
              <YStack flex={1}>
                {/* Lock animation and text container */}
                <YStack
                  alignItems="center"
                  position="absolute"
                  width="100%"
                  style={{
                    transform: [{ translateY: -200 }],
                  }}
                >
                  {/* Lock container with separate right offset */}
                  <YStack
                    alignItems="center"
                    width="100%"
                    style={{
                      transform: [
                        { translateX: 35 }, // Adjust this value to move just the lock right
                      ],
                    }}
                  >
                    <LockAnimation isAnimating={isLockAnimating} />
                  </YStack>

                  {/* Subheader text stays centered */}
                  <Text
                    color="$gray11"
                    fontSize="$4"
                    textAlign="center"
                    paddingHorizontal="$4"
                    marginTop="$8"
                    style={{
                      lineHeight: 24,
                    }}
                  >
                    We'll analyze your study preferences and match you with
                    compatible study partners. This process usually takes about
                    2-3 minutes.
                  </Text>
                </YStack>

                {/* Spacer */}
                <YStack flex={1} />

                {/* Progress/button stays at bottom */}
                <YStack paddingHorizontal="$4" paddingBottom="$6">
                  {showProgress ? (
                    <ProgressAnimation
                      onComplete={() => router.replace("/(tabs)/groups")}
                      duration={10000}
                    />
                  ) : (
                    <Button
                      size="large"
                      variant="primary"
                      label="Continue"
                      onPress={async () => {
                        try {
                          // Package the data
                          const packagedData = packageFormData(formData);

                          // Send to database and wait for completion
                          await updateStudyProfile({
                            studyProfile: packagedData,
                          });

                          // Start animations
                          setIsLockAnimating(true);
                          setShowProgress(true);

                          // Optional: Add some error handling UI
                        } catch (error) {
                          console.error(
                            "Failed to update study profile:",
                            error
                          );
                          // Optional: Add some error UI here
                        }
                      }}
                      width="100%"
                      backgroundColor="#0F9ED5"
                    />
                  )}
                </YStack>
              </YStack>
            )}
          </YStack>
        </Stack>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
