/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green:         '#1BA882',
          'green-dark':  '#148F6D',
          'green-deep':  '#0D5040',
          'green-mid':   '#21C49A',
          'green-light': '#2DD4B0',
          'green-pale':  '#E0FAF5',
          gray:          '#F4FAF8',
          'gray-mid':    '#64B09C',
          'gray-dark':   '#1D6050',
        },
      },
      fontFamily: {
        sans:    ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Sora"', 'sans-serif'],
      },
      keyframes: {
        'fade-in-down': {
          '0%':   { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-left': {
          '0%':   { opacity: '0', transform: 'translateX(-32px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'progress': {
          '0%':   { width: '0%' },
          '100%': { width: '100%' },
        },
        'marquee': {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-in-down':  'fade-in-down 0.5s ease-out both',
        'fade-in-up':    'fade-in-up 0.6s ease-out both',
        'slide-in-left': 'slide-in-left 0.6s ease-out both',
        'progress':      'progress linear both',
        'marquee':       'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
}