import AsyncStorage from '@react-native-async-storage/async-storage';

const QUIZ_HISTORY_KEY = 'quiz_history';
const STREAK_KEY = 'app_streak';

export const saveQuizResult = async ({ somatotype, scores, recommendations }) => {
  const history = await getQuizHistory();
  const entry = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    somatotype,
    scores,
    recommendations,
    recommendationCount: recommendations?.length || 0,
  };
  const updated = [entry, ...history].slice(0, 20);
  await AsyncStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(updated));
  await updateStreak();
  return entry;
};

export const getQuizHistory = async () => {
  try {
    const stored = await AsyncStorage.getItem(QUIZ_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const getLatestQuizResult = async () => {
  const history = await getQuizHistory();
  return history[0] || null;
};

export const updateStreak = async () => {
  try {
    const today = new Date().toDateString();
    const stored = await AsyncStorage.getItem(STREAK_KEY);
    const data = stored ? JSON.parse(stored) : { count: 0, lastDate: null };

    if (data.lastDate === today) return data.count;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const wasYesterday = data.lastDate === yesterday.toDateString();

    const count = wasYesterday ? data.count + 1 : 1;
    const updated = { count, lastDate: today };
    await AsyncStorage.setItem(STREAK_KEY, JSON.stringify(updated));
    return count;
  } catch {
    return 1;
  }
};

export const getStreak = async () => {
  try {
    const stored = await AsyncStorage.getItem(STREAK_KEY);
    if (!stored) return 0;
    const data = JSON.parse(stored);
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (data.lastDate === today || data.lastDate === yesterday.toDateString()) {
      return data.count;
    }
    return 0;
  } catch {
    return 0;
  }
};
