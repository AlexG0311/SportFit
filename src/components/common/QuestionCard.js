import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const OPTION_ICONS = ['ellipse-outline', 'square-outline', 'triangle-outline'];

const QuestionCard = ({ question, onSelect, questionNumber }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (value) => {
    setSelected(value);
    setTimeout(() => onSelect(value), 200);
  };

  return (
    <View>
      <View
        style={{
          backgroundColor: '#1E1E2E',
          borderRadius: 16,
          padding: 18,
          marginBottom: 20,
          borderLeftWidth: 3,
          borderLeftColor: '#6C5CE7',
        }}
      >
        <Text style={{ color: '#6C5CE7', fontSize: 12, fontWeight: '600', marginBottom: 8 }}>
          PREGUNTA {questionNumber}
        </Text>
        <Text style={{ color: 'white', fontSize: 18, lineHeight: 26 }}>{question.text}</Text>
      </View>

      {question.options.map((opt, idx) => {
        const isSelected = selected === opt.value;
        return (
          <TouchableOpacity
            key={idx}
            onPress={() => handleSelect(opt.value)}
            activeOpacity={0.7}
            style={{
              backgroundColor: isSelected ? '#6C5CE733' : '#1E1E2E',
              padding: 16,
              borderRadius: 14,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: isSelected ? '#6C5CE7' : '#2A2A35',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: isSelected ? '#6C5CE7' : '#2A2A35',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 14,
              }}
            >
              <Ionicons
                name={isSelected ? 'checkmark' : OPTION_ICONS[idx % OPTION_ICONS.length]}
                size={18}
                color={isSelected ? 'white' : '#8B8BA3'}
              />
            </View>
            <Text style={{ color: 'white', fontSize: 15, flex: 1, lineHeight: 22 }}>{opt.text}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default QuestionCard;
