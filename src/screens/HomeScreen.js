import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useAnalysis } from '../context/AnalysisContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SCREEN_NAMES, SOMATOTYPE_COLORS } from '../utils/constants';

const HomeScreen = () => {
  const auth = useAuth();
  const navigation = useNavigation();
  const { currentAnalysis, history } = useAnalysis();

  const handleAnalyzePress = () => {
    navigation.navigate(SCREEN_NAMES.CAMERA);
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 19) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#08080B', padding: 16 }}>
      
      {/* ── Header ── */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, marginTop: 8 }}>
        <View>
          <Text style={{ color: '#8B8BA3', fontSize: 14 }}>{getTimeGreeting()},</Text>
          <Text style={{ color: 'white', fontSize: 26, fontWeight: 'bold' }}>
            {auth.user?.name?.split(' ')[0] || 'Atleta'}
          </Text>
        </View>
        <TouchableOpacity 
          style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#1E1E2E', justifyContent: 'center', alignItems: 'center' }}
          onPress={() => navigation.navigate(SCREEN_NAMES.PROFILE)}
        >
          <Ionicons name="person" size={20} color="#6C5CE7" />
        </TouchableOpacity>
      </View>

      {/* ── Main Action Banner ── */}
      <TouchableOpacity activeOpacity={0.9} onPress={handleAnalyzePress} style={{ marginBottom: 24 }}>
        <View style={{ borderRadius: 16, overflow: 'hidden', backgroundColor: '#6C5CE7' }}>
          <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1, paddingRight: 16 }}>
              <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 6 }}>
                Nuevo Análisis Corporal
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, lineHeight: 18 }}>
                Descubre tu somatotipo y recibe una rutina de IA basada en tus proporciones.
              </Text>
              <View style={{ backgroundColor: 'rgba(0,0,0,0.2)', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginTop: 12, flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="camera" size={14} color="white" style={{ marginRight: 6 }} />
                <Text style={{ color: 'white', fontWeight: '600', fontSize: 12 }}>Escanear Ahora</Text>
              </View>
            </View>
            <View style={{ width: 80, height: 80, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 40, justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name="scan-outline" size={40} color="white" />
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {currentAnalysis ? (
        <>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Último Resultado</Text>
            <TouchableOpacity onPress={() => navigation.navigate(SCREEN_NAMES.RESULT, { result: currentAnalysis })}>
              <Text style={{ color: '#6C5CE7', fontWeight: '600', fontSize: 13 }}>Ver todo</Text>
            </TouchableOpacity>
          </View>

          <Card style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: SOMATOTYPE_COLORS[currentAnalysis.somatotype?.split('-')[0]] || '#6C5CE7',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12,
                }}
              >
                <Ionicons name="body" size={24} color="white" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#8B8BA3', fontSize: 12 }}>Tu Somatotipo</Text>
                <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>{currentAnalysis.somatotype}</Text>
              </View>
              <View style={{ backgroundColor: 'rgba(108, 92, 231, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                <Text style={{ color: '#6C5CE7', fontSize: 12, fontWeight: 'bold' }}>IMC: {currentAnalysis.imc}</Text>
              </View>
            </View>
            
            <View style={{ flexDirection: 'row', backgroundColor: '#15151A', borderRadius: 8, padding: 10 }}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ color: '#FF5252', fontWeight: 'bold', fontSize: 16 }}>{currentAnalysis.endomorphy}</Text>
                <Text style={{ color: '#8B8BA3', fontSize: 10 }}>Endo</Text>
              </View>
              <View style={{ width: 1, backgroundColor: '#2A2A35' }} />
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ color: '#6C5CE7', fontWeight: 'bold', fontSize: 16 }}>{currentAnalysis.mesomorphy}</Text>
                <Text style={{ color: '#8B8BA3', fontSize: 10 }}>Meso</Text>
              </View>
              <View style={{ width: 1, backgroundColor: '#2A2A35' }} />
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ color: '#00D2FF', fontWeight: 'bold', fontSize: 16 }}>{currentAnalysis.ectomorphy}</Text>
                <Text style={{ color: '#8B8BA3', fontSize: 10 }}>Ecto</Text>
              </View>
            </View>
          </Card>

          {currentAnalysis.recommendations?.length > 0 && (
            <>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Recomendado por IA</Text>
                <TouchableOpacity onPress={() => navigation.navigate(SCREEN_NAMES.RECOMMENDATION, { recommendations: currentAnalysis.recommendations, somatotype: currentAnalysis.somatotype })}>
                  <Text style={{ color: '#6C5CE7', fontWeight: '600', fontSize: 13 }}>Ver {currentAnalysis.recommendations.length}</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate(SCREEN_NAMES.RECOMMENDATION, { recommendations: currentAnalysis.recommendations, somatotype: currentAnalysis.somatotype })}
              >
                <Card style={{ marginBottom: 20, padding: 0, overflow: 'hidden' }}>
                  <View style={{ padding: 16, borderLeftWidth: 4, borderLeftColor: '#6C5CE7' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                      <Ionicons name="sparkles" size={16} color="#FFD600" style={{ marginRight: 6 }} />
                      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>
                        {currentAnalysis.recommendations[0].name}
                      </Text>
                    </View>
                    <Text style={{ color: '#8B8BA3', fontSize: 13, lineHeight: 18 }} numberOfLines={2}>
                      {currentAnalysis.recommendations[0].description}
                    </Text>
                  </View>
                </Card>
              </TouchableOpacity>
            </>
          )}
        </>
      ) : (
        <Card style={{ alignItems: 'center', padding: 32, marginTop: 20 }}>
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(108, 92, 231, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
            <Ionicons name="fitness-outline" size={32} color="#6C5CE7" />
          </View>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
            Empieza tu transformación
          </Text>
          <Text style={{ color: '#8B8BA3', textAlign: 'center', lineHeight: 20 }}>
            Tómate una foto y nuestra IA detectará tus proporciones para recomendarte el mejor camino.
          </Text>
        </Card>
      )}

    </ScrollView>
  );
};

export default HomeScreen;
