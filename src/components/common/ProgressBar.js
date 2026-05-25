import React, { useEffect, useRef } from 'react';
import { View, Animated, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../styles/theme';

const ProgressBar = ({
  progress = 0,
  height = 8,
  colors = COLORS.gradient.accent,
  showLabel = false,
  label = '',
  animated = true,
  style,
}) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedWidth, {
        toValue: progress,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    } else {
      animatedWidth.setValue(progress);
    }
  }, [progress]);

  const width = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View style={style}>
      {showLabel && (
        <View className="flex-row justify-between mb-1.5">
          <Text className="text-xs" style={{ color: COLORS.text.secondary }}>
            {label}
          </Text>
          <Text className="text-xs font-semibold" style={{ color: COLORS.text.primary }}>
            {Math.round(progress)}%
          </Text>
        </View>
      )}
      <View
        className="rounded-full overflow-hidden"
        style={{
          height,
          backgroundColor: COLORS.dark.surface2,
        }}
      >
        <Animated.View style={{ width, height: '100%' }}>
          <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1, borderRadius: height / 2 }}
          />
        </Animated.View>
      </View>
    </View>
  );
};

export default ProgressBar;
