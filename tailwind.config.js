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
      }
    },
  },
  plugins: [],
}
