/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // "Notice board" palette — a campus corkboard of sticky notes and price tags.
        paper: '#FFFCF5',
        ink: '#211F35',
        brand: {
          50: '#F1F0FF',
          100: '#E2E0FF',
          200: '#C6C3FF',
          300: '#A29CFF',
          400: '#7C74F5',
          500: '#5B54F0',
          600: '#4740D6',
          700: '#3833A8',
          800: '#2A2680',
        },
        coral: { 100: '#FFE3DE', 400: '#FF8A76', 500: '#FF6B52', 600: '#E5503A' },
        mint: { 100: '#D8F7EE', 400: '#3FD9AF', 500: '#1FB88E', 600: '#159873' },
        sunshine: { 100: '#FFF4D6', 400: '#FFD25E', 500: '#FFC332', 600: '#E8A70F' },
        bubblegum: { 100: '#FFE1EF', 400: '#FF8FC0', 500: '#FF6BAD', 600: '#E84D8F' },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Manrope"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        sticker: '0 2px 0 rgba(33,31,53,0.9), 0 6px 14px rgba(33,31,53,0.12)',
        card: '0 1px 2px rgba(33,31,53,0.04), 0 8px 24px rgba(33,31,53,0.06)',
      },
      backgroundImage: {
        dotgrid: 'radial-gradient(currentColor 1.5px, transparent 1.5px)',
      },
      backgroundSize: {
        dotgrid: '22px 22px',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};