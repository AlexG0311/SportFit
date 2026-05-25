export const API_BASE_URL = 'http://192.168.1.100:8000';

export const SOMATOTYPES = {
  ECTOMORPH: 'Ectomorfo',
  MESOMORPH: 'Mesomorfo',
  ENDOMORPH: 'Endomorfo',
};

export const SOMATOTYPE_DESCRIPTIONS = {
  Ectomorfo: 'Cuerpo delgado, metabolismo rápido, dificultad para ganar masa muscular.',
  Mesomorfo: 'Cuerpo atlético, facilidad para ganar músculo y perder grasa.',
  Endomorfo: 'Cuerpo robusto, tendencia a acumular grasa, huesos grandes.',
};

export const SOMATOTYPE_COLORS = {
  Ectomorfo: '#00D2FF',
  Mesomorfo: '#6C5CE7',
  Endomorfo: '#FF5252',
};

export const BMI_CATEGORIES = [
  { label: 'Bajo peso', min: 0, max: 18.5, color: '#00D2FF' },
  { label: 'Normal', min: 18.5, max: 25, color: '#00E676' },
  { label: 'Sobrepeso', min: 25, max: 30, color: '#FFD600' },
  { label: 'Obesidad', min: 30, max: 100, color: '#FF5252' },
];

export const INTENSITY_LEVELS = {
  low: { label: 'Baja', color: '#00E676', icon: 'flash-outline' },
  medium: { label: 'Media', color: '#FFD600', icon: 'flash' },
  high: { label: 'Alta', color: '#FF5252', icon: 'flash' },
};

export const SCREEN_NAMES = {
  SPLASH: 'Splash',
  LOGIN: 'Login',
  REGISTER: 'Register',
  HOME: 'Home',
  CAMERA: 'Camera',
  PROCESSING: 'Processing',
  RESULT: 'Result',
  RECOMMENDATION: 'Recommendation',
  HISTORY: 'History',
  PROFILE: 'Profile',
  MAIN_TABS: 'MainTabs',
  AUTH_STACK: 'AuthStack',
  HOME_STACK: 'HomeStack',
};
