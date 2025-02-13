/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        sage: {
          50: '#f6f7f6',
          100: '#e3e7e3',
          200: '#c5cdc5',
          300: '#a7b3a7',
          400: '#899989',
          500: '#6b7f6b',
          600: '#566656',
          700: '#404c40',
          800: '#2b332b',
          900: '#151915',
        },
        cream: {
          50: '#fdfbf7',
          100: '#faf6ed',
          200: '#f5ecdb',
          300: '#f0e2c9',
          400: '#ebd8b7',
          500: '#e6cea5',
        },
        mint: {
          50: '#f2f8f6',
          100: '#e6f1ed',
          200: '#cce3db',
          300: '#b3d5c9',
          400: '#99c7b7',
          500: '#80b9a5',
          600: '#669b87',
          700: '#4d7d69',
          800: '#335f4b',
          900: '#1a412d',
        },
      },
    },
  },
  plugins: [],
};
