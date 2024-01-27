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
        border: {
          100: "#cec9c1",
        },
        cblack: {
          400: "#111B21",
          500: "#1c1e21",
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
    },
  },
  important: true,
  plugins: [],
};
