/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',  // ← important
  content: ["./index.html", "./src/**/*.{vue,js,ts}"],
  theme: {
    extend: {},
  },
  plugins: [],
}