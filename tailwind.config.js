/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ["./src/**/*.html", "./src/**/*.ejs", "./src/**/*.js"],
  content: ["./src/*.{html,js}", "./src/**/*.{html,js}"],

  theme: {
    extend: {},
  },
  plugins: [],
};
