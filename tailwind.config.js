/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xs: "400px",
      sm: "650px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        lexend: ["Lexend Deca", "sans-serif"],
        lato: ["Lato", "sans - serif"],
      },
      boxShadow: {
        all: "2px 0px 10px 1px rgba(0, 0, 0, 0.3)",
      },
    },
  },
  plugins: [],
};
