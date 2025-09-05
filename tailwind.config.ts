import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Satoshi', 'General Sans', 'Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        'dawn-sky': '#fef7ff',
        'deep-slate': '#1e293b',
        'aurora-green': '#10b981',
        'glow-calm-white': '#fefefe',
        'mist-blue': '#dbeafe',
        'ember-orange': '#f97316',
        'lavender-dream': '#c7d2fe',
        'sage-whisper': '#a7f3d0',
        'cosmic-purple': '#8b5cf6',
        'moonstone-gray': '#64748b',
        'warmth-beige': '#fef3c7',
      },
      backgroundImage: {
        'dawn-gradient': 'linear-gradient(135deg, #fdf2f8 0%, #dbeafe 50%, #f0f9ff 100%)',
        'aurora-gradient': 'linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%)',
        'cosmic-gradient': 'linear-gradient(135deg, #1e293b 0%, #475569 50%, #64748b 100%)',
        'ethereal-glow': 'radial-gradient(circle at center, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 4s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'breathe': 'breathe 8s ease-in-out infinite',
        'drift': 'drift 20s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.8s ease-out',
        'slide-in-left': 'slide-in-left 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { 
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
            transform: 'scale(1)',
          },
          '100%': { 
            boxShadow: '0 0 40px rgba(16, 185, 129, 0.8)',
            transform: 'scale(1.05)',
          },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        drift: {
          '0%, 100%': { transform: 'translateX(0px) translateY(0px)' },
          '25%': { transform: 'translateX(20px) translateY(-10px)' },
          '50%': { transform: 'translateX(-15px) translateY(20px)' },
          '75%': { transform: 'translateX(10px) translateY(-5px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { 
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'slide-in-left': {
          '0%': { 
            opacity: '0',
            transform: 'translateX(-30px)',
          },
          '100%': { 
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(16, 185, 129, 0.4)',
        'glow-lg': '0 0 40px rgba(16, 185, 129, 0.6)',
        'ethereal': '0 8px 32px rgba(139, 92, 246, 0.15)',
        'cosmic': '0 8px 32px rgba(30, 41, 59, 0.25)',
      },
    },
  },
  plugins: [],
}
export default config
