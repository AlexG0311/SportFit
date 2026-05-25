import React from 'react';
import { Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { COLORS } from '../../styles/theme';

const GradientText = ({
  text,
  colors = COLORS.gradient.accent,
  style,
  className = '',
}) => {
  // Fallback to regular text since MaskedView may not be installed
  return (
    <Text
      className={className}
      style={[{ color: colors[0] }, style]}
    >
      {text}
    </Text>
  );
};

export default GradientText;
