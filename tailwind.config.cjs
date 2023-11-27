/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-tailwindcss-select/dist/index.esm.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui"), require("tailwind-animatecss")],

  daisyui: {
    styled: true,
    themes: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    themes: [
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "luxury",
      "corporate",
      "business",
      "night",
    ],
    darkTheme: "corporate",
  },
};
