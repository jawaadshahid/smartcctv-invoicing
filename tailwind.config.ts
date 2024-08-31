import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/colors/themes")["[data-theme=light]"],
          "base-200": "#E8F9FD",
          "base-300": "#94E2F5",
          primary: "#03364F",
          secondary: "#2BC6EB",
          accent: "#0AD2A5",
          "neutral": "#03364F",
          "neutral-content": "#0AD2A5",
          "base-content": "#03364F",
          info: "#2BC6EB",
          success: "#0AD2A5",
        },
        dark: {
          ...require("daisyui/src/colors/themes")["[data-theme=dark]"],
          "base-100": "#022131",
          "base-200": "#01151E",
          "base-300": "#010F16",
          primary: "#03364F",
          secondary: "#2BC6EB",
          accent: "#0AD2A5",
          "neutral": "#03364F",
          "neutral-content": "#0AD2A5",
          "base-content": "#2BC6EB",
          info: "#2BC6EB",
          success: "#0AD2A5",
        },
      },
    ],
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
} satisfies Config;
