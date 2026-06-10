import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import Card from '../components/common/Card';

const steps = [
  'Detectando postura corporal…',
  'Midiendo proporciones del cuerpo…',
  'Calculando componentes Heath-Carter…',
  'Clasificando somatotipo…',
  'Generando recomendaciones personalizadas…',
];

const ProcessingScreen = () => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setStepIndex((v) => (v >= steps.length - 1 ? 0 : v + 1));
    }, 2000);

    return () => clearInterval(t);
  }, []);

  return (
    <View className="flex-1 bg-[#08080B] items-center justify-center p-6">
      <Card className="items-center" style={{ alignItems: 'center', padding: 30 }}>
        <ActivityIndicator size="large" color="#6C5CE7" />
        <Text
          style={{
            color: 'white',
            fontSize: 18,
            fontWeight: '700',
            marginTop: 16,
          }}
        >
          Analizando cuerpo…
        </Text>
        <Text
          style={{
            color: '#8B8BA3',
            marginTop: 8,
            textAlign: 'center',
            fontSize: 14,
          }}
        >
          {steps[stepIndex]}
        </Text>
        <Text
          style={{
            color: '#555',
            marginTop: 16,
            fontSize: 12,
          }}
        >
          Esto puede tardar unos segundos
        </Text>
      </Card>
    </View>
  );
};

export default ProcessingScreen;
