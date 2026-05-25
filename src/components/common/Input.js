import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../styles/theme';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  error,
  icon,
  autoCapitalize = 'none',
  style,
  editable = true,
  multiline = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const borderColor = error
    ? COLORS.error
    : isFocused
    ? COLORS.accent.primary
    : COLORS.dark.border;

  return (
    <View className="mb-4" style={style}>
      {label && (
        <Text
          className="text-sm font-medium mb-2"
          style={{ color: COLORS.text.secondary }}
        >
          {label}
        </Text>
      )}
      <View
        className="flex-row items-center rounded-2xl px-4"
        style={{
          backgroundColor: COLORS.dark.surface2,
          borderWidth: 1.5,
          borderColor,
          minHeight: multiline ? 100 : 52,
        }}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={isFocused ? COLORS.accent.primary : COLORS.text.tertiary}
            style={{ marginRight: 12 }}
          />
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.text.tertiary}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          multiline={multiline}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 text-base"
          style={{
            color: COLORS.text.primary,
            paddingVertical: multiline ? 12 : 0,
            textAlignVertical: multiline ? 'top' : 'center',
          }}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={COLORS.text.tertiary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <View className="flex-row items-center mt-1.5 ml-1">
          <Ionicons name="alert-circle-outline" size={14} color={COLORS.error} />
          <Text className="text-xs ml-1" style={{ color: COLORS.error }}>
            {error}
          </Text>
        </View>
      )}
    </View>
  );
};

export default Input;
