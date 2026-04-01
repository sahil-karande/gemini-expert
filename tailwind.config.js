/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.jsx",              // Added: Scans App.jsx in root
    "./src/**/*.{js,ts,jsx,tsx}", // Scans everything in src (including components)
  ],
  theme: {
    extend: {
      colors: {
        charcoal: "#121212",
        electricBlue: "#00E5FF",
        royalPurple: "#7000FF",
      },
    },
  },
  plugins: [],
}