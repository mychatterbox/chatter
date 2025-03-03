const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["src/**/*.{astro,svelte,ts}"],
  theme: {
    extend: {
      fontFamily: {
        // cv12 : ... 를 한국어화, zero = slash 0
        sans: [['"Pretendard"', ...defaultTheme.fontFamily.sans], { fontFeatureSettings: '"cv12"'  },],
        mono: [['"CascadiaCode"', ...defaultTheme.fontFamily.mono],   { fontFeatureSettings: '"zero"'  },],
      },
      colors: {     // 모바일 기기 상단의 배경색
        'custom-dark': '#121212', 
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
