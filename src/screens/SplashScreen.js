import React, { useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { SCREEN_NAMES } from '../utils/constants';

const SplashScreen = () => {
  const navigation = useNavigation();
  const spin = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1400,
        useNativeDriver: true,
      })
    ).start();

    const t = setTimeout(() => {
      navigation.replace(SCREEN_NAMES.LOGIN);
    }, 1600);

    return () => clearTimeout(t);
  }, []);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View className="flex-1 items-center justify-center bg-[#08080B]">
      <Animated.View style={{ transform: [{ rotate }] }} className="mb-6">
        <LinearGradient colors={["#6C5CE7","#00D2FF"]} style={{ width: 110, height: 110, borderRadius: 28, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 20 }}>S</Text>
        </LinearGradient>
      </Animated.View>
      <Text className="text-white text-xl font-bold">SporTif</Text>
      <Text className="text-[#8B8BA3] mt-2">Smart Body Analysis</Text>
    </View>
  );
};

export default SplashScreen;
