/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'gray-50': '#f9fafb',
        'gray-100': '#f3f4f6',
        'gray-200': '#e5e7eb',
        'gray-300': '#d1d5db',
        'gray-400': '#9ca3af',
        'gray-500': '#6b7280',
        'gray-600': '#4b5563',
        'gray-700': '#374151',
        'gray-800': '#1f2937',
        'gray-900': '#111827',
      },
      animation: {
        'moon-rotate': 'moonRotate 20s linear infinite',
        'lunar-eclipse': 'lunarEclipseReal 8s ease-in-out infinite',
        'gradient-shift': 'gradientShift 3s ease infinite',
        'pulse-slow': 'pulse 1.5s ease-in-out infinite',
        'status-pulse': 'statusPulse 1.5s ease-in-out infinite',
        'blink': 'blink 0.8s infinite',
        'spin': 'spin 0.8s linear infinite',
      },
      keyframes: {
        moonRotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        lunarEclipseReal: {
          '0%': { boxShadow: 'inset 0 0 0 0 rgba(15,15,26,0)' },
          '25%': { boxShadow: 'inset 8px 0 0 0 rgba(15,15,26,0.7)' },
          '50%': { boxShadow: 'inset 18px 0 0 0 rgba(15,15,26,0.95)' },
          '75%': { boxShadow: 'inset 8px 0 0 0 rgba(15,15,26,0.7)' },
          '100%': { boxShadow: 'inset 0 0 0 0 rgba(15,15,26,0)' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        statusPulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.2)' },
        },
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        spin: {
          'to': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}
