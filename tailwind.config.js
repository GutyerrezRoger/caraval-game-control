/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        title: ['"Cinzel"', "serif"],
        body: ['"Lato"', "sans-serif"],
        hand: ['"Dancing Script"', "cursive"],
      },
      colors: {
        magia: {
          bg: "#05020a",
          gold: "#c5a059",
          red: "#8a0b18",
          paper: "#eaddcf",
        },
      },
      backgroundImage: {
        starry: "radial-gradient(circle at center, #1a0b2e 0%, #000000 100%)",
      },
      keyframes: {
        // CORREÇÃO AQUI: Removemos o 'rotate' e deixamos só o translate
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        stomp: {
          "0%": { transform: "scale(3) rotate(-15deg)", opacity: "0" },
          "50%": { transform: "scale(0.9) rotate(-15deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(-15deg)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite", // Mais suave (6s)
        stomp: "stomp 0.3s ease-out forwards",
        "fade-in": "fade-in 1s ease-out forwards",
      },
    },
  },
  plugins: [],
};
