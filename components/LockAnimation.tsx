import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Easing } from 'react-native';
import Icons from '@/app/components/icons';

type LockAnimationProps = {
  isAnimating: boolean;
};

export const LockAnimation = ({ isAnimating }: LockAnimationProps) => {
  const animation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isAnimating) {
      // Main animation for icon switching
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 1,
            duration: 3000,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Continuous pulse
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 0,
            duration: 1500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isAnimating]);

  const scale = pulseAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });

  const unlockOpacity = animation.interpolate({
    inputRange: [0, 0.4, 0.5, 0.9, 1],
    outputRange: [1, 1, 0, 0, 1],
  });

  const lockOpacity = animation.interpolate({
    inputRange: [0, 0.4, 0.5, 0.9, 1],
    outputRange: [0, 0, 1, 1, 0],
  });

  return (
    <Animated.View style={styles.container}>
      {/* Unlock pulse effect */}
      <Animated.View
        style={[
          styles.pulseContainer,
          {
            transform: [{ scale }],
            opacity: Animated.multiply(unlockOpacity, 0.2),
          },
        ]}
      >
        <Icons.Unlock size={220} color="#0F9ED5" />
      </Animated.View>
      <Animated.View
        style={[
          styles.iconContainer,
          {
            opacity: unlockOpacity,
            transform: [{ scale: Animated.multiply(scale, 0.9) }],
          },
        ]}
      >
        <Icons.Unlock size={200} color="#0F9ED5" />
      </Animated.View>

      {/* Lock pulse effect */}
      <Animated.View
        style={[
          styles.pulseContainer,
          {
            transform: [{ scale }],
            opacity: Animated.multiply(lockOpacity, 0.2),
          },
        ]}
      >
        <Icons.Lock size={220} color="#0F9ED5" />
      </Animated.View>
      <Animated.View
        style={[
          styles.iconContainer,
          {
            opacity: lockOpacity,
            transform: [{ scale: Animated.multiply(scale, 0.9) }],
          },
        ]}
      >
        <Icons.Lock size={200} color="#0F9ED5" />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
  },
  pulseContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});