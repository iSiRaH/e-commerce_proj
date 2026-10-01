/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#f7f4ea',
          cream: '#fdfbf7',
          sage: '#a8bba3',
          'sage-dark': '#8da588',
          terracotta: '#b87c4c',
          'terracotta-dark': '#9b643a',
          peach: '#ebd9d1',
          'peach-dark': '#dfc3b7',
          lavender: '#9d96cb',
          'lavender-dark': '#847cb5',
          dark: '#1e293b',
          charcoal: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}