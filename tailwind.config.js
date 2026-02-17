/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./core/**/*.{js,ts,jsx,tsx}",
    "./modules/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-family)', 'sans-serif'],
        hand: ['Patrick Hand', 'cursive'],
      },
      colors: {
        mimi: {
          primary: 'var(--primary)',
          secondary: 'var(--secondary)',
          accent: 'var(--accent)',
          surface: 'var(--surface)',
          elevated: 'var(--surface-elevated)',
          app: 'var(--bg-app)',
          'text-primary': 'var(--text-primary)',
          'text-secondary': 'var(--text-secondary)',
          'text-muted': 'var(--text-muted)',
          'text-on-primary': 'var(--text-on-primary)',
          'text-on-accent': 'var(--text-on-accent)',
        }
      },
      borderRadius: {
        'mimi': 'var(--radius-base)',
      },
      animation: {
        'aurora': 'aurora 15s ease infinite',
        'shimmer': 'shimmer 2s infinite',
        'breathing': 'breathing 4s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
        'jelly': 'jelly 0.5s ease-in-out',
        'float-slow': 'float-slow 6s ease-in-out infinite',
      },
      keyframes: {
        aurora: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        breathing: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
        },
        jelly: {
          '0%': { transform: 'scale(1, 1)' },
          '30%': { transform: 'scale(1.25, 0.75)' },
          '40%': { transform: 'scale(0.75, 1.25)' },
          '50%': { transform: 'scale(1.15, 0.85)' },
          '65%': { transform: 'scale(0.95, 1.05)' },
          '75%': { transform: 'scale(1.05, 0.95)' },
          '100%': { transform: 'scale(1, 1)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    }
  },
  plugins: [],
}