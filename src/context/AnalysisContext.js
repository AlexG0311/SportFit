import React, { createContext, useContext, useReducer } from 'react';
import { analyzeBody } from '../services/analysisService';
import { getHistory } from '../services/historyService';
import { getRecommendations } from '../services/recommendationService';

const AnalysisContext = createContext(null);

const initialState = {
  currentAnalysis: null,
  history: [],
  recommendations: [],
  isAnalyzing: false,
  isLoadingHistory: false,
  isLoadingRecommendations: false,
  error: null,
};

const analysisReducer = (state, action) => {
  switch (action.type) {
    case 'ANALYZE_START':
      return { ...state, isAnalyzing: true, error: null };
    case 'ANALYZE_SUCCESS':
      return {
        ...state,
        currentAnalysis: action.payload,
        isAnalyzing: false,
        history: [action.payload, ...state.history],
      };
    case 'ANALYZE_ERROR':
      return { ...state, isAnalyzing: false, error: action.payload };
    case 'HISTORY_LOADING':
      return { ...state, isLoadingHistory: true };
    case 'HISTORY_SUCCESS':
      return { ...state, history: action.payload, isLoadingHistory: false };
    case 'HISTORY_ERROR':
      return { ...state, isLoadingHistory: false, error: action.payload };
    case 'RECOMMENDATIONS_LOADING':
      return { ...state, isLoadingRecommendations: true };
    case 'RECOMMENDATIONS_SUCCESS':
      return { ...state, recommendations: action.payload, isLoadingRecommendations: false };
    case 'RECOMMENDATIONS_ERROR':
      return { ...state, isLoadingRecommendations: false, error: action.payload };
    case 'SET_CURRENT_ANALYSIS':
      return { ...state, currentAnalysis: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AnalysisProvider = ({ children }) => {
  const [state, dispatch] = useReducer(analysisReducer, initialState);

  const analyze = async (imageUri) => {
    dispatch({ type: 'ANALYZE_START' });
    try {
      const data = await analyzeBody(imageUri);
      dispatch({ type: 'ANALYZE_SUCCESS', payload: data });
      return data;
    } catch (error) {
      dispatch({ type: 'ANALYZE_ERROR', payload: error.message || 'Error al analizar' });
      throw error;
    }
  };

  const fetchHistory = async () => {
    dispatch({ type: 'HISTORY_LOADING' });
    try {
      const data = await getHistory();
      dispatch({ type: 'HISTORY_SUCCESS', payload: data });
      return data;
    } catch (error) {
      dispatch({ type: 'HISTORY_ERROR', payload: error.message });
      // Return mock data for demo
      const mockHistory = getMockHistory();
      dispatch({ type: 'HISTORY_SUCCESS', payload: mockHistory });
      return mockHistory;
    }
  };

  const fetchRecommendations = async () => {
    dispatch({ type: 'RECOMMENDATIONS_LOADING' });
    try {
      const data = await getRecommendations();
      dispatch({ type: 'RECOMMENDATIONS_SUCCESS', payload: data });
      return data;
    } catch (error) {
      dispatch({ type: 'RECOMMENDATIONS_ERROR', payload: error.message });
      // Return mock data for demo
      const mockRecs = getMockRecommendations();
      dispatch({ type: 'RECOMMENDATIONS_SUCCESS', payload: mockRecs });
      return mockRecs;
    }
  };

  const setCurrentAnalysis = (analysis) => {
    dispatch({ type: 'SET_CURRENT_ANALYSIS', payload: analysis });
  };

  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  return (
    <AnalysisContext.Provider
      value={{
        ...state,
        analyze,
        fetchHistory,
        fetchRecommendations,
        setCurrentAnalysis,
        clearError,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};

// Mock data for demo/development
const getMockHistory = () => [
  {
    id: '1',
    date: '2026-05-24T10:30:00Z',
    somatotype: 'Mesomorfo',
    accuracy: 92.5,
    bmi: 23.4,
    bodyFat: 15.2,
    muscleMass: 42.1,
  },
  {
    id: '2',
    date: '2026-05-17T14:15:00Z',
    somatotype: 'Mesomorfo',
    accuracy: 89.8,
    bmi: 23.8,
    bodyFat: 16.0,
    muscleMass: 41.5,
  },
  {
    id: '3',
    date: '2026-05-10T09:00:00Z',
    somatotype: 'Endomorfo',
    accuracy: 85.3,
    bmi: 24.5,
    bodyFat: 18.2,
    muscleMass: 40.0,
  },
];

const getMockRecommendations = () => [
  {
    id: '1',
    name: 'Natación',
    description: 'Ejercicio de cuerpo completo ideal para tu tipo corporal.',
    intensity: 'medium',
    icon: 'water-outline',
    benefits: ['Cardio', 'Resistencia', 'Flexibilidad'],
  },
  {
    id: '2',
    name: 'Entrenamiento de Fuerza',
    description: 'Desarrolla masa muscular y mejora tu composición corporal.',
    intensity: 'high',
    icon: 'barbell-outline',
    benefits: ['Fuerza', 'Masa muscular', 'Metabolismo'],
  },
  {
    id: '3',
    name: 'Yoga',
    description: 'Mejora la flexibilidad y reduce el estrés.',
    intensity: 'low',
    icon: 'body-outline',
    benefits: ['Flexibilidad', 'Balance', 'Relajación'],
  },
  {
    id: '4',
    name: 'HIIT',
    description: 'Entrenamiento de alta intensidad para quemar grasa rápidamente.',
    intensity: 'high',
    icon: 'flame-outline',
    benefits: ['Quema grasa', 'Cardio', 'Metabolismo'],
  },
  {
    id: '5',
    name: 'Ciclismo',
    description: 'Excelente para la resistencia cardiovascular y piernas.',
    intensity: 'medium',
    icon: 'bicycle-outline',
    benefits: ['Cardio', 'Piernas', 'Resistencia'],
  },
];

export default AnalysisContext;
