import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, registerUser } from '../services/authService';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_LOADING':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      };
    case 'AUTH_RESTORE':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'AUTH_LOADED':
      return { ...state, isLoading: false };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore session on app launch
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        const userJson = await AsyncStorage.getItem('auth_user');
        if (token && userJson) {
          const user = JSON.parse(userJson);
          dispatch({ type: 'AUTH_RESTORE', payload: { user, token } });
        } else {
          dispatch({ type: 'AUTH_LOADED' });
        }
      } catch (error) {
        dispatch({ type: 'AUTH_LOADED' });
      }
    };
    restoreSession();
  }, []);

  const login = async (email, password) => {
    dispatch({ type: 'AUTH_LOADING' });
    try {
      // Static local admin login for development/testing
    if (email === 'admin' && password === 'admin') {
      // Intentar cargar usuario previamente guardado
      let savedUser = null;
      try {
        const userJson = await AsyncStorage.getItem('auth_user');
        if (userJson) savedUser = JSON.parse(userJson);
      } catch (e) {}

      // Usar el usuario guardado (con somatotipo si existe) o crear uno por defecto
      const user = savedUser || { 
        id: 'admin', 
        name: 'Admin', 
        email: 'admin', 
        height: 180, 
        weight: 75, 
        age: 30 
      };
      const token = 'local-admin-token';
      await AsyncStorage.setItem('auth_token', token);
      await AsyncStorage.setItem('auth_user', JSON.stringify(user));
      dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } });
      return { user, token };
}
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error.message || 'Error al iniciar sesión' });
      throw error;
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'AUTH_LOADING' });
    try {
      const data = await registerUser(userData);
      await AsyncStorage.setItem('auth_token', data.token);
      await AsyncStorage.setItem('auth_user', JSON.stringify(data.user));
      dispatch({ type: 'AUTH_SUCCESS', payload: data });
      return data;
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error.message || 'Error al registrarse' });
      throw error;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('auth_user');
    await AsyncStorage.removeItem('achievements'); 
    dispatch({ type: 'AUTH_LOGOUT' });
  };

  const updateUser = async (updates) => {
    const updatedUser = { ...state.user, ...updates };
    await AsyncStorage.setItem('auth_user', JSON.stringify(updatedUser));
    dispatch({ type: 'UPDATE_USER', payload: updates });
  };

  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
