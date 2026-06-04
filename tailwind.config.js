/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50:  '#f6f8f4',
          100: '#e8efe3',
          200: '#d1e0c7',
          300: '#b1cba0',
          400: '#90b37a',
          500: '#7a9f62',
          600: '#62824b',
          700: '#4d663b',
          800: '#3f5331',
          900: '#34442a',
        },
        warm: {
          50:  '#fdfbf8',
          100: '#faf5eb',
          200: '#f5e9d2',
          300: '#edd8b2',
          400: '#e3c18a',
          500: '#d4a76a',
          600: '#c4927e',
          700: '#a07463',
          800: '#856053',
          900: '#6b4d43',
        },
      },
      fontFamily: {
        sans: [
          '"Noto Sans SC"',
          '"SF Pro Display"',
          '"PingFang SC"',
          '"Helvetica Neue"',
          'sans-serif',
        ],
      },
      animation: {
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'check-in': 'checkIn 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
        'float-up': 'floatUp 0.5s ease-out',
      },
      keyframes: {
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        checkIn: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.92)' },
          '100%': { transform: 'scale(1)' },
        },
        floatUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
