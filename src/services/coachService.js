import api from './api';

export const sendChatMessage = async (messages, somatotype, heightM, weightKg, age, gender) => {
  const payload = {
    messages,
    somatotype,
    height_m: heightM,
    weight_kg: weightKg,
    age,
    gender
  };

  const response = await api.post('/chat', payload);
  return response.data;
};

export const generatePlanner = async (somatotype, daysPerWeek, goal, level) => {
  const payload = {
    somatotype,
    days_per_week: daysPerWeek,
    goal,
    level
  };

  const response = await api.post('/planner/generate', payload, {
    timeout: 60000, // May take time to generate JSON
  });
  return response.data;
};
