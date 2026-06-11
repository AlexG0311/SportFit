import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Card from '../components/common/Card';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';
import { getLatestQuizResult, getStreak } from '../services/quizHistoryService';
import {
  SCREEN_NAMES,
  SOMATOTYPE_COLORS,
  SOMATOTYPE_DESCRIPTIONS,
  SOMATOTYPE_ICONS,
} from '../utils/constants';

const QuickAction = ({ icon, label, color, onPress }) => (
  <TouchableOpacity onPress={onPress} style={{ alignItems: 'center', width: '25%' }}>
    <View
      style={{
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: color + '22',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
      }}
    >
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <Text style={{ color: '#8B8BA3', fontSize: 11, textAlign: 'center' }}>{label}</Text>
  </TouchableOpacity>
);

const HomeScreen = () => {
  const { user } = useAuth();
  const { unlockedAchievements } = useGamification();
  const navigation = useNavigation();
  const [latestResult, setLatestResult] = useState(null);
  const [streak, setStreak] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    const [result, streakCount] = await Promise.all([getLatestQuizResult(), getStreak()]);
    setLatestResult(result);
    setStreak(streakCount);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const somatotype = user?.somatotype || latestResult?.somatotype;
  const somaColor = SOMATOTYPE_COLORS[somatotype] || '#6C5CE7';
  const somaIcon = SOMATOTYPE_ICONS[somatotype] || 'body-outline';

  const goToTab = (tabName) => navigation.navigate(tabName);

  const viewRecommendations = () => {
    if (!latestResult?.recommendations?.length) {
      goToTab(SCREEN_NAMES.QUIZ);
      return;
    }
    navigation.navigate(SCREEN_NAMES.QUIZ, {
      screen: SCREEN_NAMES.RECOMMENDATION,
      params: {
        recommendations: latestResult.recommendations,
        somatotype: latestResult.somatotype,
        fromQuiz: false,
      },
    });
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#08080B' }}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6C5CE7" />}
    >
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#08080B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 20, padding: 20, marginBottom: 20 }}
      >
        <Text style={{ color: '#8B8BA3', fontSize: 14 }}>Bienvenido de vuelta,</Text>
        <Text style={{ color: 'white', fontSize: 26, fontWeight: 'bold', marginBottom: 16 }}>
          {user?.name?.split(' ')[0] || 'Atleta'}
        </Text>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1, backgroundColor: '#ffffff11', borderRadius: 12, padding: 12 }}>
            <Ionicons name="flame" size={20} color="#FF5252" />
            <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold', marginTop: 6 }}>{streak}</Text>
            <Text style={{ color: '#8B8BA3', fontSize: 11 }}>días de racha</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: '#ffffff11', borderRadius: 12, padding: 12 }}>
            <Ionicons name="trophy" size={20} color="#FFD600" />
            <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold', marginTop: 6 }}>
              {unlockedAchievements.length}
            </Text>
            <Text style={{ color: '#8B8BA3', fontSize: 11 }}>logros</Text>
          </View>
        </View>
      </LinearGradient>

      {somatotype ? (
        <Card gradient style={{ marginBottom: 20, padding: 18 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: somaColor + '33',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 14,
              }}
            >
              <Ionicons name={somaIcon} size={24} color={somaColor} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#8B8BA3', fontSize: 12 }}>Tu somatotipo</Text>
              <Text style={{ color: somaColor, fontSize: 22, fontWeight: 'bold' }}>{somatotype}</Text>
            </View>
          </View>
          <Text style={{ color: '#aaa', fontSize: 13, lineHeight: 20, marginBottom: 14 }}>
            {SOMATOTYPE_DESCRIPTIONS[somatotype]}
          </Text>
          {latestResult?.recommendations?.length > 0 && (
            <TouchableOpacity
              onPress={viewRecommendations}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: somaColor + '22',
                borderRadius: 12,
                padding: 12,
              }}
            >
              <Ionicons name="sparkles" size={18} color={somaColor} style={{ marginRight: 8 }} />
              <Text style={{ color: 'white', fontWeight: '600', flex: 1 }}>
                Ver {latestResult.recommendationCount} recomendaciones
              </Text>
              <Ionicons name="chevron-forward" size={18} color={somaColor} />
            </TouchableOpacity>
          )}
        </Card>
      ) : (
        <Card style={{ marginBottom: 20, padding: 20, alignItems: 'center' }}>
          <Ionicons name="clipboard-outline" size={40} color="#6C5CE7" style={{ marginBottom: 12 }} />
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
            Descubre tu somatotipo
          </Text>
          <Text style={{ color: '#8B8BA3', textAlign: 'center', marginBottom: 16, lineHeight: 20 }}>
            Completa el cuestionario para obtener recomendaciones personalizadas con IA.
          </Text>
          <TouchableOpacity
            onPress={() => goToTab(SCREEN_NAMES.QUIZ)}
            style={{ backgroundColor: '#6C5CE7', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 24 }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Empezar cuestionario</Text>
          </TouchableOpacity>
        </Card>
      )}

      <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', marginBottom: 14 }}>Accesos rápidos</Text>
      <Card style={{ marginBottom: 20, paddingVertical: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <QuickAction icon="clipboard-outline" label="Cuestionario" color="#6C5CE7" onPress={() => goToTab(SCREEN_NAMES.QUIZ)} />
          <QuickAction icon="calendar-outline" label="Rutina" color="#FFD600" onPress={() => goToTab(SCREEN_NAMES.PLANNER)} />
          <QuickAction icon="chatbubble-outline" label="Coach IA" color="#00D2FF" onPress={() => goToTab(SCREEN_NAMES.CHAT)} />
          <QuickAction icon="person-outline" label="Perfil" color="#00E676" onPress={() => goToTab(SCREEN_NAMES.PROFILE)} />
        </View>
      </Card>

      {latestResult && (
        <Card style={{ padding: 16 }}>
          <Text style={{ color: 'white', fontSize: 15, fontWeight: '600', marginBottom: 8 }}>Último cuestionario</Text>
          <Text style={{ color: '#8B8BA3', fontSize: 13 }}>
            {new Date(latestResult.date).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </Text>
          <View style={{ flexDirection: 'row', marginTop: 12, gap: 8 }}>
            {['ecto', 'meso', 'endo'].map((key) => (
              <View key={key} style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ color: '#8B8BA3', fontSize: 10, marginBottom: 4 }}>
                  {key === 'ecto' ? 'Ecto' : key === 'meso' ? 'Meso' : 'Endo'}
                </Text>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>{latestResult.scores?.[key] || 0}%</Text>
              </View>
            ))}
          </View>
        </Card>
      )}
    </ScrollView>
  );
};

export default HomeScreen;
