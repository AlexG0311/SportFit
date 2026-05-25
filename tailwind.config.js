/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0A0A0F',
          surface: '#12121A',
          'surface-2': '#1A1A25',
          border: '#2A2A3A',
        },
        accent: {
          DEFAULT: '#6C5CE7',
          light: '#8B7CF7',
          dark: '#5A4BD6',
        },
        cyan: {
          DEFAULT: '#00D2FF',
          light: '#33DDFF',
          dark: '#00B8E6',
        },
        success: '#00E676',
        warning: '#FFD600',
        error: '#FF5252',
        'text-primary': '#FFFFFF',
        'text-secondary': '#8B8BA3',
        'text-tertiary': '#5A5A72',
      },
      fontFamily: {
        sans: ['Inter', 'System'],
        bold: ['Inter-Bold', 'System'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};
