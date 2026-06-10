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
import HistoryScreen from '../screens/HistoryScreen';
import AchievementsScreen from '../screens/AchievementsScreen';
import { SCREEN_NAMES } from '../utils/constants';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) return <SplashScreen />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
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
          <Stack.Screen name={SCREEN_NAMES.HISTORY} component={HistoryScreen} />
          <Stack.Screen name={SCREEN_NAMES.ACHIEVEMENTS} component={AchievementsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;