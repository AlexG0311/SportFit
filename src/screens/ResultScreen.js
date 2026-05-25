import React from 'react';
import { View, Text } from 'react-native';
import Card from '../components/common/Card';
import ProgressBar from '../components/common/ProgressBar';
import { useRoute } from '@react-navigation/native';

const ResultScreen = () => {
  const route = useRoute();
  const result = route.params?.result || {
    somatotype: 'Mesomorfo',
    confidence: 92,
    bmi: 23.4,
    muscle: 42,
    fat: 18,
  };

  return (
    <View className="flex-1 bg-[#08080B] p-4">
      <Text className="text-white text-2xl font-bold mb-4">Resultados</Text>
      <Card className="mb-4">
        <Text className="text-white text-lg font-semibold">Tipo corporal</Text>
        <Text className="text-[#8B8BA3] mt-2">{result.somatotype} • {result.confidence}%</Text>
      </Card>

      <Card className="mb-4">
        <Text className="text-white font-semibold mb-2">Métricas</Text>
        <Text className="text-[#8B8BA3]">IMC: {result.bmi}</Text>
        <Text className="text-[#8B8BA3] mt-2">Masa muscular</Text>
        <ProgressBar value={result.muscle} />
        <Text className="text-[#8B8BA3] mt-2">Grasa corporal</Text>
        <ProgressBar value={result.fat} color="#FF5252" />
      </Card>
    </View>
  );
};

export default ResultScreen;
