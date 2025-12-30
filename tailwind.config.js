/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mech: {
          bg: '#1E1E1E',
          grid: '#2D2D2D',
          text: '#D4D4D4',
          blue: '#569CD6',
          orange: '#CE9178',
          green: '#6A9955',
          cyan: '#4EC9B0',
          gold: '#FFCC00',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      animation: {
        'scan': 'scan 3s linear infinite',
        'progress': 'progress 2.5s cubic-bezier(0.76, 0, 0.24, 1) forwards',
      },
      keyframes: {
        scan: {
          '0%': { top: '-10%', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { top: '110%', opacity: '0' },
        },
        progress: {
          'to': { transform: 'translateX(0%)' },
        }
      },
      backgroundImage: {
        'grid-pattern': `
          linear-gradient(#2D2D2D 1px, transparent 1px),
          linear-gradient(90deg, #2D2D2D 1px, transparent 1px)
        `,
      }
    },
  },
  plugins: [],
}