import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#090B10",
        panel: "#12151D",
        accent: "#E94358",
        gold: "#E6BD72"
      },
      fontFamily: {
        sans: ["Arial", "Tahoma", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;