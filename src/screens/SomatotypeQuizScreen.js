import React, { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';
import { useNavigation } from '@react-navigation/native';
import { SCREEN_NAMES } from '../utils/constants';
import { QUESTIONS } from '../data/somatotypeQuestions.js';
import {
  calculateSomatotypeScores,
  fetchRecommendations,
} from '../services/somatotypeService';
import { saveQuizResult } from '../services/quizHistoryService';
import QuestionCard from '../components/common/QuestionCard';

const SomatotypeQuizScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, updateUser } = useAuth();
  const { unlockAchievement } = useGamification();
  const navigation = useNavigation();

  const handleAnswer = async (value) => {
    const newAnswers = [...answers, value];
    if (currentIndex + 1 < QUESTIONS.length) {
      setAnswers(newAnswers);
      setCurrentIndex(currentIndex + 1);
    } else {
      setLoading(true);
      try {
        const scores = calculateSomatotypeScores(newAnswers);
        const somatotype = scores.dominant;
        await updateUser({ somatotype });
        unlockAchievement('quiz_complete');
        const recommendations = await fetchRecommendations(somatotype, {
          height: user?.height,
          weight: user?.weight,
          age: user?.age,
          gender: user?.gender,
        });
        await saveQuizResult({ somatotype, scores, recommendations });
        navigation.navigate(SCREEN_NAMES.SOMATOTYPE_RESULT, {
          somatotype,
          scores,
          recommendations,
        });
      } catch (error) {
        Alert.alert('Error', error.message || 'Hubo un problema al generar las recomendaciones');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#08080B', padding: 32 }}>
        <ActivityIndicator size="large" color="#6C5CE7" />
        <Text style={{ color: 'white', marginTop: 20, fontSize: 18, fontWeight: '600' }}>
          Analizando tu perfil...
        </Text>
        <Text style={{ color: '#8B8BA3', marginTop: 8, textAlign: 'center' }}>
          Nuestra IA está generando recomendaciones personalizadas
        </Text>
      </View>
    );
  }

  const currentQuestion = QUESTIONS[currentIndex];
  const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#08080B', padding: 20 }}>
      <LinearGradient
        colors={['#1a1a2e', '#08080B']}
        style={{ borderRadius: 16, padding: 16, marginBottom: 24 }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Ionicons name="body-outline" size={22} color="#6C5CE7" style={{ marginRight: 8 }} />
          <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>Conozcamos tu cuerpo</Text>
        </View>
        <Text style={{ color: '#8B8BA3' }}>
          Pregunta {currentIndex + 1} de {QUESTIONS.length}
        </Text>
      </LinearGradient>

      <View style={{ height: 6, backgroundColor: '#2A2A35', borderRadius: 3, marginBottom: 8, overflow: 'hidden' }}>
        <LinearGradient
          colors={['#6C5CE7', '#00D2FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: `${progress}%`, height: 6, borderRadius: 3 }}
        />
      </View>
      <Text style={{ color: '#6C5CE7', fontSize: 12, fontWeight: '600', marginBottom: 28, textAlign: 'right' }}>
        {Math.round(progress)}% completado
      </Text>

      <QuestionCard question={currentQuestion} onSelect={handleAnswer} questionNumber={currentIndex + 1} />
    </ScrollView>
  );
};

export default SomatotypeQuizScreen;
