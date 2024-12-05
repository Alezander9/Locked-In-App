import React from "react";
import { Text, Button, XStack, useTheme } from "tamagui";
import type { Toast as ToastType } from "./types";
import { XIcon } from "@/app/components/icons";

interface ToastProps extends ToastType {
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, action, onClose }) => {
  const theme = useTheme();
  return (
    <XStack
      backgroundColor="$toastBackground"
      borderRadius="$4"
      minHeight={50}
      padding="$2"
      alignItems="center"
      enterStyle={{ opacity: 0, scale: 0.9, y: 20 }}
      exitStyle={{ opacity: 0, scale: 0.9, y: 20 }}
    >
      <Text color="$toastText" flex={1} fontSize="$4">
        {message}
      </Text>
      {action && (
        <Button
          onPress={() => {
            action.onPress();
            onClose();
          }}
          backgroundColor="transparent"
          height="auto"
          alignItems="center"
          justifyContent="center"
          paddingHorizontal={0}
          pressStyle={{ opacity: 0.7 }}
        >
          <Text color="$toastButton" fontSize="$4" padding="$2">
            {action.label}
          </Text>
        </Button>
      )}
      <Button
        onPress={onClose}
        backgroundColor="transparent"
        padding="$2"
        hitSlop={10}
      >
        <XIcon color={theme.toastText.val} size={16} />
      </Button>
    </XStack>
  );
};
