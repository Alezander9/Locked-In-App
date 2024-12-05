import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import { Text, Stack, YStack } from "tamagui";
import { MotiView } from "moti";

type ProgressAnimationProps = {
  onComplete: () => void;
  duration?: number;
};

export const ProgressAnimation = ({
  onComplete,
  duration = 3000,
}: ProgressAnimationProps) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [progressText, setProgressText] = useState(
    "Getting everything ready..."
  );

  const progressTexts = [
    "Getting everything ready...",
    "Setting up your profile...",
    "Finding study partners...",
    "Almost there...",
  ];

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: duration,
          useNativeDriver: false,
        }),
        Animated.timing(progressAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ])
    ).start();

    let currentIndex = 0;
    const textInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % progressTexts.length;
      setProgressText(progressTexts[currentIndex]);
    }, duration / progressTexts.length);

    return () => clearInterval(textInterval);
  }, []);

  return (
    <YStack
      width="100%"
      alignItems="center"
      justifyContent="center"
      padding="$5"
    >
      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "timing", duration: 500 }}
      >
        <Text
          fontSize="$4"
          textAlign="center"
          marginBottom="$4"
          color="$gray11"
        >
          {progressText}
        </Text>
      </MotiView>

      <Stack
        width="100%"
        height="$2"
        backgroundColor="$gray4"
        borderRadius="$4"
        overflow="hidden"
        marginTop="$2.5"
        position="relative"
      >
        <Animated.View
          style={{
            position: "absolute",
            left: 0,
            height: "100%",
            backgroundColor: "$primary",
            borderRadius: 8,
            width: progressAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "100%"],
            }),
          }}
        />
      </Stack>
    </YStack>
  );
};
