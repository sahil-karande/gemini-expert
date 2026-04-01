/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.jsx", // THIS IS CRITICAL: Since App.jsx is in the root
    "./src/**/*.{js,ts,jsx,tsx}", // THIS SCANS YOUR COMPONENTS
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