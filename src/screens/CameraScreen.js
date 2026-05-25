import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { analyzeBody } from '../services/analysisService';
import { useNavigation } from '@react-navigation/native';
import { SCREEN_NAMES } from '../utils/constants';

const CameraScreen = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      // ignore status for now, UI will show picker
    })();
  }, []);

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (permission.status !== 'granted') {
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      base64: false,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const onAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const res = await analyzeBody(image);
      navigation.navigate(SCREEN_NAMES.PROCESSING, { analysisId: res?.id, payload: res });
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#08080B] p-4">
      <Card className="items-center justify-center flex-1">
        {!image ? (
          <>
            <Text className="text-white text-lg mb-4">Guía: coloca tu cuerpo completo en el marco</Text>
            <Button title="Abrir cámara" onPress={takePhoto} />
          </>
        ) : (
          <>
            <Image source={{ uri: image }} style={{ width: 260, height: 420, borderRadius: 16 }} />
            <View className="mt-4 w-full">
              <Button title="Analizar imagen" onPress={onAnalyze} loading={loading} />
              <Button title="Volver" variant="secondary" onPress={() => setImage(null)} style={{ marginTop: 8 }} />
            </View>
          </>
        )}
      </Card>
    </View>
  );
};

export default CameraScreen;
