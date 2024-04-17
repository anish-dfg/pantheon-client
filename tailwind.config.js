/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#fff",
        black: "#000",
        transparent: "transparent",
        blue: {
          100: "#f0f7ff",
          200: "#dee8f4",
          300: "#dae5f2",
          400: "#262dd1",
          450: "#3992E5",
          500: "#0e159e",
          600: "#181d7a",
          700: "#090c45",
          800: "#06082d",
        },
        purple: {
          100: "#dedff8",
          200: "#d1d3ff",
          300: "#5f65e5",
          400: "#3f44a4",
        },
        pink: {
          100: "#feeaf0",
          200: "#fbb1c7",
          300: "#f52c68",
        },
        gray: {
          100: "#f5f5f5",
          400: "#2B2B2B",
          500: "#252729",
          900: "#121214",
        },
      },
      fontFamily: {
        sans: ["Inter"],
      },
      screens: {
        sm: "640px",
        // => @media (min-width: 640px) { ... }

        md: "768px",
        // => @media (min-width: 768px) { ... }

        lg: "1024px",
        // => @media (min-width: 1024px) { ... }

        xl: "1280px",
        // => @media (min-width: 1280px) { ... }

        "2xl": "1536px",
        // => @media (min-width: 1536px) { ... }
      },
    },
  },
  plugins: [],
};
