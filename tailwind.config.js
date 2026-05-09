/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./assets/js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#09090b', // Zinc 950
          800: '#18181b', // Zinc 900
          700: '#27272a', // Zinc 800
        },
        primary: {
          300: '#f0abfc', // Fuchsia 300
          400: '#e879f9', // Fuchsia 400
          500: '#d946ef', // Fuchsia 500
          600: '#c026d3', // Fuchsia 600
        },
        accent: {
          400: '#22d3ee', // Cyan 400
          500: '#06b6d4', // Cyan 500
          600: '#0891b2', // Cyan 600
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'drift': {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.3s ease-out forwards',
        'drift': 'drift 20s infinite ease-in-out',
        'spin-slow': 'spin 15s linear infinite',
      }
    },
  },
  plugins: [],
}
