import { create } from "zustand";

interface TaskForm {
  courseId: string;
  title: string;
  notes: string;
  dueDate: Date;
}

interface TaskFormState {
  tasks: TaskForm[];
  updateTask: (
    index: number,
    field: keyof TaskForm,
    value: TaskForm[keyof TaskForm]
  ) => void;
  addTask: () => void;
  removeTask: (index: number) => void;
  resetForm: () => void;
  isTaskComplete: (index: number) => boolean;
}

const initialTask: TaskForm = {
  courseId: "",
  title: "",
  notes: "",
  dueDate: new Date(),
};

const initialState = {
  tasks: [{ ...initialTask }], // Start with one empty task
};

export const useTaskFormStore = create<TaskFormState>((set, get) => ({
  ...initialState,

  updateTask: (
    index: number,
    field: keyof TaskForm,
    value: TaskForm[keyof TaskForm]
  ): void =>
    set((state) => ({
      tasks: state.tasks.map((task, i) =>
        i === index ? { ...task, [field]: value } : task
      ),
    })),

  addTask: (): void =>
    set((state) => ({
      tasks: [...state.tasks, { ...initialTask }],
    })),

  removeTask: (index: number): void =>
    set((state) => ({
      tasks: state.tasks.filter((_, i) => i !== index),
    })),

  resetForm: (): void => set(initialState),

  isTaskComplete: (index: number): boolean => {
    const task = get().tasks[index];
    return !!(task?.courseId && task?.title && task?.dueDate);
  },
}));

export default useTaskFormStore;
