import { View } from "tamagui";
import { useCallback } from "react";
import { Image, Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  runOnJS,
  useSharedValue,
  Easing,
} from "react-native-reanimated";

const AnimatedImage = Animated.createAnimatedComponent(Image);
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Animation Configuration
const ANIMATION_CONFIG = {
  // Timing
  HOLD_DURATION: 1000, // How long to hold before fade out (ms)
  FADE_DURATION: 400, // How long the fade out takes (ms)

  // Logo Animation
  LOGO: {
    SIZE: 200, // Base size of the logo
    SLIDE: {
      DISTANCE: 120, // Final position to the right
      DURATION: 800, // Duration of initial slide
      EASING: Easing.bezier(0.25, 0.1, 0.25, 1), // Smooth slide easing
    },
    LOCK: {
      OVERSHOOT: 15, // How much it overshoots before locking
      DAMPING: 12, // Higher = less bouncy
      STIFFNESS: 180, // Spring stiffness
      MASS: 1, // Weight of the movement
      VELOCITY: 8, // Initial velocity for spring
    },
  },

  // Text Animation
  TEXT: {
    SIZE_MULTIPLIER: {
      WIDTH: 1.5,
      HEIGHT: 0.5,
    },
    START_POSITION: -200,
    SPRING: {
      damping: 15,
      stiffness: 100,
      mass: 1,
    },
    FADE_IN_DURATION: 600,
  },
};

interface SplashScreenProps {
  onAnimationComplete?: () => void;
  imageSize?: number;
}

export const AnimatedSplash = ({
  onAnimationComplete,
  imageSize = ANIMATION_CONFIG.LOGO.SIZE,
}: SplashScreenProps) => {
  // Animation value declarations
  const logoOpacity = useSharedValue(1);
  const logoScale = useSharedValue(1);
  const logoTranslateX = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(ANIMATION_CONFIG.TEXT.START_POSITION);

  // Logo animation styles
  const logoAnimatedStyles = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      { scale: logoScale.value },
      { translateX: logoTranslateX.value },
    ],
  }));

  // Text animation styles
  const textAnimatedStyles = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const startAnimation = useCallback(() => {
    // Phase 1: Smooth slide to right with overshoot and lock
    logoTranslateX.value = withSequence(
      // Smooth initial slide
      withTiming(
        ANIMATION_CONFIG.LOGO.SLIDE.DISTANCE +
          ANIMATION_CONFIG.LOGO.LOCK.OVERSHOOT,
        {
          duration: ANIMATION_CONFIG.LOGO.SLIDE.DURATION,
          easing: ANIMATION_CONFIG.LOGO.SLIDE.EASING,
        }
      ),
      // Spring back to final position
      withSpring(ANIMATION_CONFIG.LOGO.SLIDE.DISTANCE, {
        damping: ANIMATION_CONFIG.LOGO.LOCK.DAMPING,
        stiffness: ANIMATION_CONFIG.LOGO.LOCK.STIFFNESS,
        mass: ANIMATION_CONFIG.LOGO.LOCK.MASS,
        velocity: ANIMATION_CONFIG.LOGO.LOCK.VELOCITY,
      })
    );

    // Simultaneously animate text
    textOpacity.value = withTiming(1, {
      duration: ANIMATION_CONFIG.TEXT.FADE_IN_DURATION,
    });
    textTranslateY.value = withSpring(0, ANIMATION_CONFIG.TEXT.SPRING);

    // Phase 2: Fade out everything
    setTimeout(() => {
      const fadeOutConfig = {
        duration: ANIMATION_CONFIG.FADE_DURATION,
        easing: Easing.out(Easing.ease),
      };

      logoOpacity.value = withTiming(0, fadeOutConfig);
      textOpacity.value = withTiming(0, fadeOutConfig, (finished) => {
        if (finished && onAnimationComplete) {
          runOnJS(onAnimationComplete)();
        }
      });
    }, ANIMATION_CONFIG.HOLD_DURATION);
  }, []);

  return (
    <View
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      alignItems="center"
      justifyContent="center"
      backgroundColor="$bg"
      onLayout={startAnimation}
    >
      {/* Logo Image */}
      <AnimatedImage
        source={require("@/assets/images/LockedInLogoSplash.png")}
        style={[
          {
            width: imageSize,
            height: imageSize,
            resizeMode: "contain",
          },
          logoAnimatedStyles,
        ]}
      />

      {/* Text Image */}
      <AnimatedImage
        source={require("@/assets/images/LockedInLogoSplashText.png")}
        style={[
          {
            width: imageSize * ANIMATION_CONFIG.TEXT.SIZE_MULTIPLIER.WIDTH,
            height: imageSize * ANIMATION_CONFIG.TEXT.SIZE_MULTIPLIER.HEIGHT,
            resizeMode: "contain",
            position: "absolute",
          },
          textAnimatedStyles,
        ]}
      />
    </View>
  );
};
