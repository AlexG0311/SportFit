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
      setStepIndex((v) => (v >= steps.length - 1 ? v : v + 1));
    }, 1400);

    return () => clearInterval(t);
  }, []);

  // Navigate when we've reached the last step, but do it outside render
  useEffect(() => {
    if (stepIndex >= steps.length - 1) {
      // schedule navigation on next tick to avoid React "setState in render" errors
      const id = setTimeout(() => {
        navigation.replace('Result', { result: route.params?.payload || null });
      }, 0);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [stepIndex, navigation, route.params]);

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
