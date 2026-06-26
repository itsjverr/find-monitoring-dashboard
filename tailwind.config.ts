import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        nd: {
          50: "#eef6ff",
          100: "#d8ebff",
          500: "#1976d2",
          600: "#0f5eb8",
          700: "#0b4b93"
        },
        ink: "#17191f",
        paper: "#f7f6f2"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(25, 28, 34, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
