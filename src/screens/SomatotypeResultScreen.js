import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import {
  SCREEN_NAMES,
  SOMATOTYPE_COLORS,
  SOMATOTYPE_DESCRIPTIONS,
  SOMATOTYPE_ICONS,
  SCORE_COLORS,
} from '../utils/constants';

const ScoreBar = ({ label, value, color }) => (
  <View style={{ marginBottom: 14 }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
      <Text style={{ color: '#8B8BA3', fontSize: 13 }}>{label}</Text>
      <Text style={{ color: 'white', fontWeight: 'bold' }}>{value}%</Text>
    </View>
    <View style={{ height: 10, backgroundColor: '#2A2A35', borderRadius: 5, overflow: 'hidden' }}>
      <View style={{ width: `${value}%`, height: '100%', backgroundColor: color, borderRadius: 5 }} />
    </View>
  </View>
);

const SomatotypeResultScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { somatotype, scores, recommendations } = route.params || {};
  const somaColor = SOMATOTYPE_COLORS[somatotype] || '#6C5CE7';
  const somaIcon = SOMATOTYPE_ICONS[somatotype] || 'body-outline';

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, backgroundColor: '#08080B', padding: 20, paddingBottom: 40 }}
    >
      <LinearGradient
        colors={[somaColor + '44', '#08080B']}
        style={{ borderRadius: 24, padding: 28, alignItems: 'center', marginBottom: 24 }}
      >
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: somaColor + '33',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16,
            borderWidth: 2,
            borderColor: somaColor,
          }}
        >
          <Ionicons name={somaIcon} size={40} color={somaColor} />
        </View>
        <Text style={{ color: '#8B8BA3', fontSize: 14, marginBottom: 4 }}>Tu somatotipo es</Text>
        <Text style={{ color: somaColor, fontSize: 32, fontWeight: 'bold', marginBottom: 12 }}>{somatotype}</Text>
        <Text style={{ color: '#aaa', fontSize: 14, textAlign: 'center', lineHeight: 22 }}>
          {SOMATOTYPE_DESCRIPTIONS[somatotype]}
        </Text>
      </LinearGradient>

      <Card style={{ marginBottom: 24, padding: 18 }}>
        <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', marginBottom: 16 }}>
          Distribución de tu perfil
        </Text>
        <ScoreBar label="Ectomorfo" value={scores?.ecto || 0} color={SCORE_COLORS.ecto} />
        <ScoreBar label="Mesomorfo" value={scores?.meso || 0} color={SCORE_COLORS.meso} />
        <ScoreBar label="Endomorfo" value={scores?.endo || 0} color={SCORE_COLORS.endo} />
      </Card>

      <Card style={{ marginBottom: 28, padding: 16, flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name="sparkles" size={28} color="#6C5CE7" style={{ marginRight: 14 }} />
        <View style={{ flex: 1 }}>
          <Text style={{ color: 'white', fontWeight: '600', fontSize: 15 }}>Recomendaciones listas</Text>
          <Text style={{ color: '#8B8BA3', fontSize: 13, marginTop: 2 }}>
            {recommendations?.length || 0} sugerencias personalizadas con IA
          </Text>
        </View>
      </Card>

      <Button
        title="Ver mis recomendaciones"
        onPress={() =>
          navigation.navigate(SCREEN_NAMES.RECOMMENDATION, {
            recommendations,
            somatotype,
            fromQuiz: true,
          })
        }
        size="lg"
      />
    </ScrollView>
  );
};

export default SomatotypeResultScreen;
