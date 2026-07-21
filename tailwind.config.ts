import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17202a",
        amazon: "#ff9900",
      },
      boxShadow: {
        canvas: "0 18px 48px rgba(15, 23, 42, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
