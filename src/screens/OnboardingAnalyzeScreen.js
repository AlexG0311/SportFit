import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { SCREEN_NAMES } from '../utils/constants';

const OnboardingAnalyzeScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Reemplaza la pantalla con el QuizStack (directamente dentro de MainTabs)
      // Como estamos dentro de MainTabs, podemos navegar a la pestaña Quiz
      navigation.replace(SCREEN_NAMES.QUIZ);
    }, 2000);
    return () => clearTimeout(timer);   
  }, []);

  return (
    <LinearGradient colors={['#6C5CE7', '#00D2FF']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="white" />
      <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginTop: 30, textAlign: 'center' }}>
        🧬 Listo para analizar tu cuerpo
      </Text>
      <Text style={{ color: 'white', marginTop: 10, textAlign: 'center' }}>
        Prepara tu información...
      </Text>
    </LinearGradient>
  );
};

export default OnboardingAnalyzeScreen;