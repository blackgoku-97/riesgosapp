/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        institucional: {
          rojo: '#D32F2F',
          blanco: '#FFFFFF',
          blancoOscuro: '#121212',
          negro: '#1A1A1A',
          negroClaro: '#F5F5F5',
        },
      },
    },
  },
  plugins: [],
}