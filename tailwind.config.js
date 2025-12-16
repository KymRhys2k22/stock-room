// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export const darkMode = "class";
export const content = ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"];
export const theme = {
  extend: {
    keyframes: {
      movebody: {
        "0%,100%": { transform: "translateX(0%)" },
        "50%": { transform: "translateX(2%)" },
      },
      moveleg: {
        "0%,100%": { transform: "rotate(-45deg) translateX(-5%)" },
        "50%": { transform: "rotate(45deg) translateX(5%)" },
      },
      moveleg2: {
        "0%,100%": { transform: "rotate(45deg)" },
        "50%": { transform: "rotate(-45deg)" },
      },
      moveline: {
        "0%": { transform: "translateX(0%)", opacity: "0" },
        "5%": { opacity: "1" },
        "95%": { opacity: "1" },
        "100%": { transform: "translateX(-70%)", opacity: "0" },
      },
    },
    animation: {
      movebody: "movebody 1s linear infinite",
      moveleg: "moveleg 1s linear infinite",
      moveleg2: "moveleg2 1s linear infinite 75ms",
      moveline: "moveline 10s linear infinite",
    },
  },
};
export const plugins = [];
