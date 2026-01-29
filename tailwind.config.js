/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        }
      },
      fontFamily: {
        sans: ['Lexend', 'sans-serif'],
      },
      fontSize: {
        // Override small sizes to be more readable for children
        'sm': ['1rem', { lineHeight: '1.5' }],      // 16px instead of 14px
        'base': ['1.125rem', { lineHeight: '1.6' }], // 18px instead of 16px
        'lg': ['1.25rem', { lineHeight: '1.6' }],    // 20px
        'xl': ['1.5rem', { lineHeight: '1.5' }],     // 24px
        '2xl': ['1.75rem', { lineHeight: '1.4' }],   // 28px
        '3xl': ['2rem', { lineHeight: '1.3' }],      // 32px
        '4xl': ['2.5rem', { lineHeight: '1.2' }],    // 40px
        '5xl': ['3rem', { lineHeight: '1.2' }],      // 48px
      }
    },
  },
  plugins: [],
}
