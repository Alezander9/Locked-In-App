import React, { createContext, useReducer, useCallback } from "react";
import { YStack } from "tamagui";
import { Toast } from "./Toast";
import type {
  Toast as ToastType,
  ToastState,
  ToastAction,
  ToastContextValue,
} from "./types";

export const ToastContext = createContext<ToastContextValue>(null);

const toastReducer = (state: ToastState, action: ToastAction): ToastState => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        toasts: [...state.toasts, action.payload],
      };
    case "REMOVE_TOAST":
      return {
        toasts: state.toasts.filter((toast) => toast.id !== action.payload),
      };
    default:
      return state;
  }
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(toastReducer, { toasts: [] });

  const showToast = useCallback((toast: Omit<ToastType, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    dispatch({ type: "ADD_TOAST", payload: { ...toast, id } });

    // Auto-hide after duration
    setTimeout(() => {
      dispatch({ type: "REMOVE_TOAST", payload: id });
    }, toast.duration || 3000);
  }, []);

  const hideToast = useCallback((id: string) => {
    dispatch({ type: "REMOVE_TOAST", payload: id });
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <YStack
        position="absolute"
        bottom={20}
        left={0}
        right={0}
        space="$2"
        padding="$4"
      >
        {state.toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => hideToast(toast.id)}
          />
        ))}
      </YStack>
    </ToastContext.Provider>
  );
};
