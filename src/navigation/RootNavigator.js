import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import MainTabs from './MainTabs';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProcessingScreen from '../screens/ProcessingScreen';
import ResultScreen from '../screens/ResultScreen';
import RecommendationScreen from '../screens/RecommendationScreen';
import { SCREEN_NAMES } from '../utils/constants';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const auth = useAuth();

  if (auth.isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!auth.isAuthenticated ? (
        <>
          <Stack.Screen name={SCREEN_NAMES.SPLASH} component={SplashScreen} />
          <Stack.Screen name={SCREEN_NAMES.LOGIN} component={LoginScreen} />
          <Stack.Screen name={SCREEN_NAMES.REGISTER} component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name={SCREEN_NAMES.MAIN_TABS} component={MainTabs} />
          <Stack.Screen name={SCREEN_NAMES.PROCESSING} component={ProcessingScreen} />
          <Stack.Screen name={SCREEN_NAMES.RESULT} component={ResultScreen} />
          <Stack.Screen name={SCREEN_NAMES.RECOMMENDATION} component={RecommendationScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
