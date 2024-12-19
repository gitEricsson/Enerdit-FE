/** @type {import('tailwindcss').Config} */

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'], // specify the paths
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'custom-lime': '#EAFFE4',
        'custom-l-green': '90FFAE',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
