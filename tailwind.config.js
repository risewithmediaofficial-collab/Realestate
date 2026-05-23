/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1a2b4e",
          dark: "#142340",
          light: "#243a66",
        },
        orange: {
          DEFAULT: "#e67e22",
          hover: "#cf6d12",
          light: "#fdf0e6",
        },
        surface: "#f4f7f9",
        ink: "#1a2b4e",
        stone: "#f4f7f9",
        clay: "#e8edf2",
        sage: "#e67e22",
        sand: "#f4f7f9",
        primary: "#1a2b4e",
        accent: "#e67e22",
        powder: "#fdf0e6",
        text: {
          primary: "#1a2b4e",
          secondary: "#5a6578",
          tertiary: "#8b95a5",
          light: "#c5cdd8",
        },
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.01em" }],
        sm: ["0.875rem", { lineHeight: "1.25rem", letterSpacing: "0.005em" }],
        base: ["1rem", { lineHeight: "1.5rem", letterSpacing: "0em" }],
        lg: ["1.125rem", { lineHeight: "1.75rem", letterSpacing: "0em" }],
        xl: ["1.25rem", { lineHeight: "1.75rem", letterSpacing: "-0.02em" }],
        "2xl": ["1.5rem", { lineHeight: "2rem", letterSpacing: "-0.02em" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem", letterSpacing: "-0.03em" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem", letterSpacing: "-0.04em" }],
        "5xl": ["3rem", { lineHeight: "1.2", letterSpacing: "-0.04em" }],
        "6xl": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.05em" }],
      },
      boxShadow: {
        soft: "0 8px 24px rgba(26, 43, 78, 0.08)",
        card: "0 4px 20px rgba(26, 43, 78, 0.1)",
        search: "0 12px 40px rgba(26, 43, 78, 0.15)",
      },
      borderRadius: {
        card: "12px",
      },
      fontFamily: {
        sans: ["Inter", "Manrope", "ui-sans-serif", "system-ui"],
      },
      screens: {
        xs: "320px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
  plugins: [],
};
