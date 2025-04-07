/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-black': '#070a0d',
        'dark-blue': '#0a192f',
        'darker-blue': '#050d1a',
        'neon-blue': '#00f3ff',
      },
      boxShadow: {
        'neon': '0 0 10px var(--neon-blue)',
        'neon-hover': '0 0 20px var(--neon-blue)',
      },
    },
  },
  plugins: [],
};