import { create } from "zustand";

interface EventFormState {
  name: string;
  description: string;
  startDate: Date;
  duration: number;
  location: string;
  isPublic: boolean;
  updateField: <
    K extends keyof Omit<EventFormState, "updateField" | "resetForm">,
  >(
    field: K,
    value: EventFormState[K]
  ) => void;
  resetForm: () => void;
}

const initialState = {
  name: "",
  description: "",
  startDate: new Date(),
  duration:
    new Date(1970, 0, 1, 1, 0).getHours() * 60 +
    new Date(1970, 0, 1, 1, 0).getMinutes(),
  location: "",
  isPublic: true,
};

export const useEventFormStore = create<EventFormState>((set) => ({
  ...initialState,
  updateField: (field, value) => set((state) => ({ [field]: value })),
  resetForm: () => set(initialState),
}));

export default useEventFormStore;
