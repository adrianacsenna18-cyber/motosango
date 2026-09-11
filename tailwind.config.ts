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
        primary: "#FFC400", // Amarelo oficial MotoSango
        dark: "#000000", // Preto absoluto oficial
      },
      animation: {
        'bounceMoto': 'bounceMoto 2s ease-in-out infinite',
        'wind': 'wind 1s linear infinite',
        'slideLeft': 'slideLeft 1s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'pulseYellow': 'pulseYellow 3s ease-in-out infinite',
      },
      keyframes: {
        bounceMoto: {
          '0%, 100%': { transform: 'translateY(0) translateX(-2px) rotate(0deg)' },
          '50%': { transform: 'translateY(-2px) translateX(4px) rotate(2deg)' },
        },
        wind: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateX(-40px)', opacity: '0' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)' },
          '100%': { transform: 'translateX(-40px)' },
        },
        pulseYellow: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(255, 196, 0, 0.22), 0 0 0 0 rgba(255, 196, 0, 0.0)' },
          '50%': { boxShadow: '0 0 18px rgba(255, 196, 0, 0.38), 0 0 0 6px rgba(255, 196, 0, 0.04)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
