import { YStack, Text, XStack } from "tamagui";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/CustomButton";
import { useRouter, useNavigation } from "expo-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { View, TouchableOpacity, Modal, TextInput, Pressable } from "react-native";
import { Slider } from "@miblanchard/react-native-slider";
import { DropdownInput } from "@/components/DropdownInput";
import { Ionicons } from '@expo/vector-icons';

// Update type to match exact database structure
type ClassPreference = {
  deadlinePreference: number;
  expectedGrade: string;
  name: string;
  noiseLevel: number;
  targetGrade: string;
  weeklyHours: number;
};

// Update StudyProfile type to match exactly what's in the database
type StudyProfile = {
  dorm: string;
  studyLocations: string[];
  alertnessPreference: number;
  punctualityPreference: number;
  learningPreferences: Record<string, number>;
  availableTimeSlots: {
    day: string;
    slots: number[];
  }[];
  classes: ClassPreference[];
  additionalInfo: string;
  shareLocation: boolean;
  syncContacts: boolean;
};

// Constants from profile builder
const GRADES = [
  { label: 'A+', value: 'A+' },
  { label: 'A', value: 'A' },
  { label: 'A-', value: 'A-' },
  { label: 'B+', value: 'B+' },
  { label: 'B', value: 'B' },
  { label: 'B-', value: 'B-' },
  { label: 'C+', value: 'C+' },
  { label: 'C', value: 'C' },
  { label: 'C-', value: 'C-' },
];

// First, add these default values at the top of your file
const DEFAULT_CLASS_VALUES: Omit<ClassPreference, 'name'> = {
  weeklyHours: 5,
  deadlinePreference: 7,
  noiseLevel: 2,
  targetGrade: "B",
  expectedGrade: "B",
};

// Custom slider component for class preferences
function CustomClassPreferenceSlider({
  label,
  value,
  minimumValue,
  maximumValue,
  step,
  onValueChange,
  sliderType,
}: {
  label: string;
  value: number;
  minimumValue: number;
  maximumValue: number;
  step: number;
  onValueChange: (value: number) => void;
  sliderType: "weeklyHours" | "deadlinePreference" | "noiseLevel";
}) {
  const getLabel = (type: string, value: number) => {
    if (type === "noiseLevel") {
      switch(value) {
        case 0: return "Silent";
        case 1: return "Whispers";
        case 2: return "Quiet Talking";
        case 3: return "Discussion";
        case 4: return "Active Discussion";
        case 5: return "Loud Banter";
        default: return "";
      }
    } else if (type === "weeklyHours") {
      return `${value} hours`;
    } else {
      return `${value} days`;
    }
  };

  return (
    <YStack space="$2">
      <Text fontSize="$3" fontWeight="600" color="$gray11">
        {label}
      </Text>
      <YStack width="100%">
        <View style={{ width: '100%', height: 40 }}>
          <Slider
            value={value}
            onValueChange={([value]) => onValueChange(value as number)}
            minimumValue={minimumValue}
            maximumValue={maximumValue}
            step={step}
            thumbTintColor="#0F9ED5"
            minimumTrackTintColor="#0F9ED5"
            maximumTrackTintColor="#E5E5E5"
          />
        </View>
        <Text 
          fontSize="$3" 
          color="$gray10" 
          style={{ 
            width: 120,
            alignSelf: 'flex-end',
            textAlign: 'right',
            paddingRight: 16,
          }}
        >
          {getLabel(sliderType, value)}
        </Text>
      </YStack>
    </YStack>
  );
}

