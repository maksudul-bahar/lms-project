/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",   // indigo-500
        accent: "#22c55e",    // green-500
      },
    },
  },
  plugins: [],
};
