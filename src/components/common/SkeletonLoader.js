import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { COLORS } from '../../styles/theme';

const SkeletonLoader = ({ width = '100%', height = 20, borderRadius = 8, style }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: COLORS.dark.surface2,
          opacity,
        },
        style,
      ]}
    />
  );
};

export const SkeletonCard = () => (
  <View
    className="rounded-3xl p-5 mb-4"
    style={{
      backgroundColor: COLORS.dark.surface,
      borderWidth: 1,
      borderColor: COLORS.dark.border,
    }}
  >
    <SkeletonLoader width="60%" height={16} style={{ marginBottom: 12 }} />
    <SkeletonLoader width="100%" height={12} style={{ marginBottom: 8 }} />
    <SkeletonLoader width="80%" height={12} />
  </View>
);

export default SkeletonLoader;
