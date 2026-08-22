/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        lightblue: {
          50: '#F0F8FF',
          100: '#E6F2FF',
          200: '#ADD8E6', // Light Blue primary background theme
          300: '#87CEEB',
          400: '#6495ED',
          500: '#1E88E5',
          600: '#1565C0',
          700: '#0D47A1',
          800: '#0A377B',
          900: '#051C3F',
        },
        ayush: {
          50: 'var(--ayush-50, #E6F3FA)',
          100: 'var(--ayush-100, #CCE7F5)',
          200: 'var(--ayush-200, #ADD8E6)',
          500: 'var(--ayush-500, #1E88E5)',
          600: 'var(--ayush-600, #1565C0)',
          700: 'var(--ayush-700, #0D47A1)',
          800: 'var(--ayush-800, #0A377B)',
          900: 'var(--ayush-900, #051C3F)',
        },
        teal: {
          500: 'var(--teal-500, #0284C7)',
          600: 'var(--teal-600, #0369A1)',
        },
        accent: {
          gold: '#D4AF37',
          amber: '#F59E0B',
          emerald: '#0284C7',
          rose: '#F43F5E'
        }
      },
    },
  },
  plugins: [],
};
