import { YStack } from "tamagui";

export const ScreenWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <YStack
      flex={1}
      backgroundColor="$bg"
      position="absolute"
      width="100%"
      height="100%"
    >
      {children}
    </YStack>
  );
};
