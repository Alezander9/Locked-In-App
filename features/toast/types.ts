export type Toast = {
  id: string;
  message: string;
  action?: {
    label: string;
    onPress: () => void;
  };
  duration?: number;
};

export type ToastState = {
  toasts: Toast[];
};

export type ToastAction =
  | { type: "ADD_TOAST"; payload: Toast }
  | { type: "REMOVE_TOAST"; payload: string };

export type ToastContextValue = {
  showToast: (toast: Omit<Toast, "id">) => void;
  hideToast: (id: string) => void;
} | null;
