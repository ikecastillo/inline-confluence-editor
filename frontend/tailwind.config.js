/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'confluence-blue': '#0052CC',
        'confluence-gray': '#42526E',
        'confluence-light-gray': '#F4F5F7',
      }
    },
  },
  plugins: [],
} 