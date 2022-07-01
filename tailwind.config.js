/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/_app.js.js",
    "./pages/Homepage.js"
    // add components here if needed
  ],
  theme: {
    extend: {
      fontFamily: {
        lato: "'Lato', sans-serif",
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
