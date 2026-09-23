/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        crimson: {
          50: '#fef2f2',
          100: '#fde3e3',
          200: '#fccbcb',
          300: '#f9a5a5',
          400: '#f47171',
          500: '#ea4444',
          600: '#d52525',
          700: '#b31c1c',
          800: '#991a1e', // Primary Red
          900: '#7f1b1f',
          950: '#46090a',
        },
        silver: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        obsidian: {
          950: '#0a0708',
          900: '#140c0e',
          800: '#1f1316',
          700: '#2d1b20',
          600: '#3d242b',
        },
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        poster: ['Lilita One', 'cursive'],
      },
      boxShadow: {
        'crimson-glow': '0 8px 30px rgba(153, 26, 30, 0.35)',
        'crimson-glow-lg': '0 12px 40px rgba(153, 26, 30, 0.5)',
        'white-glow': '0 8px 30px rgba(255, 255, 255, 0.2)',
        'poster-drop': '0 25px 60px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
};
