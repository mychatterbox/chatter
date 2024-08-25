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
      colors: {     // 배경색 추가
        'custom-dark': '#121212', 
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
