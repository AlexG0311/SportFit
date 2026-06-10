import React from 'react';
import { View, Text, Image, ScrollView, Dimensions } from 'react-native';
import Card from '../components/common/Card';
import ProgressBar from '../components/common/ProgressBar';
import { useRoute } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ResultScreen = () => {
  const route = useRoute();
  const result = route.params?.result || {
    somatotype: 'Mesomorfo',
    confidence: 92,
    bmi: 23.4,
    muscle: 42,
    fat: 18,
    shoulder_width: 45,
    waist_width: 30,
    ratio: 1.5,
  };

  const imgWidth = Math.max(300, SCREEN_WIDTH - 48);
  const imgHeight = imgWidth * 1.4;

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#08080B', padding: 16 }}>
      <Text style={{ color: 'white', fontSize: 24, fontWeight: '700', marginBottom: 12 }}>Resultados</Text>

      {result.annotated_image ? (
        <Card className="mb-4 items-center" style={{ marginBottom: 16, alignItems: 'center' }}>
          <Image
            source={{ uri: result.annotated_image }}
            style={{ width: imgWidth, height: imgHeight, borderRadius: 12 }}
            resizeMode="contain"
          />
        </Card>
      ) : null}

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
        <Text className="text-white font-semibold mt-2">Medidas (px)</Text>
        <Text className="text-[#8B8BA3]">Hombros: {result.shoulder_width}</Text>
        <Text className="text-[#8B8BA3]">Cintura (proxy): {result.waist_width}</Text>
        <Text className="text-[#8B8BA3]">Relación: {result.ratio}</Text>
      </Card>
    </ScrollView>
  );
};

export default ResultScreen;
