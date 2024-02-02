/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      screens: {
        xs: "480px",
        bmd: "968px",
        lmd: "880px",
      },
      colors: {
        primary: "#25D366",
        secondary: "#38d39f",
        danger: "#f44336",
        border: {
          100: "#cec9c1",
        },
        cblack: {
          300: "#00000080",
          400: "#111B21",
          500: "#1c1e21",
        },
        cgrey: {
          200: "#edecec",
          300: "#d0d1d3",
          400: "#d9d9d9",
          500: "#999",
        },
        cyellow: {
          400: "#FFEBCF",
        },
        cwhite: {
          500: "#F0F4F9",
        },
      },
      transformOrigin: {
        "bottom-center": "bottom center",
      },
      transitionTimingFunction: {
        wavy: "cubic-bezier(0.66, 0, 0.34, 1)",
      },
      boxShadow: {
        sd1: "0px 5px 15px rgba(0, 0, 0, 0.2)",
      },
    },
  },
  important: true,
  plugins: [],
};
