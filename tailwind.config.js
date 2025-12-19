/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl" : "1440px",  // ← مطابق بزرگ‌ترین فریم فیگما
      },
    },

    extend: {
      colors: {
        primary: "#0d9488",  // رنگ اصلی (قابل تغییر)
        dark: "#0f172a",
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },

  plugins: [],
};
