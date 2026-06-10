import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

  // Load history from AsyncStorage on mount
  useEffect(() => {
    const loadLocalHistory = async () => {
      try {
        const stored = await AsyncStorage.getItem('analysis_history');
        if (stored) {
          const parsed = JSON.parse(stored);
          dispatch({ type: 'HISTORY_SUCCESS', payload: parsed });
          if (parsed.length > 0) {
            dispatch({ type: 'SET_CURRENT_ANALYSIS', payload: parsed[0] });
          }
        }
      } catch (e) {
        console.error('Failed to load history', e);
      }
    };
    loadLocalHistory();
  }, []);

  const analyze = async (imageUri, gender, heightM, weightKg, age = null) => {
    dispatch({ type: 'ANALYZE_START' });
    try {
      const data = await analyzeBody(imageUri, gender, heightM, weightKg, age);
      dispatch({ type: 'ANALYZE_SUCCESS', payload: data });
      
      // Save to local storage
      const newHistory = [data, ...state.history].slice(0, 10); // Keep last 10
      await AsyncStorage.setItem('analysis_history', JSON.stringify(newHistory));
      
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
      // Fallback to state history (already loaded from storage)
      dispatch({ type: 'HISTORY_SUCCESS', payload: state.history });
      return state.history;
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
      return [];
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

export default AnalysisContext;
