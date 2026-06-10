import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { analyzeBody } from '../services/analysisService';
import { useNavigation } from '@react-navigation/native';
import { SCREEN_NAMES } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

const GENDER_OPTIONS = [
  { label: 'Masculino', value: 'Male' },
  { label: 'Femenino', value: 'Female' },
];

const CameraScreen = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Datos del usuario para el análisis
  const [height, setHeight] = useState('');   // en metros, ej: "1.75"
  const [weight, setWeight] = useState('');   // en kg, ej: "70"
  const [age, setAge] = useState('');         // edad en años
  const [gender, setGender] = useState('Male');

  const navigation = useNavigation();
  const auth = useAuth();

  useEffect(() => {
    // Pre-llenar con datos del perfil si existen
    if (auth.user?.gender) setGender(auth.user.gender);
    if (auth.user?.height) setHeight(String(auth.user.height));
    if (auth.user?.weight) setWeight(String(auth.user.weight));
    if (auth.user?.age) setAge(String(auth.user.age));

    (async () => {
      await ImagePicker.requestCameraPermissionsAsync();
    })();
  }, []);

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== 'granted') return;

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      base64: false,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== 'granted') return;

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.8,
      base64: false,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const validate = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const a = parseInt(age, 10);

    if (!image) {
      Alert.alert('Falta la imagen', 'Toma o selecciona una foto primero.');
      return false;
    }
    if (!height || isNaN(h) || h < 1.0 || h > 2.5) {
      Alert.alert('Altura inválida', 'Ingresa tu altura en metros (ej: 1.75).');
      return false;
    }
    if (!weight || isNaN(w) || w < 30 || w > 300) {
      Alert.alert('Peso inválido', 'Ingresa tu peso en kg (ej: 70).');
      return false;
    }
    if (age && (isNaN(a) || a < 5 || a > 120)) {
      Alert.alert('Edad inválida', 'Ingresa una edad válida (5-120).');
      return false;
    }
    return true;
  };

  const onAnalyze = async () => {
    if (!validate()) return;

    setLoading(true);
    navigation.navigate(SCREEN_NAMES.PROCESSING);

    try {
      const parsedAge = age ? parseInt(age, 10) : null;
      const res = await analyzeBody(
        image,
        gender,
        parseFloat(height),
        parseFloat(weight),
        parsedAge
      );
      navigation.replace(SCREEN_NAMES.RESULT, { result: res });
    } catch (err) {
      console.error(err);
      navigation.goBack();
      Alert.alert('Error', 'No se pudo analizar la imagen. Intenta con otra foto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#08080B]"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1 }}>

        {/* ── Datos del usuario ── */}
        <Card className="mb-4 p-4">
          <Text className="text-white text-base font-semibold mb-3">Tus datos</Text>

          {/* Género */}
          <Text className="text-gray-400 text-sm mb-1">Género</Text>
          <View className="flex-row mb-3">
            {GENDER_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => setGender(opt.value)}
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  marginRight: opt.value === 'Male' ? 8 : 0,
                  borderRadius: 8,
                  alignItems: 'center',
                  backgroundColor: gender === opt.value ? '#6C5CE7' : '#1E1E2E',
                }}
              >
                <Text style={{ color: gender === opt.value ? '#fff' : '#888' }}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Altura */}
          <Text className="text-gray-400 text-sm mb-1">Altura (metros)</Text>
          <TextInput
            value={height}
            onChangeText={setHeight}
            placeholder="ej: 1.75"
            placeholderTextColor="#555"
            keyboardType="decimal-pad"
            style={{
              backgroundColor: '#1E1E2E',
              color: '#fff',
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              marginBottom: 12,
              fontSize: 16,
            }}
          />

          {/* Peso */}
          <Text className="text-gray-400 text-sm mb-1">Peso (kg)</Text>
          <TextInput
            value={weight}
            onChangeText={setWeight}
            placeholder="ej: 70"
            placeholderTextColor="#555"
            keyboardType="decimal-pad"
            style={{
              backgroundColor: '#1E1E2E',
              color: '#fff',
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              marginBottom: 12,
              fontSize: 16,
            }}
          />

          {/* Edad */}
          <Text className="text-gray-400 text-sm mb-1">Edad (años) — opcional</Text>
          <TextInput
            value={age}
            onChangeText={setAge}
            placeholder="ej: 25"
            placeholderTextColor="#555"
            keyboardType="number-pad"
            style={{
              backgroundColor: '#1E1E2E',
              color: '#fff',
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              fontSize: 16,
            }}
          />
        </Card>

        {/* ── Imagen ── */}
        <Card className="items-center justify-center p-4">
          {!image ? (
            <>
              <Text className="text-white text-base mb-1">Foto del cuerpo completo</Text>
              <Text className="text-gray-400 text-sm mb-4 text-center">
                Párate derecho, de frente, con brazos ligeramente separados
              </Text>
              <Button title="Abrir cámara" onPress={takePhoto} />
              <View style={{ height: 12 }} />
              <Button title="Elegir de galería" variant="secondary" onPress={pickImage} />
            </>
          ) : (
            <>
              <Image
                source={{ uri: image }}
                style={{ width: 260, height: 420, borderRadius: 16 }}
                resizeMode="cover"
              />
              <View className="mt-4 w-full">
                <Button
                  title={loading ? 'Analizando...' : 'Analizar imagen'}
                  onPress={onAnalyze}
                  loading={loading}
                />
                <Button
                  title="Cambiar foto"
                  variant="secondary"
                  onPress={() => setImage(null)}
                  style={{ marginTop: 8 }}
                />
              </View>
            </>
          )}
        </Card>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CameraScreen;