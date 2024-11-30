import { create } from "zustand";
import { Id } from "@/convex/_generated/dataModel";

interface ColorPickerState {
  courseId: Id<"courses"> | null;
  newColor: string | null;
  setColorChoice: (courseId: Id<"courses">, color: string) => void;
  resetColorChoice: () => void;
}

export const useColorPickerStore = create<ColorPickerState>((set) => ({
  courseId: null,
  newColor: null,
  setColorChoice: (courseId, color) => set({ courseId, newColor: color }),
  resetColorChoice: () => set({ courseId: null, newColor: null }),
}));
