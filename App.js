import React from 'react';
import './global.css';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import { GamificationProvider, useGamification } from './src/context/GamificationContext';
import RootNavigator from './src/navigation/RootNavigator';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AchievementToast = () => {
  const { newAchievement } = useGamification();
  if (!newAchievement) return null;
  
  return (
    <View style={{ position: 'absolute', top: 50, left: 20, right: 20, backgroundColor: '#1E1E2E', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5, zIndex: 9999, borderWidth: 1, borderColor: newAchievement.color }}>
      <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: newAchievement.color + '22', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
        <Ionicons name={newAchievement.icon} size={24} color={newAchievement.color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: newAchievement.color, fontSize: 12, fontWeight: 'bold' }}>LOGRO DESBLOQUEADO</Text>
        <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>{newAchievement.title}</Text>
      </View>
    </View>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <GamificationProvider>
        <NavigationContainer>
          <SafeAreaView style={{ flex: 1 }}>
            <RootNavigator />
            <AchievementToast />
            <StatusBar style="light" />
          </SafeAreaView>
        </NavigationContainer>
      </GamificationProvider>
    </AuthProvider>
  );
}
