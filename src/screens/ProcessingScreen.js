import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import Card from '../components/common/Card';
import { useNavigation, useRoute } from '@react-navigation/native';

const steps = ['Detectando postura', 'Analizando medidas', 'Clasificando somatotipo'];

const ProcessingScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setStepIndex((v) => {
        if (v >= steps.length - 1) {
          clearInterval(t);
          // after processing navigate to Result with payload placeholder
          navigation.replace('Result', { result: route.params?.payload || null });
          return v;
        }
        return v + 1;
      });
    }, 1400);

    return () => clearInterval(t);
  }, []);

  return (
    <View className="flex-1 bg-[#08080B] items-center justify-center p-6">
      <Card className="items-center">
        <ActivityIndicator size="large" color="#6C5CE7" />
        <Text className="text-white text-lg font-bold mt-4">Analizando cuerpo…</Text>
        <Text className="text-[#8B8BA3] mt-2">{steps[stepIndex]}</Text>
      </Card>
    </View>
  );
};

export default ProcessingScreen;
