const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["src/**/*.{astro,svelte,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Pretendard"', ...defaultTheme.fontFamily.sans],
        mono: ['"Berkeley Mono"', ...defaultTheme.fontFamily.mono],
      },
      colors: {
        'custom-dark': '#121212', // 새 색상 추가
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
