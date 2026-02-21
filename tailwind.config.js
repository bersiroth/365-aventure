/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        medieval: ['Cinzel', 'serif'],
      },
      colors: {
        dungeon: {
          dark: '#1a0f0a',
          stone: '#2d2318',
          gold: '#d4af37',
          red: '#8b1a1a',
          blue: '#1e3a5f',
        }
      },
      keyframes: {
        'slide-in-right': {
          '0%': { transform: 'translateX(120%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-out-right': {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(120%)', opacity: '0' },
        },
      },
      animation: {
        'slide-in-right': 'slide-in-right 0.4s ease-out',
        'slide-out-right': 'slide-out-right 0.3s ease-in forwards',
      }
    },
  },
  plugins: [],
}
