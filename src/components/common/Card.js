import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../styles/theme';

const Card = ({ children, style, gradient = false, className = '', noPadding = false }) => {
  if (gradient) {
    return (
      <LinearGradient
        colors={COLORS.gradient.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className={`rounded-3xl ${noPadding ? '' : 'p-5'} ${className}`}
        style={[
          {
            borderWidth: 1,
            borderColor: COLORS.dark.border,
          },
          SHADOWS.sm,
          style,
        ]}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View
      className={`rounded-3xl ${noPadding ? '' : 'p-5'} ${className}`}
      style={[
        {
          backgroundColor: COLORS.dark.surface,
          borderWidth: 1,
          borderColor: COLORS.dark.border,
        },
        SHADOWS.sm,
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default Card;
