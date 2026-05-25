import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FBBF24", // Amarelo característico (MotoSango)
        dark: "#1F2937", // Cinza escuro/preto
      },
    },
  },
  plugins: [],
};
export default config;
