const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-montserrat)", ...fontFamily.sans],
      },
      colors: {
        brand: {
          red: "#E50914",
          dark: "#141414",
          gray: "#E5E5E5",
        },
      },
      animation: {
        'pulse-opacity': 'pulse-opacity 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-opacity': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      }
    },
  },
  plugins: [],
}