import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGamification, ACHIEVEMENTS } from '../context/GamificationContext';

const AchievementCard = ({ achievement, unlocked }) => {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: unlocked ? 'rgba(108, 92, 231, 0.15)' : '#1E1E2E',
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      opacity: unlocked ? 1 : 0.5,
    }}>
      <View style={{
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: unlocked ? achievement.color : '#2A2A35',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
      }}>
        <Ionicons name={achievement.icon} size={24} color={unlocked ? 'white' : '#8B8BA3'} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{achievement.title}</Text>
        <Text style={{ color: '#8B8BA3', fontSize: 12 }}>{achievement.description}</Text>
      </View>
      {unlocked && <Ionicons name="checkmark-circle" size={24} color="#00E676" />}
    </View>
  );
};

const AchievementsScreen = () => {
  const { unlockedAchievements } = useGamification();

  return (
    <View style={{ flex: 1, backgroundColor: '#08080B', padding: 16 }}>
      <Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold', marginBottom: 8 }}>Logros</Text>
      <Text style={{ color: '#8B8BA3', marginBottom: 20 }}>Completa acciones para desbloquear medallas</Text>
      <FlatList
        data={ACHIEVEMENTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AchievementCard
            achievement={item}
            unlocked={unlockedAchievements.includes(item.id)}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default AchievementsScreen;