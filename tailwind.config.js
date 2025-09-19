/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7f0',
          100: '#fdedd8',
          200: '#fad7b0',
          300: '#f7ba7e',
          400: '#f3924a',
          500: '#f16d1f',
          600: '#e25115',
          700: '#bb3e13',
          800: '#943218',
          900: '#772a16',
        },
        cigar: {
          brown: '#8B4513',
          gold: '#DAA520',
          dark: '#2C1810',
          light: '#F5E6D3'
        }
      },
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
      }
    },
  },
  plugins: [],
}
