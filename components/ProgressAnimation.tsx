import { useEffect, useRef, useState } from 'react';
import { Animated, View, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from 'tamagui';
import { MotiView } from 'moti';

const { width } = Dimensions.get('window');

type ProgressAnimationProps = {
  onComplete: () => void;
  duration?: number;
};

export const ProgressAnimation = ({ 
  onComplete, 
  duration = 2000  // Default duration of 2 seconds
}: ProgressAnimationProps) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [progressText, setProgressText] = useState('Getting everything ready...');
  
  const progressTexts = [
    'Getting everything ready...',
    'Setting up your profile...',
    'Finding study partners...',
    'Almost there...',
  ];

  useEffect(() => {
    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: duration,
      useNativeDriver: false,
    }).start(() => {
      onComplete();
    });

    // Animate text changes
    let currentIndex = 0;
    const textInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % progressTexts.length;
      setProgressText(progressTexts[currentIndex]);
    }, duration / progressTexts.length);

    return () => clearInterval(textInterval);
  }, []);

  return (
    <View style={styles.container}>
      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'timing', duration: 500 }}
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

      <View style={styles.progressBackground}>
        <Animated.View 
          style={[
            styles.progressFill,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            }
          ]} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  progressBackground: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0F9ED5', // Your blue shade
    borderRadius: 4,
  },
});