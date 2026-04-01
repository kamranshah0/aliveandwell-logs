    /** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f3f5fd',
          100: '#e1e6fb',
          200: '#c3cdf8',
          300: '#a0aff3',
          400: '#7c90ec',
          500: '#607BD8',  // base
          600: '#4f66b7',
          700: '#3f5193',
          800: '#334074',
          900: '#283256',
        },
      },
    },
  },
  plugins: [],
}
