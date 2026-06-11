import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';
import { generatePlanner } from '../services/coachService';

const PlannerScreen = () => {
  const { user } = useAuth();
  const { unlockAchievement } = useGamification();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [completedDays, setCompletedDays] = useState({});

  const handleGenerate = async () => {
    if (!user?.somatotype) return;
    setLoading(true);
    try {
      
      const response = await generatePlanner(
        user.somatotype,
        4, // Default to 4 days for now
        "ganar masa muscular y fuerza", 
        "intermedio"
      );

      if (response.success && response.plan) {
        setPlan(response.plan);
        unlockAchievement('planner_gen');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (dayIndex) => {
    const newCompletedDays = { ...completedDays, [dayIndex]: !completedDays[dayIndex] };
    setCompletedDays(newCompletedDays);
    
    // Si completan al menos un día
    if (newCompletedDays[dayIndex]) {
      unlockAchievement('workout_done');
    }
  };

  if (!user?.somatotype) {
    return (
      <View style={{ flex: 1, backgroundColor: '#08080B', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Ionicons name="calendar-outline" size={64} color="#2A2A35" style={{ marginBottom: 16 }} />
        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>Planner Bloqueado</Text>
        <Text style={{ color: '#8B8BA3', textAlign: 'center' }}>
          Completa el cuestionario de somatotipo para que podamos generar tu rutina perfecta.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#08080B' }}>
      <View style={{ padding: 16, paddingTop: 20, backgroundColor: '#15151A', borderBottomWidth: 1, borderBottomColor: '#1E1E2E' }}>
        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>Tu Semana</Text>
        <Text style={{ color: '#8B8BA3' }}>Rutina basada en tu somatotipo ({user.somatotype})</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {!plan && !loading && (
          <Card style={{ alignItems: 'center', padding: 30, marginTop: 20 }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255, 214, 0, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
              <Ionicons name="calendar" size={32} color="#FFD600" />
            </View>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
              Genera tu Plan Ideal
            </Text>
            <Text style={{ color: '#8B8BA3', textAlign: 'center', marginBottom: 20, lineHeight: 20 }}>
              Nuestra IA creará una rutina de 7 días exacta para tu tipo de cuerpo.
            </Text>
            <Button title="Generar Rutina Semanal" onPress={handleGenerate} />
          </Card>
        )}

        {loading && (
          <View style={{ marginTop: 60, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#FFD600" />
            <Text style={{ color: 'white', marginTop: 16, fontWeight: 'bold' }}>Armando rutina inteligente...</Text>
            <Text style={{ color: '#8B8BA3', marginTop: 8 }}>Analizando proporciones y objetivos</Text>
          </View>
        )}

        {plan && !loading && (
          <View>
            <Button title="Regenerar Rutina" variant="secondary" onPress={handleGenerate} style={{ marginBottom: 16 }} />
            
            {plan.map((day, index) => {
              const isRestDay = day.type.toLowerCase().includes('descanso') || day.type.toLowerCase().includes('rest');
              const isCompleted = completedDays[day.day];
              
              return (
                <View key={day.day} style={{ flexDirection: 'row', marginBottom: 16 }}>
                  {/* Timeline logic */}
                  <View style={{ width: 40, alignItems: 'center' }}>
                    <TouchableOpacity 
                      onPress={() => !isRestDay && toggleDay(day.day)}
                      disabled={isRestDay}
                      style={{ 
                        width: 30, 
                        height: 30, 
                        borderRadius: 15, 
                        backgroundColor: isCompleted ? '#00E676' : (isRestDay ? '#2A2A35' : '#1E1E2E'), 
                        borderWidth: isCompleted || isRestDay ? 0 : 2,
                        borderColor: '#FFD600',
                        justifyContent: 'center', 
                        alignItems: 'center',
                        zIndex: 2
                      }}
                    >
                      {isCompleted ? <Ionicons name="checkmark" size={18} color="black" /> : 
                       (isRestDay ? <Ionicons name="bed-outline" size={16} color="#8B8BA3" /> : 
                       <Text style={{ color: '#FFD600', fontWeight: 'bold', fontSize: 12 }}>{day.day}</Text>)}
                    </TouchableOpacity>
                    {index !== plan.length - 1 && (
                      <View style={{ width: 2, flex: 1, backgroundColor: isCompleted ? '#00E676' : '#2A2A35', marginTop: -4, marginBottom: -4, zIndex: 1 }} />
                    )}
                  </View>

                  {/* Day Content */}
                  <Card style={{ flex: 1, marginLeft: 8, opacity: isCompleted || isRestDay ? 0.7 : 1, padding: 14 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, textDecorationLine: isCompleted ? 'line-through' : 'none' }}>
                        Día {day.day}: {day.type}
                      </Text>
                      {isRestDay && <Text style={{ color: '#8B8BA3', fontSize: 12 }}>Descanso</Text>}
                    </View>
                    <Text style={{ color: '#8B8BA3', fontSize: 13, marginBottom: 10 }}>{day.focus}</Text>
                    
                    {!isRestDay && day.exercises && day.exercises.map((ex, i) => (
                      <View key={i} style={{ flexDirection: 'row', marginTop: 8, alignItems: 'flex-start' }}>
                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFD600', marginTop: 6, marginRight: 8 }} />
                        <View style={{ flex: 1 }}>
                          <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>{ex.name}</Text>
                          <View style={{ flexDirection: 'row', marginTop: 2 }}>
                            {ex.sets && ex.reps && <Text style={{ color: '#aaa', fontSize: 12, marginRight: 12 }}>{ex.sets} sets x {ex.reps}</Text>}
                            {ex.duration_mins && <Text style={{ color: '#aaa', fontSize: 12 }}>⏱ {ex.duration_mins} min</Text>}
                          </View>
                          {ex.description && <Text style={{ color: '#8B8BA3', fontSize: 12, marginTop: 2 }}>{ex.description}</Text>}
                        </View>
                      </View>
                    ))}
                  </Card>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default PlannerScreen;
