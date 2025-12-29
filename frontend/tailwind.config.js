/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "mesh": "radial-gradient(circle at 20% 20%, rgba(124, 58, 237, 0.12), transparent 25%), radial-gradient(circle at 80% 0%, rgba(34, 211, 238, 0.12), transparent 28%), linear-gradient(145deg, #0f172a 0%, #0b1020 100%)",
      },
      colors: {
        surface: "#0b1020",
        card: "#11182c",
      },
    },
  },
  plugins: [],
};

