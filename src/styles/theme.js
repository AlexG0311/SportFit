export const COLORS = {
  dark: {
    bg: '#0A0A0F',
    surface: '#12121A',
    surface2: '#1A1A25',
    border: '#2A2A3A',
  },
  accent: {
    primary: '#6C5CE7',
    light: '#8B7CF7',
    dark: '#5A4BD6',
  },
  cyan: {
    primary: '#00D2FF',
    light: '#33DDFF',
    dark: '#00B8E6',
  },
  success: '#00E676',
  warning: '#FFD600',
  error: '#FF5252',
  text: {
    primary: '#FFFFFF',
    secondary: '#8B8BA3',
    tertiary: '#5A5A72',
  },
  gradient: {
    accent: ['#6C5CE7', '#00D2FF'],
    accentAlt: ['#8B7CF7', '#6C5CE7'],
    dark: ['#0A0A0F', '#12121A'],
    card: ['rgba(18, 18, 26, 0.8)', 'rgba(26, 26, 37, 0.6)'],
    success: ['#00E676', '#00C853'],
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 40,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  lg: {
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  glow: {
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
};
