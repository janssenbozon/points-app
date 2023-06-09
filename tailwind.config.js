/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./pages/_app.js.js",
    "./pages/Homepage.js",
    "./pages/Login.js",
    "./pages/createNewUser.js"
    // add components here if needed
  ],
  theme: {
    extend: {
      colors: {
        ...colors,
      },
      fontFamily: {
        lato: "'Lato', sans-serif",
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require("daisyui"),
  ],
}
