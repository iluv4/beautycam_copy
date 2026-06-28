import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // LoveCam pink palette pulled from the screenshots
        lovepink: {
          50: "#fff1f6",
          100: "#ffe3ee",
          200: "#ffc9de",
          300: "#ffa6c9",
          400: "#ff6fa8",
          500: "#ff3d86",
          600: "#ec1e6a",
          700: "#b91550",
        },
        ink: "#1c1c1e",
      },
      fontFamily: {
        sans: ["Pretendard", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        card: "0 6px 24px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
