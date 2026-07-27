/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        pitch: {
          DEFAULT: '#1B4332',
          light: '#2D6A4F',
          dark: '#122A20',
        },
        willow: {
          DEFAULT: '#C9A574',
          light: '#E3CBA0',
          dark: '#A9824F',
        },
        leather: {
          DEFAULT: '#A6303C',
          dark: '#7D2129',
        },
        chalk: '#F7F5F0',
        ink: {
          DEFAULT: '#161616',
          soft: '#3A3A38',
        },
        gold: '#D4A73D',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'seam-line': "repeating-linear-gradient(90deg, transparent, transparent 6px, currentColor 6px, currentColor 8px)",
      },
    },
  },
  plugins: [],
};
