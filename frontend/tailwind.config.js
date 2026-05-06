/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif']
      },
      colors: {
        ink: '#17201A',
        pine: '#214E34',
        moss: '#6E8B3D',
        sand: '#F3E8D0',
        cream: '#FFF9EA',
        clay: '#C86F4A',
        fog: '#EEF2E7'
      },
      boxShadow: {
        soft: '0 18px 60px rgba(23, 32, 26, 0.10)',
        card: '0 12px 32px rgba(23, 32, 26, 0.08)'
      }
    }
  },
  plugins: []
};
