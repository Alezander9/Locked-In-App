import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Easing, View } from "react-native";
import Icons from "@/app/components/icons";
import { useTheme } from "tamagui";

type LockAnimationProps = {
  isAnimating: boolean;
};

const HORIZONTAL_OFFSET = 80;
const UNLOCK_POSITION = {
  left: 0,
  top: 0,
};
const LOCK_POSITION = {
  left: 12,
  top: 30,
};

export const LockAnimation = ({ isAnimating }: LockAnimationProps) => {
  const animation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const theme = useTheme();

  useEffect(() => {
    if (isAnimating) {
      // Main animation for icon switching
      Animated.loop(
        Animated.timing(animation, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.2,
            duration: 1000,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 1000,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isAnimating]);

  const unlockOpacity = animation.interpolate({
    inputRange: [0, 0.35, 0.6, 0.8, 1],
    outputRange: [0, 0, 1, 1, 0],
  });

  const lockOpacity = animation.interpolate({
    inputRange: [0, 0.35, 0.6, 0.8, 1],
    outputRange: [1, 1, 0, 0, 1],
  });

  return (
    <Animated.View
      style={[styles.outerContainer, { marginLeft: HORIZONTAL_OFFSET }]}
    >
      <View style={styles.iconBox}>
        {/* Unlock icon */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              opacity: unlockOpacity,
              transform: [{ scale: pulseAnimation }],
              left: UNLOCK_POSITION.left,
              top: UNLOCK_POSITION.top,
            },
          ]}
        >
          <Icons.Unlock size={200} color={theme.primary.val} />
        </Animated.View>

        {/* Lock icon */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              opacity: lockOpacity,
              transform: [{ scale: pulseAnimation }],
              left: LOCK_POSITION.left,
              top: LOCK_POSITION.top,
            },
          ]}
        >
          <Icons.Lock size={200} color={theme.primary.val} />
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconBox: {
    width: 200,
    height: 200,
    position: "relative",
  },
  iconContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
});
