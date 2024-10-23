/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      scrollbarHide: {
        '-webkit-scrollbar': 'none', // Chrome, Safari, and Edge
        '-ms-overflow-style': 'none', // IE and Edge
        'scrollbar-width': 'none', // Firefox
      },
      animationDelay: {
        '1': '0.5s',
        '2': '1s',
        '3': '1.5s',
      },
      keyframes: {
        spinOnce: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        softBounce: {
          '0%, 100%': {
            transform: 'translateY(0) scale(1, 1)',
            'animation-timing-function': 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '20%': {
            transform: 'translateY(-10%) scale(1.1, 0.9)', // Stretch upward
          },
          '50%': {
            transform: 'translateY(0) scale(0.9, 1.1)', // Compress on landing
            'animation-timing-function': 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        spinOnce: 'spinOnce 500ms ease-in-out',
        softBounce: 'softBounce 1s infinite', 
        fadeInUp: 'fadeInUp 1s ease-out forwards',

      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