export default function ClassPreferencesScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const updateStudyProfile = useMutation(api.mutations.updateStudyProfile);
  const deleteClassMutation = useMutation(api.mutations.deleteClass);
  const currentProfile = useQuery(api.queries.getStudyProfile, { userId: undefined });
  
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showClassSelector, setShowClassSelector] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [currentClassName, setCurrentClassName] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<Omit<ClassPreference, 'name'>>({
    weeklyHours: 5,
    deadlinePreference: 7,
    noiseLevel: 2,
    targetGrade: "",
    expectedGrade: "",
  });
  const [classToDelete, setClassToDelete] = useState<string | null>(null);

  // Add this to handle the header button press
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity 
          onPress={() => setShowClassSelector(true)}
          style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}
        >
          <Text style={{ marginRight: 8, color: '#0F9ED5' }}>
            {currentClassName || 'Select Class'}
          </Text>
          <Ionicons
            name="chevron-down"
            size={24}
            color="#0F9ED5"
          />
        </TouchableOpacity>
      ),
    });
  }, [currentClassName]);

  // Add this effect to initialize data when profile loads
  useEffect(() => {
    // Add type guard to ensure classes exists and has items
    if (currentProfile && 
        'classes' in currentProfile && 
        Array.isArray(currentProfile.classes) && 
        currentProfile.classes.length > 0 && 
        !currentClassName) {
      const firstClass = currentProfile.classes[0];
      setCurrentClassName(firstClass.name);
      setPreferences({
        weeklyHours: firstClass.weeklyHours,
        deadlinePreference: firstClass.deadlinePreference,
        noiseLevel: firstClass.noiseLevel,
        targetGrade: firstClass.targetGrade,
        expectedGrade: firstClass.expectedGrade,
      });
    }
  }, [currentProfile, currentClassName]);

  // Add detailed console logs to see the data structure
  useEffect(() => {
    console.log("Study Profile Data:", {
      hasProfile: currentProfile !== null && currentProfile !== undefined,
      classes: currentProfile?.classes,
      classExample: currentProfile?.classes?.[0],
      currentClassName,
      preferences
    });
  }, [currentProfile, currentClassName, preferences]);

  // Move ClassNameInputModal component definition here
  const ClassNameInputModal = () => (
    <Modal
      visible={showNameInput}
      transparent={true}
      onRequestClose={() => {}}  // Prevent default close behavior
      animationType="fade"
    >
      <View 
        style={{ 
          flex: 1, 
          justifyContent: "center", 
          alignItems: "center", 
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View 
          style={{ 
            backgroundColor: "white", 
            padding: 16, 
            borderRadius: 8, 
            width: "80%",
            maxWidth: 400,
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}
        >
          <Text fontSize="$4" fontWeight="600" marginBottom="$2">
            Add New Class
          </Text>
          <TextInput
            value={newClassName}
            onChangeText={setNewClassName}
            placeholder="Enter class name"
            style={{
              borderWidth: 1,
              borderColor: '#E5E5E5',
              borderRadius: 4,
              padding: 8,
              marginBottom: 16
            }}
            autoFocus={true}  // Add this
          />
          <XStack space="$4" justifyContent="flex-end">
            <TouchableOpacity 
              onPress={() => {
                setNewClassName('');  // Clear input
                setShowNameInput(false);
              }}
            >
              <Text color="$gray11" paddingHorizontal="$2" paddingVertical="$1">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleAddClass}
              disabled={!newClassName.trim()}
            >
              <Text 
                color={newClassName.trim() ? "#0F9ED5" : "$gray11"}
                fontWeight="600"
                paddingHorizontal="$2"
                paddingVertical="$1"
              >
                Add
              </Text>
            </TouchableOpacity>
          </XStack>
        </View>
      </View>
    </Modal>
  );

  // Move handleAddClass here, before we use it
  const handleAddClass = async () => {
    try {
      if (!newClassName.trim()) return;
      
      const newClass: ClassPreference = {
        name: newClassName.trim(),
        ...DEFAULT_CLASS_VALUES
      };

      // Create a complete profile with all required fields
      const updatedProfile = {
        ...currentProfile,
        // Provide defaults for required fields if they don't exist
        dorm: currentProfile?.dorm || "",
        studyLocations: currentProfile?.studyLocations || [],
        alertnessPreference: currentProfile?.alertnessPreference || 0,
        punctualityPreference: currentProfile?.punctualityPreference || 0,
        learningPreferences: currentProfile?.learningPreferences || {},
        availableTimeSlots: currentProfile?.availableTimeSlots || [],
        additionalInfo: currentProfile?.additionalInfo || "",
        shareLocation: currentProfile?.shareLocation || false,
        syncContacts: currentProfile?.syncContacts || false,
        classes: [...(currentProfile?.classes || []), newClass]
      };

      await updateStudyProfile({
        studyProfile: updatedProfile
      });

      setShowNameInput(false);
      setNewClassName('');
      setCurrentClassName(newClassName.trim());
      setPreferences(DEFAULT_CLASS_VALUES);
      
      console.log('New class added successfully');
    } catch (error) {
      console.error('Failed to add class:', error);
      alert('Failed to add class: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  // Loading state
  if (currentProfile === undefined) {
    return (
      <ScreenWrapper>
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Text>Loading...</Text>
        </YStack>
      </ScreenWrapper>
    );
  }

  // Empty state with null check
  if (currentProfile === null || !currentProfile.classes || currentProfile.classes.length === 0) {
    return (
      <ScreenWrapper>
        <Modal
          visible={showNameInput}
          transparent={true}
          onRequestClose={() => setShowNameInput(false)}
        >
          <Pressable 
            style={{ 
              flex: 1, 
              backgroundColor: 'rgba(0, 0, 0, 0.5)', 
              justifyContent: 'center', 
              alignItems: 'center' 
            }}
            onPress={() => setShowNameInput(false)}
          >
            <Pressable 
              style={{
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 8,
                width: '90%',
                maxWidth: 400,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5
              }}
              onPress={(e) => e.stopPropagation()}
            >
              <Text fontSize="$4" fontWeight="600" marginBottom="$2">
                Add New Class
              </Text>
              <TextInput
                value={newClassName}
                onChangeText={setNewClassName}
                placeholder="Enter class name"
                style={{
                  borderWidth: 1,
                  borderColor: '#E5E5E5',
                  borderRadius: 4,
                  padding: 8,
                  marginBottom: 16
                }}
              />
              <XStack space="$4" justifyContent="flex-end">
                <TouchableOpacity onPress={() => setShowNameInput(false)}>
                  <Text color="$gray11" paddingHorizontal="$2" paddingVertical="$1">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleAddClass}
                  disabled={!newClassName.trim()}
                >
                  <Text 
                    color={newClassName.trim() ? "#0F9ED5" : "$gray11"}
                    fontWeight="600"
                    paddingHorizontal="$2"
                    paddingVertical="$1"
                  >
                    Add
                  </Text>
                </TouchableOpacity>
              </XStack>
            </Pressable>
          </Pressable>
        </Modal>

        <YStack 
          flex={1} 
          justifyContent="center" 
          alignItems="center" 
          padding="$4" 
          space="$4"
        >
          <Text 
            fontSize="$5" 
            fontWeight="bold" 
            textAlign="center"
          >
            Please add classes first to make preferences
          </Text>
          
          <Text 
            color="$gray11" 
            textAlign="center" 
            marginBottom="$4"
          >
            Add your classes to customize study preferences for each one
          </Text>

          <Button
            size="large"
            variant="primary"
            label="Add Your First Class"
            onPress={() => setShowNameInput(true)}
            width="100%"
            maxWidth={400}
            backgroundColor="#0F9ED5"
          />
        </YStack>
      </ScreenWrapper>
    );
  }

  // Handle case where profile doesn't exist
  if (currentProfile === null) {
    return (
      <ScreenWrapper>
        <YStack flex={1} justifyContent="center" alignItems="center" padding="$4" space="$4">
          <Text fontSize="$5" fontWeight="bold" textAlign="center">
            Complete Your Study Profile
          </Text>
          <Text color="$gray11" textAlign="center">
            Fill out your study preferences to get started
          </Text>
          <Button
            size="large"
            variant="primary"
            label="Create Profile"
            onPress={() => router.push("/(auth)/profile")}
            width="100%"
            backgroundColor="#0F9ED5"
          />
        </YStack>
      </ScreenWrapper>
    );
  }

  // Function declarations
  const handleAddButtonPress = () => {
    setShowClassSelector(false);
    // Clear any existing input
    setNewClassName('');
    // Show the input modal
    setShowNameInput(true);
  };

  const handleCloseNameInput = () => {
    setShowNameInput(false);
    setNewClassName('');
  };

  // Modal Components
  const ClassSelectorModal = () => (
    <Modal
      visible={showClassSelector}
      transparent={true}
      onRequestClose={() => setShowClassSelector(false)}
    >
      <Pressable 
        style={{ 
          flex: 1, 
          justifyContent: "center", 
          alignItems: "center", 
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 200,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        onPress={() => setShowClassSelector(false)}
      >
        <Pressable 
          style={{ 
            backgroundColor: "white", 
            padding: 16, 
            borderRadius: 8, 
            width: "80%",
            zIndex: 201
          }}
          onPress={(e) => e.stopPropagation()}
        >
          {currentProfile?.classes.map((classData) => (
            <TouchableOpacity
              key={classData.name}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#E5E5E5',
              }}
              onPress={() => {
                setCurrentClassName(classData.name);
                setPreferences({
                  weeklyHours: classData.weeklyHours,
                  deadlinePreference: classData.deadlinePreference,
                  noiseLevel: classData.noiseLevel,
                  targetGrade: classData.targetGrade,
                  expectedGrade: classData.expectedGrade,
                });
                setShowClassSelector(false);
              }}
            >
              <Text fontSize="$4">{classData.name}</Text>
              <TouchableOpacity
                onPress={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowClassSelector(false);
                  requestAnimationFrame(() => {
                    setClassToDelete(classData.name);
                  });
                }}
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 4
                }}
              >
                <Text fontSize="$3" color="$red10">Delete</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity
            onPress={handleAddButtonPress}
            style={{
              paddingVertical: 12,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 8
            }}
          >
            <Ionicons name="add-circle-outline" size={24} color="#0F9ED5" />
            <Text 
              fontSize="$4" 
              color="#0F9ED5"
              marginLeft="$2"
            >
              Add New Class
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );

  const DeleteConfirmationModal = () => (
    <Modal 
      visible={classToDelete !== null} 
      transparent
      animationType="fade"
    >
      <Pressable 
        style={{ 
          flex: 1, 
          justifyContent: "center", 
          alignItems: "center", 
          backgroundColor: "rgba(0,0,0,0.5)",
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        onPress={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Pressable 
          style={{ 
            backgroundColor: "white", 
            padding: 16, 
            borderRadius: 8, 
            width: "80%",
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}
          onPress={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Text fontSize="$4" fontWeight="600" marginBottom="$2">
            Delete Class
          </Text>
          <Text fontSize="$3" color="$gray11" marginBottom="$4">
            Are you sure you want to delete {classToDelete}? This action cannot be undone.
          </Text>
          <XStack space="$4" justifyContent="flex-end">
            <TouchableOpacity 
              onPress={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setClassToDelete(null);
              }}
            >
              <Text color="$gray11" paddingHorizontal="$2" paddingVertical="$1">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (classToDelete) {
                  await handleDeleteClass(classToDelete);
                  setClassToDelete(null);
                }
              }}
            >
              <Text 
                color="$red10" 
                fontWeight="600"
                paddingHorizontal="$2"
                paddingVertical="$1"
              >
                Delete
              </Text>
            </TouchableOpacity>
          </XStack>
        </Pressable>
      </Pressable>
    </Modal>
  );

  // Handle save with proper type checking
  const handleSave = async () => {
    try {
      if (!currentClassName) return;

      const updatedClasses = currentProfile.classes.map(classData => 
        classData.name === currentClassName 
          ? { ...classData, ...preferences } 
          : classData
      );

      const updatedProfile = {
        ...currentProfile,
        classes: updatedClasses,
      };

      await updateStudyProfile({
        studyProfile: updatedProfile
      });

      router.back();
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }
  };

  // Update the delete button's onPress handler
  const handleDeleteClass = async (className: string) => {
    try {
      console.log('Attempting to delete class:', className);
      
      const updatedClasses = currentProfile.classes.filter(c => c.name !== className);
      const updatedProfile = {
        ...currentProfile,
        classes: updatedClasses
      };

      await updateStudyProfile({
        studyProfile: updatedProfile
      });
      
      if (currentClassName === className) {
        setCurrentClassName(null);
        setPreferences({
          weeklyHours: 5,
          deadlinePreference: 7,
          noiseLevel: 2,
          targetGrade: "",
          expectedGrade: "",
        });
      }
      
      console.log('Class deleted successfully');
    } catch (error) {
      console.error('Failed to delete class:', error);
      alert('Failed to delete class: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  // Add console logs to track state changes
  const handleDeleteButtonPress = (className: string, e: any) => {
    console.log('Delete button pressed for:', className);
    e.stopPropagation(); // Make sure we stop event bubbling
    setClassToDelete(className);
    console.log('classToDelete set to:', className);
  };

  return (
    <ScreenWrapper>
      <DeleteConfirmationModal />
      <ClassSelectorModal />
      <ClassNameInputModal />
      <YStack flex={1} padding="$4" space="$4">
        {/* Class Study Habits Section */}
        <YStack backgroundColor="$background" borderRadius="$4" padding="$4">
          <YStack space="$4">
            <Text fontSize="$4" fontWeight="bold">
              Class Preferences
            </Text>
            
            <CustomClassPreferenceSlider
              label="How many hours per week do you plan to work on this class?"
              value={preferences.weeklyHours}
              minimumValue={1}
              maximumValue={20}
              step={1}
              sliderType="weeklyHours"
              onValueChange={(value) => setPreferences(prev => ({
                ...prev,
                weeklyHours: value
              }))}
            />

            <CustomClassPreferenceSlider
              label="In general, how many days before a deadline do you start your assignments?"
              value={preferences.deadlinePreference}
              minimumValue={0}
              maximumValue={14}
              step={1}
              sliderType="deadlinePreference"
              onValueChange={(value) => setPreferences(prev => ({
                ...prev,
                deadlinePreference: value
              }))}
            />

            <CustomClassPreferenceSlider
              label="What is your preferred noise level when studying for this class?"
              value={preferences.noiseLevel}
              minimumValue={0}
              maximumValue={5}
              step={1}
              sliderType="noiseLevel"
              onValueChange={(value) => setPreferences(prev => ({
                ...prev,
                noiseLevel: value
              }))}
            />

            <View style={{ zIndex: activeDropdown === 'targetGrade' ? 4000 : 3000 }}>
              <DropdownInput
                label="What grade do you want to achieve in this class?"
                value={preferences.targetGrade}
                onValueChange={(value) => setPreferences(prev => ({
                  ...prev,
                  targetGrade: value
                }))}
                items={GRADES}
                onOpen={() => setActiveDropdown('targetGrade')}
              />
            </View>

            <View style={{ zIndex: activeDropdown === 'expectedGrade' ? 4000 : 3000 }}>
              <DropdownInput
                label="What grade do you currently expect to receive in this class?"
                value={preferences.expectedGrade}
                onValueChange={(value) => setPreferences(prev => ({
                  ...prev,
                  expectedGrade: value
                }))}
                items={GRADES}
                onOpen={() => setActiveDropdown('expectedGrade')}
              />
            </View>
          </YStack>
        </YStack>

        {/* Save Button */}
        <YStack marginTop="$7">
          <Button
            size="large"
            variant="primary"
            label="Save Changes"
            onPress={handleSave}
            width="100%"
            backgroundColor="#0F9ED5"
          />
        </YStack>
      </YStack>
    </ScreenWrapper>
  );
}