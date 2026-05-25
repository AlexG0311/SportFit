import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../styles/theme';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'py-2 px-4',
    md: 'py-3.5 px-6',
    lg: 'py-4 px-8',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        className={`rounded-2xl overflow-hidden ${disabled ? 'opacity-50' : ''}`}
        style={style}
      >
        <LinearGradient
          colors={COLORS.gradient.accent}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className={`${sizeClasses[size]} flex-row items-center justify-center rounded-2xl`}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <View className="flex-row items-center justify-center gap-2">
              {icon && icon}
              <Text
                className={`text-white font-bold text-center ${textSizeClasses[size]}`}
                style={textStyle}
              >
                {title}
              </Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'secondary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.7}
        className={`${sizeClasses[size]} rounded-2xl border border-dark-border items-center justify-center flex-row gap-2 ${
          disabled ? 'opacity-50' : ''
        }`}
        style={[{ backgroundColor: COLORS.dark.surface }, style]}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.accent.primary} size="small" />
        ) : (
          <>
            {icon && icon}
            <Text
              className={`text-white font-semibold text-center ${textSizeClasses[size]}`}
              style={textStyle}
            >
              {title}
            </Text>
          </>
        )}
      </TouchableOpacity>
    );
  }

  // ghost variant
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.6}
      className={`${sizeClasses[size]} items-center justify-center flex-row gap-2 ${
        disabled ? 'opacity-50' : ''
      }`}
      style={style}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.accent.primary} size="small" />
      ) : (
        <>
          {icon && icon}
          <Text
            className={`font-semibold text-center ${textSizeClasses[size]}`}
            style={[{ color: COLORS.accent.primary }, textStyle]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;
