import { Id } from "@/convex/_generated/dataModel";
import { create } from "zustand";

interface TaskForm {
  courseId: Id<"courses">;
  title: string;
  notes: string;
  dueDate: Date;
}

interface ExtractedTask {
  title: string;
  notes: string;
  dueDate: string;
}

interface TaskFormState {
  tasks: TaskForm[];
  extractedTasks: ExtractedTask[] | null;
  isExtracting: boolean;
  fileUploadCourseId: Id<"courses"> | null;
  extractionStatus: string | null;
  hasApprovedExtraction: boolean;
  updateTask: (
    index: number | "file",
    field: keyof TaskForm,
    value: TaskForm[keyof TaskForm]
  ) => void;
  addTask: () => void;
  removeTask: (index: number) => void;
  resetForm: () => void;
  isTaskComplete: (index: number) => boolean;
  setExtractedTasks: (tasks: ExtractedTask[] | null) => void;
  setIsExtracting: (isExtracting: boolean) => void;
  setFileUploadCourseId: (courseId: Id<"courses"> | null) => void;
  addExtractedTasks: () => void;
  setExtractionStatus: (status: string | null) => void;
  setHasApprovedExtraction: (approved: boolean) => void;
  checkAndAddExtractedTasks: () => void;
}

const initialTask: TaskForm = {
  courseId: "" as Id<"courses">,
  title: "",
  notes: "",
  dueDate: new Date(new Date().setHours(23, 59, 0, 0)),
};

const initialState = {
  tasks: [{ ...initialTask }],
  extractedTasks: null,
  isExtracting: false,
  fileUploadCourseId: null,
  extractionStatus: null,
  hasApprovedExtraction: false,
};

const parseDateString = (dateStr: string): Date => {
  try {
    // Split into components
    const parts = dateStr.split(" ").filter((s) => s.length > 0);
    if (parts.length < 3) throw new Error("Invalid date format");

    const timeStr = parts[0]; // "11:59"
    const ampm = parts[1]; // "PM"
    const dateStr2 = parts[2]; // "09/27/24"

    // Parse time
    const [hoursStr, minutesStr] = timeStr.split(":");
    let hours = parseInt(hoursStr);
    const minutes = parseInt(minutesStr);

    // Convert to 24-hour format if needed
    if (ampm.toUpperCase() === "PM" && hours < 12) hours += 12;
    if (ampm.toUpperCase() === "AM" && hours === 12) hours = 0;

    // Parse date
    const [month, day, yearStr] = dateStr2.split("/");
    const year = 2000 + parseInt(yearStr);

    const date = new Date(
      year,
      parseInt(month) - 1,
      parseInt(day),
      hours,
      minutes
    );

    // Check if date is valid
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }

    return date;
  } catch (error) {
    console.warn("Failed to parse date:", dateStr, error);
    const fallbackDate = new Date();
    fallbackDate.setHours(23, 59, 0, 0);
    return fallbackDate;
  }
};

export const useTaskFormStore = create<TaskFormState>((set, get) => ({
  ...initialState,

  updateTask: (
    index: number | "file",
    field: keyof TaskForm,
    value: TaskForm[keyof TaskForm]
  ): void => {
    if (index === "file" && field === "courseId") {
      set({ fileUploadCourseId: value as Id<"courses"> });
      return;
    }

    set((state) => ({
      tasks: state.tasks.map((task, i) =>
        i === index ? { ...task, [field]: value } : task
      ),
    }));
  },

  addTask: (): void =>
    set((state) => ({
      tasks: [...state.tasks, { ...initialTask }],
    })),

  removeTask: (index: number): void =>
    set((state) => ({
      tasks: state.tasks.filter((_, i) => i !== index),
    })),

  resetForm: (): void =>
    set({
      ...initialState,
      extractionStatus: null,
      hasApprovedExtraction: false,
    }),

  isTaskComplete: (index: number): boolean => {
    const task = get().tasks[index];
    return !!(task?.courseId && task?.title && task?.dueDate);
  },

  setExtractedTasks: (tasks: ExtractedTask[] | null): void =>
    set({ extractedTasks: tasks }),

  setIsExtracting: (isExtracting: boolean): void => set({ isExtracting }),

  setFileUploadCourseId: (courseId: Id<"courses"> | null): void =>
    set({ fileUploadCourseId: courseId }),

  addExtractedTasks: (): void => {
    const {
      extractedTasks,
      fileUploadCourseId,
      tasks,
      isTaskComplete,
      hasApprovedExtraction,
    } = get();

    if (!extractedTasks || !hasApprovedExtraction || !fileUploadCourseId) {
      return;
    }

    // Convert extracted tasks to form format with date parsing
    const newTasks = extractedTasks.map(
      (task): TaskForm => ({
        courseId: fileUploadCourseId,
        title: task.title,
        notes: task.notes,
        dueDate: parseDateString(task.dueDate),
      })
    );

    // Find the last completed task index
    let lastCompletedIndex = -1;
    for (let i = 0; i < tasks.length; i++) {
      if (isTaskComplete(i)) {
        lastCompletedIndex = i;
      } else {
        break;
      }
    }

    // Combine existing completed tasks with new tasks
    const updatedTasks = [
      ...tasks.slice(0, lastCompletedIndex + 1),
      ...newTasks,
    ];

    // Add empty task at the end if needed
    if (updatedTasks.length === 0 || isTaskComplete(updatedTasks.length - 1)) {
      updatedTasks.push({ ...initialTask });
    }

    set({
      tasks: updatedTasks,
      extractedTasks: null,
      fileUploadCourseId: null,
      isExtracting: false,
      extractionStatus: null,
      hasApprovedExtraction: false,
    });
  },

  setExtractionStatus: (status: string | null): void =>
    set({ extractionStatus: status }),

  setHasApprovedExtraction: (approved: boolean): void =>
    set({ hasApprovedExtraction: approved }),

  checkAndAddExtractedTasks: (): void => {
    const {
      extractedTasks,
      fileUploadCourseId,
      tasks,
      isTaskComplete,
      hasApprovedExtraction,
    } = get();

    if (!extractedTasks || !hasApprovedExtraction || !fileUploadCourseId) {
      return;
    }

    // Convert extracted tasks to form format with date parsing
    const newTasks = extractedTasks.map(
      (task): TaskForm => ({
        courseId: fileUploadCourseId,
        title: task.title,
        notes: task.notes,
        dueDate: parseDateString(task.dueDate),
      })
    );

    // Find the last completed task index
    let lastCompletedIndex = -1;
    for (let i = 0; i < tasks.length; i++) {
      if (isTaskComplete(i)) {
        lastCompletedIndex = i;
      } else {
        break;
      }
    }

    // Combine existing completed tasks with new tasks
    const updatedTasks = [
      ...tasks.slice(0, lastCompletedIndex + 1),
      ...newTasks,
    ];

    // Add empty task at the end if needed
    if (updatedTasks.length === 0 || isTaskComplete(updatedTasks.length - 1)) {
      updatedTasks.push({ ...initialTask });
    }

    set({
      tasks: updatedTasks,
      extractedTasks: null,
      fileUploadCourseId: null,
      isExtracting: false,
      extractionStatus: null,
      hasApprovedExtraction: false,
    });
  },
}));

export default useTaskFormStore;
