import { Stack, YStack, XStack, Text } from "tamagui";
import { router } from "expo-router";
import { FormSection } from "@/components/forms/FormSection";
import { FormRowTextInput } from "@/components/forms/FormRowTextInput";
import { FormRow } from "@/components/forms/FormRow";
import { FormRowButton } from "@/components/forms/FormRowButton";
import { useTaskFormStore } from "@/stores/taskFormStore";
import { ScreenWrapper } from "@/components/background/ScreenWrapper";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { api } from "@/convex/_generated/api";
import { useAction, useMutation, useQuery } from "convex/react";
import { useToast } from "@/features/toast";
import { useEffect, useState } from "react";
import { FormRowSelector } from "@/components/forms/FormRowSelector";
import * as DocumentPicker from "expo-document-picker";
import { FileProcessingError } from "@/convex/types";
import * as FileSystem from "expo-file-system";
import { Keyboard } from "react-native";

export default function CreateTasksModal() {
  const {
    tasks,
    updateTask,
    isTaskComplete,
    resetForm,
    addTask,
    setExtractedTasks,
    setIsExtracting,
    isExtracting,
    fileUploadCourseId,
    extractionStatus,
    setExtractionStatus,
    setHasApprovedExtraction,
    checkAndAddExtractedTasks,
  } = useTaskFormStore();

  const { showToast } = useToast();
  const courses = useQuery(api.queries.getUserCourses) || [];
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [showValidation, setShowValidation] = useState(false);

  const createTasks = useMutation(api.mutations.createTasks);
  const processFile = useAction(api.actions.processFileAndExtractTasks);

  // Check if we need to add a new task section
  useEffect(() => {
    const lastIndex = tasks.length - 1;
    if (isTaskComplete(lastIndex)) {
      addTask();
    }
  }, [tasks, isTaskComplete, addTask]);

  useEffect(() => {
    checkAndAddExtractedTasks();
  }, [checkAndAddExtractedTasks]);

  const formatDate = (date: Date): string => {
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const handleFieldUpdate = (
    index: number,
    field: keyof (typeof tasks)[0],
    value: any
  ) => {
    updateTask(index, field, value);
  };

  const handleFileUpload = async () => {
    try {
      setExtractionStatus("Reading file...");

      // 1. Pick document
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) {
        setIsExtracting(false);
        setExtractionStatus(null);
        return;
      }

      // 2. Get file details
      const file = result.assets[0];
      setSelectedFile(file.name);
      setExtractionStatus("Reading file contents...");

      // 3. Read file as base64
      const base64Content = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // 4. Process file
      setExtractionStatus("Analyzing file with AI...");
      const extractedTasks = await processFile({
        fileData: base64Content,
        fileName: file.name,
        fileType: file.mimeType || "",
      });

      setExtractedTasks(extractedTasks);
      setExtractionStatus(null);
      setIsExtracting(false);

      checkAndAddExtractedTasks();

      showToast({
        message: `Successfully extracted ${extractedTasks.length} tasks`,
      });
    } catch (error) {
      console.error("Error in file processing:", error);

      if (error instanceof FileProcessingError) {
        switch (error.code) {
          case "INVALID_FILE_TYPE":
            showToast({ message: "Please select a PDF file" });
            break;
          case "FILE_TOO_LARGE":
            showToast({ message: "File is too large (max 10MB)" });
            break;
          case "PROCESSING_FAILED":
            showToast({ message: "Failed to process file. Please try again" });
            break;
          case "EXTRACTION_FAILED":
            showToast({
              message: "Failed to extract tasks. Please try a different file",
            });
            break;
          default:
            showToast({ message: "An unexpected error occurred" });
        }
      } else {
        showToast({ message: "Error selecting or processing file" });
      }
    }
  };

  const handleStartExtraction = () => {
    setHasApprovedExtraction(true);
    setIsExtracting(true);
    checkAndAddExtractedTasks();
  };

  const validateTask = (task: (typeof tasks)[0]) => {
    const errors: { [key: string]: boolean } = {};

    if (!task.courseId) {
      errors.courseId = true;
    }
    if (!task.title?.trim()) {
      errors.title = true;
    }
    if (!task.dueDate) {
      errors.dueDate = true;
    }

    return errors;
  };

  const hasContent = (task: (typeof tasks)[0]) => {
    return task.courseId || task.title || task.notes;
  };

  const handleSave = async () => {
    try {
      Keyboard.dismiss();

      // Get ALL tasks that have any content (including last one)
      const tasksToValidate = tasks.filter(hasContent);

      if (tasksToValidate.length === 0) {
        showToast({
          message: "Please create at least one task",
        });
        return;
      }

      const allValid = tasksToValidate.every(
        (task) => task.courseId && task.title?.trim() && task.dueDate
      );

      if (!allValid) {
        setShowValidation(true);
        showToast({
          message: "Please fill out all required fields",
        });
        return;
      }

      await createTasks({
        tasks: tasksToValidate.map((task) => ({
          ...task,
          dueDate: task.dueDate.getTime(),
        })),
      });

      showToast({
        message: "Tasks created successfully",
      });

      resetForm();
      router.back();
    } catch (error) {
      showToast({
        message: "Failed to create tasks. Please try again.",
      });
      console.error("Failed to create tasks:", error);
    }
  };

  const handleCancel = () => {
    resetForm();
    router.back();
  };

  return (
    <ScreenWrapper>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack f={1} bg="$bg">
          <XStack
            borderBottomColor="$borderColor"
            borderBottomWidth={1}
            justifyContent="space-between"
            alignItems="center"
            marginBottom="$4"
          >
            <Text
              onPress={handleCancel}
              color="$primary"
              fontSize="$4"
              padding="$4"
              width={100}
              textAlign="left"
            >
              Cancel
            </Text>
            <Text fontSize="$4" fontWeight="$4">
              Create Tasks
            </Text>
            <Text
              onPress={handleSave}
              color="$primary"
              fontSize="$4"
              padding="$4"
              width={100}
              textAlign="right"
            >
              Save
            </Text>
          </XStack>

          <ScrollView>
            <YStack>
              <FormSection title="AI Task Extraction">
                <FormRow
                  label="Upload Syllabus/Assignments"
                  value={selectedFile || "No file selected"}
                  onPress={handleFileUpload}
                />
                {selectedFile && (
                  <FormRowSelector
                    label="Course"
                    value={
                      courses.find((c) => c._id === fileUploadCourseId)?.code ||
                      ""
                    }
                    onPress={() => {
                      router.push({
                        pathname: "/input/course-selector",
                        params: {
                          taskIndex: "file",
                        },
                      });
                    }}
                  />
                )}
                {selectedFile && fileUploadCourseId && (
                  <FormRowButton
                    label="Extract tasks with AI"
                    onPress={handleStartExtraction}
                    loading={isExtracting}
                    loadingText={extractionStatus || "Processing..."}
                    disabled={!selectedFile || !fileUploadCourseId}
                  />
                )}
              </FormSection>

              {tasks.map((task, index) => {
                const hasAnyContent = Boolean(
                  task.courseId || task.title?.trim()
                );
                const errors = showValidation ? validateTask(task) : {};

                return (
                  <FormSection key={index} title={`New Task ${index + 1}`}>
                    <FormRowSelector
                      label="Course"
                      value={
                        courses.find((c) => c._id === task.courseId)?.code || ""
                      }
                      onPress={() => {
                        router.push({
                          pathname: "/input/course-selector",
                          params: {
                            taskIndex: index.toString(),
                          },
                        });
                      }}
                      isInvalid={
                        showValidation && hasAnyContent && errors.courseId
                      }
                    />
                    <FormRowTextInput
                      label="Title"
                      value={task.title}
                      onChangeText={(text) =>
                        handleFieldUpdate(index, "title", text)
                      }
                      placeholder="Enter task title..."
                      isInvalid={
                        showValidation && hasAnyContent && errors.title
                      }
                    />
                    <FormRowTextInput
                      label="Notes"
                      value={task.notes}
                      onChangeText={(text) =>
                        handleFieldUpdate(index, "notes", text)
                      }
                      placeholder="Enter notes..."
                      multiline
                      numberOfLines={3}
                    />
                    <FormRow
                      label="Due Date"
                      value={formatDate(task.dueDate)}
                      onPress={() => {
                        router.push({
                          pathname: "/input/date-time",
                          params: {
                            title: "Due Date",
                            taskIndex: index.toString(),
                          },
                        });
                      }}
                    />
                  </FormSection>
                );
              })}
              <YStack height={300} />
            </YStack>
          </ScrollView>
        </Stack>
      </SafeAreaView>
    </ScreenWrapper>
  );
}
