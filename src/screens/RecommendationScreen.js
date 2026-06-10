import React from 'react';
import { View, Text, FlatList, ScrollView } from 'react-native';
import Card from '../components/common/Card';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SOMATOTYPE_COLORS, INTENSITY_LEVELS } from '../utils/constants';

const CATEGORY_ICONS = {
  deporte: 'trophy-outline',
  ejercicio: 'barbell-outline',
  nutricion: 'nutrition-outline',
};

const CATEGORY_LABELS = {
  deporte: 'Deporte',
  ejercicio: 'Ejercicio',
  nutricion: 'Nutrición',
};

const RecommendationItem = ({ item }) => {
  const intensity = INTENSITY_LEVELS[item.intensity] || INTENSITY_LEVELS.medium;
  const icon = CATEGORY_ICONS[item.category] || 'fitness-outline';

  return (
    <Card className="mb-3" style={{ marginBottom: 12, padding: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: '#1E1E2E',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
          }}
        >
          <Ionicons name={icon} size={22} color="#6C5CE7" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: 'white', fontWeight: '600', fontSize: 15 }}>
            {item.name}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
            <Text style={{ color: '#8B8BA3', fontSize: 11, marginRight: 8 }}>
              {CATEGORY_LABELS[item.category] || 'General'}
            </Text>
            <View
              style={{
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 4,
                backgroundColor: intensity.color + '22',
              }}
            >
              <Text style={{ color: intensity.color, fontSize: 10, fontWeight: '600' }}>
                {intensity.label}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <Text style={{ color: '#8B8BA3', fontSize: 13, lineHeight: 18, marginBottom: 8 }}>
        {item.description}
      </Text>

      {item.benefits && item.benefits.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {item.benefits.map((b, i) => (
            <View
              key={i}
              style={{
                backgroundColor: '#1E1E2E',
                borderRadius: 12,
                paddingHorizontal: 8,
                paddingVertical: 4,
              }}
            >
              <Text style={{ color: '#aaa', fontSize: 11 }}>{b}</Text>
            </View>
          ))}
        </View>
      )}
    </Card>
  );
};

const RecommendationScreen = () => {
  const route = useRoute();
  const recommendations = route.params?.recommendations || [];
  const somatotype = route.params?.somatotype || '';
  const somaColor = SOMATOTYPE_COLORS[somatotype?.split('-')[0]] || '#6C5CE7';

  // Group by category
  const deportes = recommendations.filter((r) => r.category === 'deporte');
  const ejercicios = recommendations.filter((r) => r.category === 'ejercicio');
  const nutricion = recommendations.filter((r) => r.category === 'nutricion');
  const otros = recommendations.filter(
    (r) => !['deporte', 'ejercicio', 'nutricion'].includes(r.category)
  );

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, backgroundColor: '#08080B', padding: 16 }}
    >
      <Text style={{ color: 'white', fontSize: 22, fontWeight: '700', marginBottom: 4 }}>
        Recomendaciones
      </Text>
      <Text style={{ color: somaColor, fontSize: 14, marginBottom: 16 }}>
        Personalizado para tu somatotipo: {somatotype}
      </Text>

      {deportes.length > 0 && (
        <>
          <SectionTitle icon="trophy-outline" title="Deportes Ideales" />
          {deportes.map((item, i) => (
            <RecommendationItem key={`d-${i}`} item={item} />
          ))}
        </>
      )}

      {ejercicios.length > 0 && (
        <>
          <SectionTitle icon="barbell-outline" title="Ejercicios Recomendados" />
          {ejercicios.map((item, i) => (
            <RecommendationItem key={`e-${i}`} item={item} />
          ))}
        </>
      )}

      {nutricion.length > 0 && (
        <>
          <SectionTitle icon="nutrition-outline" title="Nutrición" />
          {nutricion.map((item, i) => (
            <RecommendationItem key={`n-${i}`} item={item} />
          ))}
        </>
      )}

      {otros.length > 0 && (
        <>
          <SectionTitle icon="fitness-outline" title="Otras Recomendaciones" />
          {otros.map((item, i) => (
            <RecommendationItem key={`o-${i}`} item={item} />
          ))}
        </>
      )}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

const SectionTitle = ({ icon, title }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginTop: 6 }}>
    <Ionicons name={icon} size={18} color="#6C5CE7" style={{ marginRight: 8 }} />
    <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>{title}</Text>
  </View>
);

export default RecommendationScreen;
