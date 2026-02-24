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
        'dice-shake': {
          '0%, 100%': { transform: 'rotate(0deg) scale(1)' },
          '25%': { transform: 'rotate(-8deg) scale(1.08)' },
          '75%': { transform: 'rotate(8deg) scale(0.95)' },
        },
      },
      animation: {
        'slide-in-right': 'slide-in-right 0.4s ease-out',
        'slide-out-right': 'slide-out-right 0.3s ease-in forwards',
        'dice-shake': 'dice-shake 0.12s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
