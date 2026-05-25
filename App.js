import React from 'react';
import './global.css';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <SafeAreaView style={{ flex: 1 }}>
          <RootNavigator />
          <StatusBar style="light" />
        </SafeAreaView>
      </NavigationContainer>
    </AuthProvider>
  );
}
