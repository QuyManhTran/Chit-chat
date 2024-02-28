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
        toastify: "#757575",
        border: {
          100: "#cec9c1",
        },
        cblack: {
          200: "#54656F",
          300: "#00000080",
          400: "#111B21",
          500: "#1c1e21",
        },
        cgrey: {
          50: "#F0F2F5",
          100: "#b2b2b2",
          200: "#edecec",
          300: "#d0d1d3",
          400: "#d9d9d9",
          500: "#999",
          600: "#6B7C85",
        },
        cyellow: {
          200: "#f0ebe3",
          400: "#FFEBCF",
          500: "#f1c40f",
        },
        cwhite: {
          500: "#F0F4F9",
        },
        cgreen: {
          200: "#D9FDD3",
          500: "#07bc0c",
        },
        cblue: {
          500: "#003BD2",
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
        sd2: "0px 1px 10px 0px rgba(0,0,0,0.1), 0px 2px 15px 0px rgba(0,0,0,0.05)",
      },
    },
  },
  important: true,
  plugins: [],
};
