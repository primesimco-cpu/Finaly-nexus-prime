import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // NEXUS AI design tokens — koyu tema
        nexus: {
          bg: '#050508',
          surface: '#0d0d14',
          surface2: '#13131e',
          surface3: '#1a1a2a',
          border: 'rgba(255,255,255,0.06)',
          border2: 'rgba(255,255,255,0.12)',
          text: '#f0f0f8',
          muted: '#7070a0',
          dim: '#404060',
          accent: '#7c6cfc',
          accent2: '#a78bfa',
          accent3: '#c4b5fd',
          teal: '#2dd4bf',
          amber: '#fbbf24',
          coral: '#fb7185',
          green: '#4ade80',
        },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'nx': '12px',
        'nx2': '16px',
        'nx3': '20px',
      },
      backgroundImage: {
        'gradient-nexus': 'linear-gradient(135deg, #7c6cfc, #2dd4bf)',
        'gradient-nexus-text': 'linear-gradient(135deg, #a78bfa, #2dd4bf)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
