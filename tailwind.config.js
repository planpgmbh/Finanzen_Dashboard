/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#0000ff',
        scrollbar: {
          track: '#f1f1f1',
          thumb: '#888888',
          'track-dark': '#2d3748',
          'thumb-dark': '#4a5568'
        }
      }
    },
  },
  plugins: [],
};