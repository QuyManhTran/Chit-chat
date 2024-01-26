/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
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
      },
    },
  },
  important: true,
  plugins: [],
};
