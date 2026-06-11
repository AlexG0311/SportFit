import React, { useState, useCallback } from 'react';
import { View, Text, Image, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Card from '../components/common/Card';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SCREEN_NAMES, SOMATOTYPE_COLORS } from '../utils/constants';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { getQuizHistory, clearQuizHistory } from '../services/quizHistoryService';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const auth = useAuth();
  const navigation = useNavigation();
  const [editing, setEditing] = useState(false);
  
  // States for editing
  const [tempGender, setTempGender] = useState(auth.user?.gender || 'Male');
  const [tempHeight, setTempHeight] = useState(auth.user?.height ? String(auth.user.height) : '');
  const [tempWeight, setTempWeight] = useState(auth.user?.weight ? String(auth.user.weight) : '');
  const [tempAge, setTempAge] = useState(auth.user?.age ? String(auth.user.age) : '');
  const [quizHistory, setQuizHistory] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    const history = await getQuizHistory();
    setQuizHistory(history);
  };

  const viewHistoryRecommendations = (entry) => {
    navigation.navigate(SCREEN_NAMES.QUIZ, {
      screen: SCREEN_NAMES.RECOMMENDATION,
      params: {
        recommendations: entry.recommendations,
        somatotype: entry.somatotype,
        fromQuiz: false,
      },
    });
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Borrar historial',
      '¿Estás seguro de que quieres eliminar todo el historial de cuestionarios? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await clearQuizHistory();
            await loadHistory(); // recargar la lista vacía
            Alert.alert('Historial borrado', 'Todos los cuestionarios han sido eliminados.');
          },
        },
      ]
    );
  };

  const handleSave = () => {
    auth.updateUser({ 
      gender: tempGender,
      height: parseFloat(tempHeight) || auth.user?.height,
      weight: parseFloat(tempWeight) || auth.user?.weight,
      age: parseInt(tempAge, 10) || auth.user?.age,
    });
    setEditing(false);
  };

  const StatBox = ({ icon, label, value, unit }) => (
    <View style={{ flex: 1, backgroundColor: '#1E1E2E', borderRadius: 12, padding: 12, alignItems: 'center', marginHorizontal: 4 }}>
      <Ionicons name={icon} size={20} color="#6C5CE7" style={{ marginBottom: 6 }} />
      <Text style={{ color: '#8B8BA3', fontSize: 11, marginBottom: 2 }}>{label}</Text>
      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
        {value || '—'}<Text style={{ fontSize: 12, color: '#aaa', fontWeight: 'normal' }}> {unit}</Text>
      </Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#08080B', padding: 16 }}>
      {/* ── Header ── */}
      <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 24 }}>
        <View style={{ position: 'relative' }}>
          <Image
            source={{ uri: auth.user?.avatar || 'https://i.pravatar.cc/300' }}
            style={{ width: 110, height: 110, borderRadius: 55, borderWidth: 3, borderColor: '#6C5CE7' }}
          />
          <View style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: '#6C5CE7', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#08080B' }}>
            <Ionicons name="pencil" size={14} color="white" />
          </View>
        </View>
        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginTop: 12 }}>
          {auth.user?.name || 'Atleta SportFit'}
        </Text>
        <Text style={{ color: '#8B8BA3', fontSize: 14, marginTop: 2 }}>
          {auth.user?.email || 'atleta@sportfit.app'}
        </Text>
      </View>

      {/* ── Stats Row ── */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, marginHorizontal: -4 }}>
        <StatBox icon="resize-outline" label="Altura" value={auth.user?.height} unit="m" />
        <StatBox icon="scale-outline" label="Peso" value={auth.user?.weight} unit="kg" />
        <StatBox icon="calendar-outline" label="Edad" value={auth.user?.age} unit="años" />
      </View>

      {/* ── Details / Edit Form ── */}
      <Card style={{ marginBottom: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>Detalles físicos</Text>
          {!editing && (
            <TouchableOpacity onPress={() => setEditing(true)}>
              <Text style={{ color: '#6C5CE7', fontWeight: '600' }}>Editar</Text>
            </TouchableOpacity>
          )}
        </View>

        {editing ? (
          <View>
            <Text style={{ color: '#8B8BA3', fontSize: 12, marginBottom: 6 }}>Género</Text>
            <View style={{ backgroundColor: '#1C1C1E', borderRadius: 8, overflow: 'hidden', marginBottom: 12 }}>
              <Picker
                selectedValue={tempGender}
                onValueChange={setTempGender}
                style={{ color: 'white' }}
                dropdownIconColor="white"
              >
                <Picker.Item label="Masculino" value="Male" />
                <Picker.Item label="Femenino" value="Female" />
              </Picker>
            </View>

            <Text style={{ color: '#8B8BA3', fontSize: 12, marginBottom: 6 }}>Altura (m)</Text>
            <TextInput
              value={tempHeight}
              onChangeText={setTempHeight}
              keyboardType="decimal-pad"
              style={{ backgroundColor: '#1C1C1E', color: 'white', padding: 12, borderRadius: 8, marginBottom: 12 }}
              placeholder="Ej: 1.75"
              placeholderTextColor="#555"
            />

            <Text style={{ color: '#8B8BA3', fontSize: 12, marginBottom: 6 }}>Peso (kg)</Text>
            <TextInput
              value={tempWeight}
              onChangeText={setTempWeight}
              keyboardType="decimal-pad"
              style={{ backgroundColor: '#1C1C1E', color: 'white', padding: 12, borderRadius: 8, marginBottom: 12 }}
              placeholder="Ej: 70"
              placeholderTextColor="#555"
            />

            <Text style={{ color: '#8B8BA3', fontSize: 12, marginBottom: 6 }}>Edad</Text>
            <TextInput
              value={tempAge}
              onChangeText={setTempAge}
              keyboardType="number-pad"
              style={{ backgroundColor: '#1C1C1E', color: 'white', padding: 12, borderRadius: 8, marginBottom: 20 }}
              placeholder="Ej: 25"
              placeholderTextColor="#555"
            />

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Button title="Cancelar" variant="secondary" onPress={() => setEditing(false)} />
              </View>
              <View style={{ flex: 1 }}>
                <Button title="Guardar" onPress={handleSave} />
              </View>
            </View>
          </View>
        ) : (
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#1E1E2E', paddingVertical: 12 }}>
              <Text style={{ color: '#8B8BA3' }}>Género biológico</Text>
              <Text style={{ color: 'white', fontWeight: '500' }}>{auth.user?.gender === 'Male' ? 'Masculino' : 'Femenino'}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#1E1E2E', paddingVertical: 12 }}>
              <Text style={{ color: '#8B8BA3' }}>Altura</Text>
              <Text style={{ color: 'white', fontWeight: '500' }}>{auth.user?.height || '—'} m</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#1E1E2E', paddingVertical: 12 }}>
              <Text style={{ color: '#8B8BA3' }}>Peso</Text>
              <Text style={{ color: 'white', fontWeight: '500' }}>{auth.user?.weight || '—'} kg</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 }}>
              <Text style={{ color: '#8B8BA3' }}>Edad</Text>
              <Text style={{ color: 'white', fontWeight: '500' }}>{auth.user?.age || '—'} años</Text>
            </View>
          </View>
        )}
      </Card>

      {auth.user?.somatotype && (
        <Card style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}>
            <Ionicons name="body-outline" size={24} color="#6C5CE7" style={{ marginRight: 12 }} />
            <View>
              <Text style={{ color: '#8B8BA3', fontSize: 12 }}>Somatotipo</Text>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>{auth.user.somatotype}</Text>
            </View>
          </View>
        </Card>
      )}

      {quizHistory.length > 0 && (
        <Card style={{ marginBottom: 20, padding: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
              Historial de cuestionarios
            </Text>
            <TouchableOpacity onPress={handleClearHistory}>
              <Text style={{ color: '#FF5252', fontSize: 13, fontWeight: '500' }}>
                Borrar todo
              </Text>
            </TouchableOpacity>
          </View>
          {quizHistory.slice(0, 5).map((entry) => {
            const color = SOMATOTYPE_COLORS[entry.somatotype] || '#6C5CE7';
            return (
              <TouchableOpacity
                key={entry.id}
                onPress={() => viewHistoryRecommendations(entry)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: '#1E1E2E',
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: color + '22',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                  }}
                >
                  <Ionicons name="clipboard" size={18} color={color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: 'white', fontWeight: '600' }}>{entry.somatotype}</Text>
                  <Text style={{ color: '#8B8BA3', fontSize: 12, marginTop: 2 }}>
                    {new Date(entry.date).toLocaleDateString('es-ES')} · {entry.recommendationCount} recomendaciones
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#8B8BA3" />
              </TouchableOpacity>
            );
          })}
        </Card>
      )}

      <Card style={{ marginBottom: 20 }}>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}
          onPress={() => navigation.navigate(SCREEN_NAMES.ACHIEVEMENTS)}
        >
          <Ionicons name="trophy-outline" size={24} color="#FFD600" style={{ marginRight: 12 }} />
          <Text style={{ color: 'white', fontSize: 16 }}>Logros y medallas</Text>
          <Ionicons name="chevron-forward" size={20} color="#8B8BA3" style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
      </Card>

      <TouchableOpacity 
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, marginTop: 'auto' }}
        onPress={auth.logout}
      >
        <Ionicons name="log-out-outline" size={20} color="#FF5252" style={{ marginRight: 8 }} />
        <Text style={{ color: '#FF5252', fontWeight: '600', fontSize: 16 }}>Cerrar sesión</Text>
      </TouchableOpacity>
      
      <View style={{ height: 20 }} />
    </ScrollView>
  );
};

export default ProfileScreen;