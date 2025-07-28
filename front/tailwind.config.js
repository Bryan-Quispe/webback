/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primario: '#1C2C54', // Azul Marino
        secundario: '#6E1E2B', // Vino Oscuro
        fondoClaro: '#F9F9F6', // Blanco Hueso
        grisNeutro: '#A0A0A0', // Gris Medio
        enfasis: '#C9A66B', // Dorado Suave
        exito: '#4CAF50', // Verde Suave
        error: '#C0392B', // Rojo Suave
      },
    },
  },
  plugins: [],
};
