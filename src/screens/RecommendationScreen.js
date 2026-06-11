import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, BackHandler } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../components/common/Card';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SOMATOTYPE_COLORS, SOMATOTYPE_ICONS, INTENSITY_LEVELS } from '../utils/constants';

const CATEGORY_CONFIG = {
  deporte: { icon: 'trophy-outline', label: 'Deporte', color: '#FFD600' },
  ejercicio: { icon: 'barbell-outline', label: 'Ejercicio', color: '#6C5CE7' },
  nutricion: { icon: 'nutrition-outline', label: 'Nutrición', color: '#00E676' },
};

const RecommendationItem = ({ item }) => {
  const intensity = INTENSITY_LEVELS[item.intensity] || INTENSITY_LEVELS.medium;
  const config = CATEGORY_CONFIG[item.category] || { icon: 'fitness-outline', label: 'General', color: '#6C5CE7' };
  const [saved, setSaved] = useState(false);

  return (
    <Card style={{ marginBottom: 14, padding: 0, overflow: 'hidden' }}>
      <LinearGradient
        colors={[config.color + '18', '#1E1E2E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 16 }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 }}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: config.color + '33',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12,
            }}
          >
            <Ionicons name={config.icon} size={22} color={config.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>{item.name}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 8 }}>
              <Text style={{ color: config.color, fontSize: 11, fontWeight: '600' }}>{config.label}</Text>
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 6,
                  backgroundColor: intensity.color + '22',
                }}
              >
                <Text style={{ color: intensity.color, fontSize: 10, fontWeight: '700' }}>
                  {intensity.label}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={() => setSaved(!saved)}>
            <Ionicons name={saved ? 'heart' : 'heart-outline'} size={22} color={saved ? '#FF5252' : '#8B8BA3'} />
          </TouchableOpacity>
        </View>

        <Text style={{ color: '#aaa', fontSize: 13, lineHeight: 20, marginBottom: 10 }}>{item.description}</Text>

        {item.benefits?.length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {item.benefits.map((b, i) => (
              <View
                key={i}
                style={{
                  backgroundColor: '#08080B',
                  borderRadius: 20,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderWidth: 1,
                  borderColor: '#2A2A35',
                }}
              >
                <Text style={{ color: '#8B8BA3', fontSize: 11 }}>{b}</Text>
              </View>
            ))}
          </View>
        )}
      </LinearGradient>
    </Card>
  );
};

const RecommendationScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const recommendations = route.params?.recommendations || [];
  const somatotype = route.params?.somatotype || '';
  const somaColor = SOMATOTYPE_COLORS[somatotype] || '#6C5CE7';
  const somaIcon = SOMATOTYPE_ICONS[somatotype] || 'body-outline';

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      const onHardwareBack = () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
          return true;
        }
        return false;
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onHardwareBack);
      return () => subscription.remove();
    }, [navigation])
  );

  const deportes = recommendations.filter((r) => r.category === 'deporte');
  const ejercicios = recommendations.filter((r) => r.category === 'ejercicio');
  const nutricion = recommendations.filter((r) => r.category === 'nutricion');
  const otros = recommendations.filter((r) => !['deporte', 'ejercicio', 'nutricion'].includes(r.category));

  return (
    <View style={{ flex: 1, backgroundColor: '#08080B' }}>
      <LinearGradient colors={[somaColor + '33', '#08080B']} style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <TouchableOpacity
            onPress={goBack}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#1E1E2E',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12,
            }}
          >
            <Ionicons name="arrow-back" size={22} color="white" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: '700' }}>Tu plan ideal</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <Ionicons name={somaIcon} size={14} color={somaColor} style={{ marginRight: 4 }} />
              <Text style={{ color: somaColor, fontSize: 13, fontWeight: '600' }}>{somatotype}</Text>
            </View>
          </View>
          <View
            style={{
              backgroundColor: somaColor + '33',
              borderRadius: 12,
              paddingHorizontal: 10,
              paddingVertical: 6,
            }}
          >
            <Text style={{ color: somaColor, fontWeight: 'bold', fontSize: 13 }}>
              {recommendations.length}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 8, paddingBottom: 30 }}>
        {deportes.length > 0 && (
          <>
            <SectionTitle icon="trophy-outline" title="Deportes Ideales" color="#FFD600" />
            {deportes.map((item, i) => (
              <RecommendationItem key={`d-${i}`} item={item} />
            ))}
          </>
        )}

        {ejercicios.length > 0 && (
          <>
            <SectionTitle icon="barbell-outline" title="Ejercicios Recomendados" color="#6C5CE7" />
            {ejercicios.map((item, i) => (
              <RecommendationItem key={`e-${i}`} item={item} />
            ))}
          </>
        )}

        {nutricion.length > 0 && (
          <>
            <SectionTitle icon="nutrition-outline" title="Nutrición" color="#00E676" />
            {nutricion.map((item, i) => (
              <RecommendationItem key={`n-${i}`} item={item} />
            ))}
          </>
        )}

        {otros.length > 0 && (
          <>
            <SectionTitle icon="fitness-outline" title="Otras Recomendaciones" color="#8B8BA3" />
            {otros.map((item, i) => (
              <RecommendationItem key={`o-${i}`} item={item} />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const SectionTitle = ({ icon, title, color }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, marginTop: 8 }}>
    <View
      style={{
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: color + '22',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
      }}
    >
      <Ionicons name={icon} size={16} color={color} />
    </View>
    <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>{title}</Text>
  </View>
);

export default RecommendationScreen;
