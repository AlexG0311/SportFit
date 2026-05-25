import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { SCREEN_NAMES } from '../utils/constants';

const HomeScreen = () => {
  const auth = useAuth();
  const navigation = useNavigation();

  return (
    <ScrollView className="flex-1 bg-[#08080B] p-4">
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <Text className="text-white text-xl font-bold">Hola, {auth.user?.name || 'Atleta'}</Text>
          <Text className="text-[#8B8BA3]">Último análisis: hace 3 días</Text>
        </View>
      </View>

      <Card className="mb-4">
        <Text className="text-white text-lg font-semibold">Tipo corporal</Text>
        <Text className="text-[#8B8BA3] mt-2">Mesomorfo • 92% de confianza</Text>
      </Card>

      <Card className="mb-4">
        <Text className="text-white text-lg font-semibold">Estadísticas rápidas</Text>
        <Text className="text-[#8B8BA3] mt-2">IMC: 23.4 • Masa muscular: 42% • Grasa corporal: 18%</Text>
      </Card>

      <Button title="Analizar cuerpo" onPress={() => navigation.navigate(SCREEN_NAMES.CAMERA)} />

      <Text className="text-white text-xl font-bold mt-6 mb-3">Recomendaciones recientes</Text>
      <Card>
        <Text className="text-white">Entrenamiento: Fuerza - 3x por semana</Text>
      </Card>
    </ScrollView>
  );
};

export default HomeScreen;
