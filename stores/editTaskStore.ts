import { Id } from "@/convex/_generated/dataModel";
import { create } from "zustand";

interface EditTaskForm {
  courseId: Id<"courses">;
  title: string;
  notes: string;
  dueDate: Date;
}

interface DeletedTask extends EditTaskForm {
  _id: Id<"tasks">;
  isCompleted: boolean;
}

interface EditTaskState {
  task: EditTaskForm | null;
  deletedTask: DeletedTask | null;
  updateField: (
    field: keyof EditTaskForm,
    value: EditTaskForm[keyof EditTaskForm]
  ) => void;
  setTask: (task: EditTaskForm) => void;
  setDeletedTask: (task: DeletedTask) => void;
  clearDeletedTask: () => void;
  resetForm: () => void;
  isTaskValid: () => boolean;
}

const initialState = {
  task: null,
  deletedTask: null,
};

export const useEditTaskStore = create<EditTaskState>((set, get) => ({
  ...initialState,

  updateField: (
    field: keyof EditTaskForm,
    value: EditTaskForm[keyof EditTaskForm]
  ): void => {
    set((state) => ({
      task: state.task ? { ...state.task, [field]: value } : null,
    }));
  },

  setTask: (task: EditTaskForm): void => {
    set({ task });
  },

  setDeletedTask: (task: DeletedTask): void => {
    set({ deletedTask: task });
  },

  clearDeletedTask: (): void => {
    set({ deletedTask: null });
  },

  resetForm: (): void => {
    set(initialState);
  },

  isTaskValid: (): boolean => {
    const task = get().task;
    if (!task) return false;
    return !!(task.courseId && task.title && task.dueDate);
  },
}));

export default useEditTaskStore;
