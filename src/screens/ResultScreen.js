import React from 'react';
import { View, Text, Image, ScrollView, Dimensions } from 'react-native';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SOMATOTYPE_COLORS, SCREEN_NAMES } from '../utils/constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Simple horizontal bar for a Heath-Carter component (1-7 scale).
 */
const ComponentBar = ({ label, value, color }) => {
  const pct = Math.min(100, (value / 7) * 100);
  return (
    <View style={{ marginBottom: 10 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
        <Text style={{ color: '#ccc', fontSize: 13 }}>{label}</Text>
        <Text style={{ color, fontSize: 13, fontWeight: '600' }}>{value}</Text>
      </View>
      <View style={{ height: 8, backgroundColor: '#1E1E2E', borderRadius: 4 }}>
        <View
          style={{
            height: 8,
            width: `${pct}%`,
            backgroundColor: color,
            borderRadius: 4,
          }}
        />
      </View>
    </View>
  );
};

const ResultScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const result = route.params?.result || {};

  const imgWidth = Math.max(300, SCREEN_WIDTH - 48);
  const imgHeight = imgWidth * 1.4;

  const somaColor = SOMATOTYPE_COLORS[result.somatotype?.split('-')[0]] || '#6C5CE7';

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#08080B', padding: 16 }}>
      <Text style={{ color: 'white', fontSize: 24, fontWeight: '700', marginBottom: 12 }}>
        Resultados del Análisis
      </Text>

      {/* ── Annotated image ── */}
      {result.annotated_image ? (
        <Card className="mb-4 items-center" style={{ marginBottom: 16, alignItems: 'center' }}>
          <Image
            source={{ uri: result.annotated_image }}
            style={{ width: imgWidth, height: imgHeight, borderRadius: 12 }}
            resizeMode="contain"
          />
        </Card>
      ) : null}

      {/* ── Somatotype ── */}
      <Card className="mb-4" style={{ marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: somaColor,
              marginRight: 8,
            }}
          />
          <Text style={{ color: 'white', fontSize: 20, fontWeight: '700' }}>
            {result.somatotype || 'No disponible'}
          </Text>
          {result.confidence != null && (
            <Text style={{ color: '#8B8BA3', fontSize: 14, marginLeft: 8 }}>
              {result.confidence}% confianza
            </Text>
          )}
        </View>
        {result.somatotype_description ? (
          <Text style={{ color: '#8B8BA3', fontSize: 13, lineHeight: 18 }}>
            {result.somatotype_description}
          </Text>
        ) : null}
      </Card>

      {/* ── Heath-Carter Components ── */}
      <Card className="mb-4" style={{ marginBottom: 16 }}>
        <Text style={{ color: 'white', fontWeight: '600', fontSize: 16, marginBottom: 12 }}>
          Componentes Heath-Carter
        </Text>
        <ComponentBar
          label="Endomorfia (grasa)"
          value={result.endomorphy ?? 0}
          color="#FF5252"
        />
        <ComponentBar
          label="Mesomorfia (músculo)"
          value={result.mesomorphy ?? 0}
          color="#6C5CE7"
        />
        <ComponentBar
          label="Ectomorfia (linealidad)"
          value={result.ectomorphy ?? 0}
          color="#00D2FF"
        />
      </Card>

      {/* ── Body Measurements ── */}
      <Card className="mb-4" style={{ marginBottom: 16 }}>
        <Text style={{ color: 'white', fontWeight: '600', fontSize: 16, marginBottom: 8 }}>
          Medidas Corporales
        </Text>
        <Text style={{ color: '#8B8BA3', fontSize: 13, marginBottom: 8 }}>
          IMC: {result.imc ?? '—'}
        </Text>

        <MeasureRow label="Ancho de hombros" value={result.shoulder_width_cm} unit="cm" />
        <MeasureRow label="Ancho de caderas" value={result.hip_width_cm} unit="cm" />
        <MeasureRow label="Ancho de cintura (est.)" value={result.waist_width_cm} unit="cm" />
        <MeasureRow label="Altura del torso" value={result.torso_height_cm} unit="cm" />
        <MeasureRow label="Brazo izquierdo" value={result.left_arm_length_cm} unit="cm" />
        <MeasureRow label="Brazo derecho" value={result.right_arm_length_cm} unit="cm" />
        <MeasureRow label="Pierna izquierda" value={result.left_leg_length_cm} unit="cm" />
        <MeasureRow label="Pierna derecha" value={result.right_leg_length_cm} unit="cm" />

        <View style={{ marginTop: 8, borderTopWidth: 1, borderTopColor: '#1E1E2E', paddingTop: 8 }}>
          <MeasureRow label="Ratio hombros/caderas" value={result.shoulder_hip_ratio} />
          <MeasureRow label="Ratio cintura/caderas" value={result.waist_hip_ratio} />
        </View>
      </Card>

      {/* ── View Recommendations Button ── */}
      {result.recommendations && result.recommendations.length > 0 && (
        <Button
          title="Ver Recomendaciones Personalizadas"
          onPress={() =>
            navigation.navigate(SCREEN_NAMES.RECOMMENDATION, {
              recommendations: result.recommendations,
              somatotype: result.somatotype,
            })
          }
          style={{ marginBottom: 20 }}
        />
      )}
    </ScrollView>
  );
};

const MeasureRow = ({ label, value, unit = '' }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
    <Text style={{ color: '#8B8BA3', fontSize: 13 }}>{label}</Text>
    <Text style={{ color: '#fff', fontSize: 13 }}>
      {value != null ? `${value} ${unit}` : '—'}
    </Text>
  </View>
);

export default ResultScreen;
