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
        institucional: {
          rojo: '#D32F2F',      // rojo institucional
          blanco: '#FFFFFF',    // fondo claro
          negro: '#1A1A1A',     // texto oscuro
        },
      },
    },
  },
  plugins: [],
};