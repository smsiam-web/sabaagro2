/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./admin/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{html,js}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#036638",
        sub: "#C1DEC6",
        "sub-title": "#666666",
        title: "#222222",
        mid: "#555555",
        oranges: "#FA582C",
        greens: "#669900",
      },
    },
  },
  plugins: [require(`@tailwindcss/typography`)],
};
