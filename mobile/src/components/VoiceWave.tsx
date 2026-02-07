import React from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

interface VoiceWaveProps {
  isAnimating?: boolean;
  color?: string;
  size?: number;
}

export default function VoiceWave({ isAnimating = false, color = '#3498db', size = 40 }: VoiceWaveProps) {
  const waveAnim = useRef(new Animated.Value(0)).current;
  const waveAnim2 = useRef(new Animated.Value(0)).current;
  const waveAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isAnimating) {
      startAnimation();
    } else {
      stopAnimation();
    }

    return () => {
      stopAnimation();
    };
  }, [isAnimating]);

  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(waveAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim2, {
          toValue: 1,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          delay: 100,
        }),
        Animated.timing(waveAnim2, {
          toValue: 0,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim3, {
          toValue: 1,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          delay: 200,
        }),
        Animated.timing(waveAnim3, {
          toValue: 0,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
        }),
      ]),
    ).start();
  };

  const stopAnimation = () => {
    waveAnim.setValue(0);
    waveAnim2.setValue(0);
    waveAnim3.setValue(0);
  };

  const waveScale1 = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  const waveScale2 = waveAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1.2],
  });

  const waveScale3 = waveAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.wave,
          {
            backgroundColor: color,
            transform: [{ scale: waveScale1 }],
            opacity: waveAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 1],
            }),
          },
        ]}
      />
      <Animated.View
        style={[
          styles.wave,
          {
            backgroundColor: color,
            transform: [{ scale: waveScale2 }],
            opacity: waveAnim2.interpolate({
              inputRange: [0, 1],
              outputRange: [0.5, 1],
            }),
          },
        ]}
      />
      <Animated.View
        style={[
          styles.wave,
          {
            backgroundColor: color,
            transform: [{ scale: waveScale3 }],
            opacity: waveAnim3.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 1],
            }),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  wave: {
    position: 'absolute',
    borderRadius: 50,
  },
});
