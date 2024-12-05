import React from "react";
import { YStack, Text } from "tamagui";
import { StepComponentProps, StepConfig } from "@/convex/types";
import { useProfileStore } from "@/stores/useProfileStore";
interface ProfileStepProps {
  config: StepConfig;
  children?: React.ReactNode;
}

export const ProfileStep: React.FC<ProfileStepProps> = ({
  config,
  children,
}) => {
  const { getCurrentStepErrors } = useProfileStore();
  const errors = getCurrentStepErrors();

  return (
    <YStack space="$2" paddingHorizontal="$4">
      <Text fontSize="$5" fontWeight="800" marginBottom="$4">
        {config.title}
      </Text>

      {config.helperText && (
        <Text color="$gray" fontSize="$3" marginBottom="$2">
          {config.helperText}
        </Text>
      )}

      {children}

      {errors.map((error, index) => (
        <Text key={index} color="$danger" fontSize="$3" marginTop="$2">
          {error.message}
        </Text>
      ))}
    </YStack>
  );
};

// HOC to wrap step components with common functionality
export const withProfileStep = (
  WrappedComponent: React.ComponentType<StepComponentProps>
) => {
  return (props: StepComponentProps) => (
    <ProfileStep config={props.config}>
      <WrappedComponent {...props} />
    </ProfileStep>
  );
};

export default ProfileStep;
