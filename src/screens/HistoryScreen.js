import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import Card from '../components/common/Card';
import { useAnalysis } from '../context/AnalysisContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SOMATOTYPE_COLORS, SCREEN_NAMES } from '../utils/constants';

const HistoryItem = ({ item, onPress }) => {
  const somatotype = item.somatotype || 'Desconocido';
  const primaryType = somatotype.split('-')[0];
  const color = SOMATOTYPE_COLORS[primaryType] || '#6C5CE7';
  
  // Format date correctly
  const dateStr = item.date ? new Date(item.date).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : 'Análisis reciente';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card className="mb-3 flex-row items-center" style={{ padding: 12, marginBottom: 12 }}>
        {item.annotated_image ? (
          <Image 
            source={{ uri: item.annotated_image }} 
            style={{ width: 60, height: 80, borderRadius: 8, backgroundColor: '#1E1E2E' }} 
            resizeMode="cover"
          />
        ) : (
          <View style={{ width: 60, height: 80, borderRadius: 8, backgroundColor: '#1E1E2E', justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="body-outline" size={24} color="#8B8BA3" />
          </View>
        )}
        
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color, marginRight: 6 }} />
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{somatotype}</Text>
          </View>
          
          <Text style={{ color: '#8B8BA3', fontSize: 12, marginBottom: 4 }}>
            <Ionicons name="time-outline" size={12} color="#8B8BA3" /> {dateStr}
          </Text>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <View style={{ backgroundColor: '#1E1E2E', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginRight: 6 }}>
              <Text style={{ color: '#aaa', fontSize: 11 }}>IMC: {item.imc}</Text>
            </View>
            {item.confidence && (
              <View style={{ backgroundColor: '#1E1E2E', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                <Text style={{ color: '#aaa', fontSize: 11 }}>{item.confidence}% preciso</Text>
              </View>
            )}
          </View>
        </View>
        
        <Ionicons name="chevron-forward" size={20} color="#3F3F46" />
      </Card>
    </TouchableOpacity>
  );
};

const HistoryScreen = () => {
  const { history } = useAnalysis();
  const navigation = useNavigation();

  const handlePressItem = (item) => {
    navigation.navigate(SCREEN_NAMES.RESULT, { result: item });
  };

  return (
    <View className="flex-1 bg-[#08080B] p-4">
      <View style={{ marginBottom: 16 }}>
        <Text className="text-white text-3xl font-bold">Historial</Text>
        <Text style={{ color: '#8B8BA3', marginTop: 4 }}>Tus análisis corporales pasados</Text>
      </View>
      
      {history && history.length > 0 ? (
        <FlatList 
          data={history} 
          keyExtractor={(i, index) => i.id?.toString() || `hist-${index}`} 
          renderItem={({ item }) => <HistoryItem item={item} onPress={() => handlePressItem(item)} />} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#1E1E2E', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
            <Ionicons name="images-outline" size={32} color="#6C5CE7" />
          </View>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Aún no hay análisis</Text>
          <Text style={{ color: '#8B8BA3', textAlign: 'center', lineHeight: 20 }}>
            Cuando te tomes una foto y la analices, aparecerá aquí para que puedas ver tu progreso con el tiempo.
          </Text>
        </View>
      )}
    </View>
  );
};

export default HistoryScreen;
