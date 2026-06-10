import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GamificationContext = createContext(null);

export const ACHIEVEMENTS = [
  { id: 'first_scan', title: 'Primer Paso', description: 'Realizaste tu primer escaneo corporal', icon: 'scan', color: '#6C5CE7' },
  { id: 'coach_chat', title: 'Alumno Curioso', description: 'Hablas con tu AI Coach por primera vez', icon: 'chatbubbles', color: '#00D2FF' },
  { id: 'planner_gen', title: 'Mente Maestra', description: 'Generaste tu primer plan semanal', icon: 'calendar', color: '#FFD600' },
  { id: 'workout_done', title: 'Sudando la Gota Gorda', description: 'Completaste tu primer entrenamiento', icon: 'barbell', color: '#FF5252' },
];

export const GamificationProvider = ({ children }) => {
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [newAchievement, setNewAchievement] = useState(null);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      const stored = await AsyncStorage.getItem('achievements');
      if (stored) setUnlockedAchievements(JSON.parse(stored));
    } catch (e) {
      console.error('Failed to load achievements', e);
    }
  };

  const unlockAchievement = async (achievementId) => {
    if (unlockedAchievements.includes(achievementId)) return;
    const updated = [...unlockedAchievements, achievementId];
    setUnlockedAchievements(updated);
    const achievementDef = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (achievementDef) {
      setNewAchievement(achievementDef);
      setTimeout(() => setNewAchievement(null), 4000);
    }
    try {
      await AsyncStorage.setItem('achievements', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save achievement', e);
    }
  };

  return (
    <GamificationContext.Provider value={{
      unlockedAchievements,
      unlockAchievement,
      newAchievement,
      clearNewAchievement: () => setNewAchievement(null)
    }}>
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) throw new Error('useGamification must be used within a GamificationProvider');
  return context;
};