/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.jsx",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}", // Explicitly add this for GitHub
    "./*.{js,ts,jsx,tsx}" // This scans EVERY file in your root directory
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