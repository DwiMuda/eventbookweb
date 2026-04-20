/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        display: ['"Syne"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#e0eaff',
          200: '#c7d7fd',
          300: '#a5bbfb',
          400: '#8098f8',
          500: '#5c72f3',
          600: '#4253e8',
          700: '#3641d4',
          800: '#2d36aa',
          900: '#293386',
        },
        surface: {
          0: '#ffffff',
          50: '#f8f9fc',
          100: '#f1f3f9',
          200: '#e4e8f2',
          300: '#d0d7e8',
        },
        ink: {
          DEFAULT: '#111827',
          muted: '#6b7280',
          faint: '#9ca3af',
        },
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'card-md': '0 4px 16px 0 rgb(0 0 0 / 0.08)',
        'card-lg': '0 8px 32px 0 rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
}
